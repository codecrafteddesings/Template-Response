# AGENTS.md — react_temp

## Commands

| Command                                                     | What                                   |
| ----------------------------------------------------------- | -------------------------------------- |
| `npm run dev`                                               | Vite dev (port 5173)                   |
| `npm run dev:api`                                           | API server with nodemon (port 3001)    |
| `npm run dev:full`                                          | Both concurrently                      |
| `npm run build`                                             | `tsc -b && vite build` (order matters) |
| `npm run lint`                                              | ESLint (flat config)                   |
| `npm test` / `npm run test:watch` / `npm run test:coverage` | Vitest                                 |
| `npm run test:e2e` / `test:e2e:ui`                          | Playwright (e2e/)                      |

## Structure

- Two independent packages in one repo: root (React/Vite) + `api-server/` (Express/Mapepire)
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

# api-server .env: DB2_HOST, DB2_USER, DB2_PASS, PORT, etc.
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

- Express + Mapepire connecting to IBM i via stored procedure `SP_VALIDTC`
- Users stored in-memory array (lost on restart)
- Rate limit: 100 requests per 15 min on `/api/`
- Dashboard queries AS400 table `TABCLI03` directly
- `src/services/clienteService.ts` posts to `ClientFormt/validar` — verify endpoint matches api-server routes

---

## Agent Routing Instructions

Use the following subagents when the user's request matches the topic. Launch them via the Task tool with `subagent_type` matching the agent name below.

### 🔒 Security Auditor

**Subagent type:** `Security Auditor`  
**Config file:** `.opencode/agents/security-auditor.md`

Use this agent when the user mentions or implies any of:

- Security, vulnerabilities, CVEs
- Audit, penetration testing, hardening
- Authentication, authorization, session management flaws
- SQL injection, XSS, CSRF, command injection
- Secrets exposure, hardcoded credentials, encryption
- CORS, CSP, security headers
- Dependency vulnerabilities (`npm audit`)
- OWASP, security best practices
- Rate limiting, input validation, access control
- Stored procedure security, Mapepire connection security

**When to delegate:**

- User asks "revisa la seguridad", "audita", "haz un análisis de seguridad"
- User reports a potential vulnerability or asks how to fix one
- User asks about security implications of a change
- Before any deployment or production release, proactively suggest a security review

### 📄 Documentation Specialist

**Subagent type:** `documentation-specialist`  
**Config file:** `.opencode/agents/documentation-specialist.md`

Use this agent when the user mentions or implies any of:

- Documentation, docs, README, guides, manuals
- Technical writing, changelogs, API references
- Code comments, docstrings, inline documentation
- Creating or updating any `.md` file in the project
- User manuals, onboarding guides, release notes

**When to delegate:**

- User says "documenta esto", "crea un documento", "actualiza la documentación"
- User asks for a changelog or release notes
- A feature is completed and needs accompanying docs
- User asks to review or improve existing documentation
- After a major refactor or API change, proactively suggest doc updates

### 🧭 Exploration Agent

**Subagent type:** `explore`

Use this agent for quick codebase exploration:

- Finding files by pattern or content
- Understanding how existing features work
- Mapping dependencies and imports
- Answering "how does X work?" questions

### ⚙️ General Agent

**Subagent type:** `general`

Use this agent for multi-step research or complex tasks that don't fit the specialized agents above.

---

## Routing Priority

When a request matches multiple agents:

1. **Security takes precedence** — if the request has any security dimension, route to Security Auditor first
2. **Documentation** — if the primary ask is about docs, route to Documentation Specialist
3. **Exploration** — for quick lookups and codebase questions
4. **General** — for everything else

If the request combines documentation + security (e.g., "documenta las vulnerabilidades"), use the Security Auditor to generate the findings, then feed the result to the Documentation Specialist for formatting.

---

## Documentación del Proyecto

La documentación principal del proyecto se encuentra en `docs/`. Archivos existentes:

| Archivo                            | Descripción                                          |
| ---------------------------------- | ---------------------------------------------------- |
| `docs/documentacion-aplicacion.md` | Documentación técnica + análisis de vulnerabilidades |

Antes de crear documentación nueva, verificar si ya existe un documento relevante en `docs/` y actualizarlo en lugar de duplicar.
