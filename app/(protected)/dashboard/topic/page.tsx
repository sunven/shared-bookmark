'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, Edit, Eye, Plus, Search, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useSWR from 'swr'
import { http } from '@/lib/http'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import { DeleteDialog } from '@/components/delete-dialog'
import { toast } from 'sonner'
import { isEmpty } from 'lodash-es'
import { DashboardHeader } from '@/components/dashboard/header'

type Topic = {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  _count: {
    urls: number
  }
}

export const dynamic = 'force-dynamic'

export default function TopicPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const selectedIds = useMemo(() => {
    return Object.entries(rowSelection)
      .filter(([_, value]) => value)
      .map(([key]) => key)
  }, [rowSelection])
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState<string>('')
  const setNamePageIndex = useCallback(() => {
    const value = inputRef.current?.value || ''
    setName(value)
    setPagination({ ...pagination, pageIndex: 0 })
  }, [pagination])
  const params = useMemo(() => {
    return { ...pagination, name }
  }, [name, pagination])
  const { data, isLoading, error, mutate } = useSWR<{ count: number; rows: Topic[] }>(['/api/topic', params], http.get)
  const columns: ColumnDef<Topic>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
          const maxLength = 40
          if (!row.original.description || row.original.description?.length <= maxLength) {
            return row.original.description
          }
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p>{row.original.description?.substring(0, 40)}...</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-80">{row.original.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'CreatedAt',
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
      },
      {
        accessorKey: 'updatedAt',
        header: 'UpdatedAt',
        cell: ({ row }) => new Date(row.original.updatedAt).toLocaleString(),
      },
      {
        accessorKey: '_count.urls',
        header: 'url count',
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <div className="flex gap-2">
              <Link className="text-blue-500" href={`/dashboard/topic/${row.original.id}`}>
                <Eye className="h-4 w-4 cursor-pointer" />
              </Link>
              <Link className="text-blue-500" href={`/dashboard/topic/edit/${row.original.id}`}>
                <Edit className="h-4 w-4 cursor-pointer" />
              </Link>
              <DeleteDialog
                className="h-4 w-4"
                onDelete={() => {
                  http.delete(`/api/topic/${row.original.id}`).then(() => {
                    toast.success('删除成功')
                    mutate()
                  })
                }}
              />
            </div>
          )
        },
      },
    ],
    [mutate]
  )

  const defaultData = React.useMemo(() => [], [])
  const table = useReactTable({
    getRowId: row => row.id,
    data: data?.rows || defaultData,
    rowCount: data?.count,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  return (
    <div className="w-full">
      <DashboardHeader heading="Topics" text="topics" />
      <div className="flex gap-2 items-center py-4">
        <Input
          placeholder="Filter names..."
          ref={inputRef}
          onKeyDown={event => {
            if (event.code === 'Enter') setNamePageIndex()
          }}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          onClick={() => {
            setNamePageIndex()
          }}
        >
          <Search />
        </Button>
        <Link href="/dashboard/topic/new">
          <Button type="button" variant="outline">
            <Plus />
            Add
          </Button>
        </Link>
        {!isEmpty(selectedIds) && (
          <DeleteDialog
            onDelete={() => {
              http.delete('/api/topic', { ids: selectedIds }).then(() => {
                toast.success('删除成功')
              })
            }}
          >
            <Button variant="destructive">
              <Trash2 />
              Delete
            </Button>
          </DeleteDialog>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
