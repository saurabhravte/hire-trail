import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { Button } from '@/components/ui/button'

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="flex items-center justify-between p-2">
        <nav className="flex gap-2">
          <Link to="/" className="[&.active]:font-bold">Home</Link>
          <Link to="/about" className="[&.active]:font-bold">About</Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="outline">Sign in</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Sign up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})