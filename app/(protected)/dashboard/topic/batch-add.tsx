'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { http } from '@/lib/http'
import { useState } from 'react'

export function BatchAdd({ children, onResolved }) {
  const [urls, setUrls] = useState('')
  const [visible, setVisible] = useState(false)
  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Batch add url</DialogTitle>
          <DialogDescription>每行一个url</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={urls}
            onChange={e => {
              setUrls(e.target.value)
            }}
            rows={10}
            className="col-span-5"
            placeholder="每行一个url"
          ></Textarea>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={async () => {
              const data = await http.get('/api/resolveUrl', { urls })
              onResolved(data)
              setVisible(false)
            }}
          >
            Resolve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
