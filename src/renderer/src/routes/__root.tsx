import { createRootRoute, createRoute } from '@tanstack/react-router'

// list of pages
import Dashsboard from '@renderer/pages/Dashsboard'
import Settings from '@renderer/pages/Settings'
import Employee from '@renderer/pages/Employee'
import Layouts from '@renderer/components/Layouts'
import AppBanner from '@renderer/components/AppBanner'

export const Route = createRootRoute({
  component: () => <Layouts />
})

const appRoute = createRoute({
  getParentRoute: () => Route,
  path: '/',
  component: () => <AppBanner />
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
