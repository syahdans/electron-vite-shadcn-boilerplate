import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createHashHistory, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from '@renderer/routes/__root'

// Create a new router instance
const hasHistory = createHashHistory()
const router = createRouter({
  routeTree: routeTree,
  history: hasHistory
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
