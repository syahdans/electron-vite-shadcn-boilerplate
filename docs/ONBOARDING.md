# Project Onboarding Guide

## Overview
This repository bootstraps an Electron desktop application that uses React + TypeScript in the renderer, Tailwind-based shadcn/ui components for styling, and electron-vite for fast development and bundling. The app already ships a sidebar-driven HR dashboard, employee tools, NFC reader integration, and packaging scripts for Windows, macOS, and Linux.

## High-level architecture
- **Electron main process** (`src/main/index.ts`): creates the primary `BrowserWindow`, wires security defaults, registers IPC handlers, and starts an `nfc-pcsc` listener so attached NFC readers can stream card events to the app.【F:src/main/index.ts†L7-L105】
- **Preload bridge** (`src/preload/index.ts`): exposes the safe Electron APIs to the renderer via `contextBridge`, and is ready for custom APIs you might add later.【F:src/preload/index.ts†L1-L22】
- **Renderer bundle** (`src/renderer/src`): a React SPA served by Vite. Routing is handled by TanStack Router with a generated `routeTree` mounted to a hash history, making navigation work out-of-the-box inside Electron without server support.【F:src/renderer/src/main.tsx†L3-L29】【F:src/renderer/src/routes/__root.tsx†L1-L31】

These layers communicate through the preload bridge. Keeping business logic in the renderer and hardware/OS access in the main process keeps the app secure and maintainable.

## Project layout
```
src/
  main/        # Electron main process
  preload/     # Context bridge definitions
  renderer/
    assets/    # Tailwind entrypoint & design tokens
    components/# shadcn/ui building blocks and layout primitives
    pages/     # Route-level views
    routes/    # TanStack Router definitions
    data.json  # Sample HR data for the dashboard
```
Other notable files:
- `package.json` – development scripts, dependency lists, and builder targets.【F:package.json†L1-L56】
- `electron-builder.yml` / platform-specific configs – configure packaging & updates (see `electron-builder.yml`).

## Renderer structure
- **Global layout**: `Layouts.tsx` wraps every page with the shadcn/ui sidebar, breadcrumb header, and an `<Outlet />` for nested routes.【F:src/renderer/src/components/Layouts.tsx†L1-L41】 Navigation items live in `app-sidebar.tsx`, which renders primary sections and sub-links using TanStack Router `<Link>` components.【F:src/renderer/src/components/app-sidebar.tsx†L1-L105】
- **Pages**: `Dashsboard.tsx`, `Employee.tsx`, and `Settings.tsx` demonstrate how to compose shadcn/ui cards, forms, and icons. The dashboard page consumes mock company metadata, branch lists, and turnover metrics from `data.json` and maps them into custom card components.【F:src/renderer/src/pages/Dashsboard.tsx†L1-L123】【F:src/renderer/src/data.json†L2-L115】
- **UI system**: `assets/main.css` imports Tailwind and defines design tokens (colors, radii, shadows) using CSS custom properties so the shadcn/ui components share a consistent theme.【F:src/renderer/src/assets/main.css†L1-L150】 Hooks like `useIsMobile` encapsulate responsive helpers for the sidebar experience.【F:src/renderer/src/hooks/use-mobile.ts†L1-L19】

## Main-process NFC integration
The main process bootstraps an `NFC` instance from `nfc-pcsc` and listens for reader attachment/removal, card detection, and errors. This logging infrastructure is a starting point for propagating card data to the renderer through IPC once custom handlers are added.【F:src/main/index.ts†L66-L104】

## Build, test, and developer tooling
- `npm run dev` – launches the Electron+Vite development environment with hot reloads.【F:package.json†L8-L21】
- `npm run lint`, `npm run typecheck` – keep TypeScript and ESLint happy before commits.【F:package.json†L8-L15】
- `npm run build` – creates production bundles for all processes; `npm run build:win|mac|linux` invoke electron-builder for platform-specific artifacts.【F:package.json†L8-L33】
- `npm run start` – preview a built app using electron-vite’s preview mode.【F:package.json†L8-L15】

## Working effectively in this codebase
1. **Renderer-first development**: Iterate on React components inside `src/renderer/src`, using TanStack Router for navigation and shadcn/ui primitives for consistent look-and-feel.
2. **Bridge hardware features carefully**: When extending NFC or other hardware features, add logic in the main process, expose a typed API in `preload`, and consume it from React via hooks or context.
3. **Keep styles composable**: Reuse or extend the Tailwind tokens in `assets/main.css` to stay aligned with the design system.
4. **Manage data sources**: Replace `data.json` with real API clients as you integrate backends. Consider co-locating query hooks under `src/renderer/src/lib` or `hooks`.

## Suggested next steps for newcomers
- Read through `src/main/index.ts` to understand Electron’s lifecycle and where to register IPC handlers for device communication.【F:src/main/index.ts†L7-L115】
- Explore the shadcn/ui primitives under `src/renderer/src/components/ui` to learn what building blocks are already available.
- Experiment with TanStack Router by adding a new page module and registering it in `__root.tsx` to get comfortable with route configuration.【F:src/renderer/src/routes/__root.tsx†L9-L31】
- Prototype propagating NFC card events to the UI by defining IPC channels in `preload` and consuming them from a React hook.
- Review the packaging configs (`electron-builder.yml`, platform scripts) before preparing distributables so you know how updates and signing are handled.

Happy building!
