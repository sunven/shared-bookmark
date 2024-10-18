'use client'
import { toast } from '@/hooks/use-toast'
import { SWRConfig } from 'swr'
export const SWRProvider = ({ children }) => {
  return (
    <SWRConfig
      value={{
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        onError: (error, key) => {
          if (error.status !== 403 && error.status !== 404) {
            toast({
              // title: 'You submitted the following values:',
              description: '保存成功',
            })
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
