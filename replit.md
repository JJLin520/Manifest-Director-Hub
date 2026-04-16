# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

| Artifact | Path | Purpose |
|---|---|---|
| `manifestation-director` | `/` | Brand site + 顯化導演系統 course page |
| `temple-event` | `/temple-event/` | 雲陽寺活動報名頁面 |
| `admin` | `/admin/` | CRM 後台管理系統 |
| `api-server` | `/api/` | Express API server |

## Database Schema

Tables (PostgreSQL via Drizzle):
- `contacts` — 客戶聯絡資料 (name, phone, lineId, email, paymentStatus, customerStage, notes)
- `registrations` — 活動報名記錄，關聯 contacts (eventName, attendees, hasLantern, referralSource, paymentStatus, notes)

## API Routes

- `POST /api/registrations` — 新報名 (public, upserts contact by phone)
- `GET /api/admin/registrations` — 所有報名 (with contact join)
- `GET /api/admin/contacts` — 所有客戶
- `PATCH /api/admin/contacts/:id` — 更新客戶 (paymentStatus, customerStage, notes, email)
- `PATCH /api/admin/registrations/:id` — 更新報名 (paymentStatus, notes)
