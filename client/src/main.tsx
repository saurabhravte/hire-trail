import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fontsource-variable/manrope"
import './index.css'
import { ThemeProvider } from './components/providers/theme-provider.tsx'

import { RouterProvider, createRouter } from '@tanstack/react-router'


import { routeTree } from './routeTree.gen'


const router = createRouter({ routeTree })

// Register the router instance for type safety
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
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>,
  )
}