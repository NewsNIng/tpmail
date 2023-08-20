import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'

import { api } from '@/utils/api'

import '@/styles/globals.css'
import Script from 'next/script'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <Script
        async
        src='https://analytics.umami.is/script.js'
        data-website-id='8833a982-0876-4676-9f77-79603384d445'
      />
    </>
  )
}

export default api.withTRPC(MyApp)
