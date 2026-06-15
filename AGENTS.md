# AGENTS.md — react_temp

## Commands

| Command | What |
|---|---|
| `npm run dev` | Vite dev (port 5173) |
| `npm run dev:api` | API server with nodemon (port 3001) |
| `npm run dev:full` | Both concurrently |
| `npm run build` | `tsc -b && vite build` (order matters) |
| `npm run lint` | ESLint (flat config) |
| `npm test` / `npm run test:watch` / `npm run test:coverage` | Vitest |
| `npm run test:e2e` / `test:e2e:ui` | Playwright (e2e/) |

## Structure

- Two independent packages in one repo: root (React/Vite) + `api-server/` (Express/ODBC)
- Feature-first: `src/features/{name}/` with pages/, components/, services.ts, types.ts, store.ts
- Global components in `src/components/ui/`, layout in `src/components/layout/`
- Global state: `src/store/` (themeStore, uiStore) + `features/auth/store.ts` (persisted with zustand/middleware)

## Aliases (Vite + tsconfig)

`@/` → src, `@ui/` → src/components/ui, `@features/` → src/features, `@hooks/`, `@services/`, `@store/`, `@shared/` → shared/

## Quirks

- `tsconfig.json` uses project references (`tsconfig.app.json` + `tsconfig.node.json`). Build runs `tsc -b` first.
- `verbatimModuleSyntax` enabled → must use `import type` for type-only imports
- `noUnusedLocals` and `noUnusedParameters` are on
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (no postcss.config, no @tailwind directives)
- Husky pre-commit runs `lint-staged` (ESLint --fix + Prettier --write on ts/tsx, Prettier on json/md)
- Commit messages must follow conventional commits (`feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`)

## Setup

```bash
# root .env: VITE_API_URL=http://localhost:3001/api
cp .env.example .env

# api-server .env: ODBC_CONN, PORT, etc.
cp api-server/.env.example api-server/.env

npm install
cd api-server && npm install
```

## Test quirks

- Vitest setup (`src/test/setup.ts`) mocks localStorage, IntersectionObserver, ResizeObserver
- Unit tests co-located in `__tests__/` per feature or `src/store/__tests__/`
- E2E tests rely on the Vite dev server (Playwright config auto-starts it)
- Auth uses localStorage-based mock (not real API) — users registered in tests won't exist on the real api-server

## API Server notes

- Express + ODBC connecting to IBM i via stored procedure `SP_VALIDTC`
- Users stored in-memory array (lost on restart)
- Rate limit: 100 requests per 15 min on `/api/`
- Dashboard queries AS400 table `TABCLI03` directly
- `src/services/clienteService.ts` posts to `ClientFormt/validar` — verify endpoint matches api-server routes
