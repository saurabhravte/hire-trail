import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { ClerkProvider } from '@clerk/react'
import { ThemeProvider } from './components/providers/theme-provider.tsx'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { warmUpServer } from './lib/warmup'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local')
}

// Silent server warm-up so a cold backend wakes before first real request.
warmUpServer()

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" appearance={{ variables: { fontFamily: '"Manrope Variable", sans-serif' } }}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </ClerkProvider>
    </StrictMode>,
  )
}