import { createRootRoute, createRoute } from '@tanstack/react-router'

// list of pages
import Dashsboard from '@renderer/pages/Dashsboard'
import Settings from '@renderer/pages/Settings'
import Employee from '@renderer/pages/Employee'
import Layouts from '@renderer/components/Layouts'

export const Route = createRootRoute({
  component: () => <Layouts />
})

const appRoute = createRoute({
  getParentRoute: () => Route,
  path: '/',
  component: () => <div>HR x Talenta App v1.0.0</div>
})
const dashboardRoute = createRoute({
  getParentRoute: () => Route,
  path: '/dashboard',
  component: () => <Dashsboard />
})

const settingsRoute = createRoute({
  getParentRoute: () => Route,
  path: '/settings',
  component: () => <Settings />
})

const employeeRoute = createRoute({
  getParentRoute: () => Route,
  path: '/employee',
  component: () => <Employee />
})

export const routeTree = Route.addChildren([appRoute, dashboardRoute, settingsRoute, employeeRoute])
