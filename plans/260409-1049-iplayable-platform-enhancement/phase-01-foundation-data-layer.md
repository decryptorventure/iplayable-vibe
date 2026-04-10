---
phase: 01
title: Foundation & Data Layer
status: todo
priority: critical
effort: 1 week
---

# Phase 01 — Foundation & Data Layer

## Overview

Kết nối Prisma → PostgreSQL thật, bỏ mock-db, chuẩn bị data model cho AI & analytics.

## Key Insights

- `src/lib/mock-db.ts` là in-memory store, không persist. Mọi data mất khi restart.
- Prisma schema đã có (`Project`, `Variant`) nhưng API routes dùng mock-db.
- Cần mở rộng schema để support performance metrics, export history, AI generation logs.
- Screenshots thực tế show 1313 ads → cần pagination server-side, không client-side.

## Requirements

**Functional:**
- PostgreSQL real connection qua Prisma
- Server-side pagination cho `/api/projects` (page, pageSize, search, sort)
- Extended data model: `PerformanceMetric`, `ExportRecord`, `AIGenerationLog`
- Seed script với realistic data structure

**Non-functional:**
- API response time < 200ms cho list queries (index optimization)
- Connection pooling với `@prisma/client` singleton pattern

## Architecture

```
PostgreSQL (DATABASE_URL)
    ↓
Prisma ORM (src/lib/prisma.ts) — singleton
    ↓
API Routes (src/app/api/**/route.ts)
    ↓
React Server Components / Client Stores (Zustand)
```

## Related Code Files

**Modify:**
- `prisma/schema.prisma` — thêm models mới
- `src/app/api/projects/route.ts` — dùng Prisma thay mock-db
- `src/app/api/variants/route.ts` — dùng Prisma thay mock-db
- `src/app/api/ai/generate/route.ts` — log AI requests

**Create:**
- `prisma/migrations/` — auto-generated
- `src/app/api/projects/[id]/route.ts` — GET/PUT/DELETE single project
- `src/app/api/variants/[id]/route.ts` — GET/PUT/DELETE single variant
- `src/app/api/stats/route.ts` — aggregate statistics endpoint

**Delete:**
- `src/lib/mock-db.ts` — replaced by Prisma
- `src/lib/mock-data.ts` — replaced by `prisma/seed.ts`

## Prisma Schema Extensions

```prisma
model Project {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  gameId        String?   // link to game in external system
  status        String    @default("Active")
  totalVariants Int       @default(0)
  avgCTR        Float     @default(0)
  avgCVR        Float     @default(0)
  totalSpend    Float     @default(0)
  thumbnail     String?
  description   String?
  mechanic      String?   // top mechanic type
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  variants      Variant[]
  exports       ExportRecord[]
}

model Variant {
  id              String    @id @default(cuid())
  projectId       String
  project         Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  name            String
  config          Json
  status          String    @default("Draft")  // Draft | Ready | Deployed
  predictedCTR    Float?
  ctr             Float?    // actual from ad network
  cvr             Float?    // actual from ad network
  impressions     Int?      @default(0)
  clicks          Int?      @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  aiGenerationId  String?
  aiGeneration    AIGenerationLog? @relation(fields: [aiGenerationId], references: [id])
  exports         ExportRecord[]
  performanceData PerformanceMetric[]
}

model AIGenerationLog {
  id          String    @id @default(cuid())
  prompt      String
  model       String    // gpt-4o, claude-3-5-sonnet, etc.
  batchSize   Int
  tokensUsed  Int?
  costUsd     Float?
  durationMs  Int?
  createdAt   DateTime  @default(now())
  variants    Variant[]
}

model ExportRecord {
  id          String   @id @default(cuid())
  projectId   String
  variantId   String?
  project     Project  @relation(fields: [projectId], references: [id])
  variant     Variant? @relation(fields: [variantId], references: [id])
  network     String   // AppLovin | Google | Meta | Direct
  status      String   // Pending | Success | Failed
  exportUrl   String?
  fileSizeKb  Int?
  createdAt   DateTime @default(now())
}

model PerformanceMetric {
  id          String   @id @default(cuid())
  variantId   String
  variant     Variant  @relation(fields: [variantId], references: [id])
  network     String
  date        DateTime
  impressions Int      @default(0)
  clicks      Int      @default(0)
  installs    Int      @default(0)
  spend       Float    @default(0)
  ctr         Float?
  cvr         Float?
  roas        Float?
  createdAt   DateTime @default(now())

  @@unique([variantId, network, date])
}
```

## API Endpoints

```
GET  /api/projects?page=1&pageSize=12&search=&sort=createdAt&status=
POST /api/projects
GET  /api/projects/[id]
PUT  /api/projects/[id]
GET  /api/variants?projectId=
POST /api/variants
GET  /api/variants/[id]
GET  /api/stats               → aggregate counts for Statistics page
GET  /api/stats/daily         → daily creation data for charts
GET  /api/stats/mechanics     → top mechanics breakdown
```

## Implementation Steps

1. Update `prisma/schema.prisma` với models trên
2. Run `prisma migrate dev --name "add-extended-models"`
3. Update `prisma/seed.ts` với realistic sample data (10-20 projects, 50 variants)
4. Update `src/app/api/projects/route.ts`:
   - Thêm server-side pagination với `skip/take`
   - Thêm search với `where: { name: { contains: search } }`
   - Thêm sort: `orderBy: { [sort]: 'desc' }`
   - Trả về `{ data, total, page, pageSize }`
5. Update `src/app/api/variants/route.ts` tương tự
6. Create `src/app/api/stats/route.ts` với aggregate queries
7. Update `src/store/use-project-store.ts` cho new pagination response
8. Delete `src/lib/mock-db.ts` và `src/lib/mock-data.ts`
9. Update imports trong API routes
10. Run `prisma db push` + `prisma:seed` để test

## Todo List

- [ ] Mở rộng `prisma/schema.prisma`
- [ ] `prisma migrate dev`
- [ ] Update `prisma/seed.ts`
- [ ] Refactor `/api/projects/route.ts` → Prisma
- [ ] Refactor `/api/variants/route.ts` → Prisma
- [ ] Create `/api/projects/[id]/route.ts`
- [ ] Create `/api/variants/[id]/route.ts`
- [ ] Create `/api/stats/route.ts`
- [ ] Update `use-project-store.ts` pagination
- [ ] Delete mock files
- [ ] Test với seed data

## Success Criteria

- `GET /api/projects?page=1&pageSize=12` trả đúng 12 items + total count
- Search và sort hoạt động
- Variants persist sau restart
- Stats endpoint trả aggregate data

## Risk Assessment

- **Risk:** DATABASE_URL chưa được cấu hình → seed `prisma:seed` thất bại
- **Mitigation:** Cung cấp `.env.example`, check env trước migrate
