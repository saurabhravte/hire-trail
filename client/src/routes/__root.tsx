// src/routes/__root.tsx
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ModeToggle } from '@/components/ui/mode-toggle'

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="flex items-center justify-between p-2">
        <nav className="flex gap-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
        </nav>
        <ModeToggle />
      </header>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})