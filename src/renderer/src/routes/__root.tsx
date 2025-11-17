import { createRootRoute, createRoute } from '@tanstack/react-router'

// list of pages
import Settings from '@renderer/pages/Settings'
import Employee from '@renderer/pages/Employee'
import Nfc from '@renderer/pages/Nfc'
import Layouts from '@renderer/components/Layouts'

export const Route = createRootRoute({
  component: () => <Layouts />
})

const appRoute = createRoute({
  getParentRoute: () => Route,
  path: '/',
  component: () => <Employee />
})

const settingsRoute = createRoute({
  getParentRoute: () => Route,
  path: '/settings',
  component: () => <Settings />
})
const nfcRoute = createRoute({
  getParentRoute: () => Route,
  path: '/nfc',
  component: () => <Nfc />
})

// const employeeRoute = createRoute({
//   getParentRoute: () => Route,
//   path: '/employee',
//   component: () => <Dashsboard />
// })

export const routeTree = Route.addChildren([appRoute, settingsRoute, nfcRoute])
