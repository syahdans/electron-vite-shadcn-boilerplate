Agent Guide for electron-vite-app

Scope

- Applies to the entire repository unless otherwise noted.

Tech Stack

- Electron + Vite
- React 19 + TypeScript
- Tailwind CSS for styling
- Radix UI primitives wrapped in `src/renderer/src/components/ui`

Conventions

- Components
  - Prefer small, focused React function components.
  - Co-locate component logic and JSX; avoid premature abstraction.
  - Reuse existing UI primitives from `src/renderer/src/components/ui` (e.g., `button`, `card`, `table`, `input`).
  - Do not use type props

- Styling
  - Use Tailwind utility classes already present in the project.
  - Keep class lists readable; group by layout → spacing → color → misc.
  - User Interface must be Responsive

- Imports
  - Use the `@renderer` alias for renderer-side imports (e.g., `@renderer/components/ui/button`).
  - Avoid introducing new aliases or external deps unless requested.

- Data
  - Use local fixtures such as `src/renderer/src/data.json` when possible.
  - Do not add network calls; this app runs offline in development.

- Performance
  - Compute derived values outside JSX where feasible.
  - Memoize derived collections only when rendering cost becomes noticeable.
  - Avoid unnecessary re-renders by lifting constants outside components when safe.

- Code Style
  - Follow the existing patterns in `src/renderer/src/pages` and `components/ui`.
  - Keep changes minimal and focused on the task.
  - Do not add comments in code unless explicitly requested.

Project Structure

- `src/main` – Electron main process.
- `src/preload` – Preload scripts.
- `src/renderer/src` – React app (pages, components, assets, fixtures).
  - `pages/` – Route pages like `Employee.tsx`, `Settings.tsx`.
  - `components/ui/` – Reusable UI primitives.
  - `data.json` – Local sample data.

Tasks & Validation

- Prefer surgical edits. Do not refactor unrelated areas.
- If a task references a comment placeholder, implement only that scope and remove the placeholder comment.
- When ambiguous, ask for the exact file and line reference before making broad changes.

Run & Build

- Dev: `npm run dev`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Format: `npm run format`
- Build: `npm run build`
- Preview: `npm start`

Notes for Future Agents

- Many UI placeholders read "tables"; replace with `components/ui/table` when implementing list views.
- Moment.js is used for date display in pages; keep consistency unless otherwise requested.

