'use client'

import { LogOut, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { signOut, useSession } from 'next-auth/react'

export function NavUser() {
  const { data } = useSession()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={data?.user?.image || ''} alt={data?.user?.name || ''} />
            <AvatarFallback className="rounded-lg">
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{data?.user?.name}</p>
            <p className="text-sm text-muted-foreground">{data?.user?.email}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
