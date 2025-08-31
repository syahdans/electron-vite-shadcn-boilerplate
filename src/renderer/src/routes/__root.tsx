import { Link, Outlet, createRootRoute, createRoute } from '@tanstack/react-router'

// list of pages
import Dashsboard from '@renderer/pages/Dashsboard'
import Settings from '@renderer/pages/Settings'

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="p-2 flex gap-2 bg-white text-black justify-between">
        <nav className="flex flex-row">
          <div className="px-2 font-bold">
            <Link className="m-2" to="/">
              Home
            </Link>
            <Link className="m-2" to="/settings">
              Settings
            </Link>
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  )
})

const dashboardRoute = createRoute({
  getParentRoute: () => Route,
  path: '/',
  component: () => <Dashsboard />
})

const settingsRoute = createRoute({
  getParentRoute: () => Route,
  path: '/settings',
  component: () => <Settings />
})

export const routeTree = Route.addChildren([dashboardRoute, settingsRoute])
