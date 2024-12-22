'use client'
import { SWRConfig } from 'swr'
export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        onError: (error, key) => {
          console.error(key, error)
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
