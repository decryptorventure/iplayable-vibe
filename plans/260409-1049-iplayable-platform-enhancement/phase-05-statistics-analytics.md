---
phase: 05
title: Statistics & Analytics Enhancement
status: todo
priority: medium
effort: 1 week
---

# Phase 05 — Statistics & Analytics Enhancement

## Overview

Build real statistics dashboard dựa trên data từ Phase 1 (DB) và Phase 6 (ad network metrics). Trực quan hóa performance, trends, và insights.

## Key Insights từ Screenshots

**Stats page hiện có:**
- 4 cards: Tổng (162), Active (162), Tổng Export (1185), Networks Export (4794)
- Pie chart "Trạng thái" (Active/Inactive) — chỉ 2 categories
- Line chart "Tạo mới theo ngày" — daily creation trend
- "Top mechanics" — EMPTY (cần data)
- "Images / playable" bar chart — unclear labels

**Gaps cần fill:**
- Top mechanics cần real mechanic data từ variants
- Cần filter by date range
- Cần performance metrics (CTR/CVR per project)
- Cần network breakdown (AppLovin vs Google vs Meta)
- Creator leaderboard (who generates most)
- AI generation cost tracker

## Requirements

**KPI Cards:**
- Tổng playable ads
- Active (deployed) count
- Tổng Export (zip files exported)
- Networks Export (lượt upload lên ad networks)
- Avg CTR across all active variants
- Avg CVR across all active variants
- Total AI generation cost (USD)

**Charts:**
- Daily/weekly/monthly creation trend (line)
- Status breakdown: Draft/Ready/Deployed (pie)
- Top mechanics ranking (horizontal bar)
- Images per playable distribution (bar)
- CTR by mechanic type (grouped bar)
- Export volume by network (stacked bar)
- AI generation cost over time (area)

**Filters:**
- Date range picker (preset: 7d, 30d, 90d, custom)
- Game/Project filter
- Creator filter

**Leaderboard:**
- Top creators by volume
- Top performing variants by CTR
- Top mechanics by avg CTR

## Architecture

```
PostgreSQL (aggregate queries via Prisma)
    ↓
/api/stats/route.ts (multiple endpoints)
    ↓
React Client Components (recharts)
    ↓
Statistics Dashboard (src/app/analytics/page.tsx)
```

## Related Code Files

**Modify:**
- `src/app/analytics/page.tsx` — full build-out

**Create:**
- `src/app/api/stats/route.ts` — aggregate KPIs
- `src/app/api/stats/daily/route.ts` — daily creation data
- `src/app/api/stats/mechanics/route.ts` — top mechanics
- `src/app/api/stats/networks/route.ts` — network breakdown
- `src/app/api/stats/performance/route.ts` — CTR/CVR aggregates
- `src/components/stats/kpi-card.tsx` — reusable stat card
- `src/components/stats/daily-creation-chart.tsx`
- `src/components/stats/mechanics-bar-chart.tsx`
- `src/components/stats/status-pie-chart.tsx`
- `src/components/stats/network-breakdown-chart.tsx`
- `src/components/stats/performance-chart.tsx`
- `src/components/stats/date-range-picker.tsx`
- `src/components/stats/top-variants-table.tsx`

## API Design

### GET /api/stats

```typescript
// Response
{
  total: number,
  active: number,
  totalExports: number,
  networksExports: number,
  avgCTR: number | null,
  avgCVR: number | null,
  aiCostUsd: number,
  period: { from: string, to: string }
}
```

### GET /api/stats/daily?from=&to=

```typescript
// Response
{
  data: Array<{ date: string, count: number, exports: number }>
}
```

### GET /api/stats/mechanics

```typescript
// Response
{
  data: Array<{
    mechanic: string,
    count: number,
    avgCTR: number | null,
    percentage: number
  }>
}
```

### Prisma Queries

```typescript
// Top mechanics
const mechanicsData = await prisma.variant.groupBy({
  by: ['config'],  // Need to extract mechanic from JSON
  _count: true
});
// Alternative: add `mechanic` field to Variant model (denormalized for query efficiency)

// Daily creation
const dailyStats = await prisma.$queryRaw`
  SELECT DATE(created_at) as date,
         COUNT(*) as count
  FROM "Variant"
  WHERE created_at >= ${from} AND created_at <= ${to}
  GROUP BY DATE(created_at)
  ORDER BY date ASC
`;

// Network exports
const networkBreakdown = await prisma.exportRecord.groupBy({
  by: ['network'],
  _count: { id: true },
  where: { status: 'Success', createdAt: { gte: from, lte: to } }
});
```

**Note:** Cần denormalize `mechanic` field ra Variant table để query nhanh (tránh parse JSON ở DB level).

## Prisma Schema Update

```prisma
model Variant {
  // ... existing fields
  mechanic   String?  // denormalized từ config.mechanic.type cho query efficiency
  theme      String?  // denormalized tag
}
```

## Chart Components

```typescript
// src/components/stats/mechanics-bar-chart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function MechanicsBarChart({ data }: { data: MechanicStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis dataKey="mechanic" type="category" width={80} />
        <Tooltip formatter={(v) => [`${v} ads`, 'Count']} />
        <Bar dataKey="count" fill="#F97316" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

## Todo List

- [ ] Cài `recharts` (nếu chưa có từ Phase 2)
- [ ] Create `/api/stats/` endpoint family
- [ ] Add `mechanic` denormalized field vào Variant model + migration
- [ ] Build `kpi-card.tsx` component
- [ ] Build `daily-creation-chart.tsx`
- [ ] Build `mechanics-bar-chart.tsx`
- [ ] Build `status-pie-chart.tsx`
- [ ] Build `network-breakdown-chart.tsx`
- [ ] Build `date-range-picker.tsx`
- [ ] Build `top-variants-table.tsx`
- [ ] Fully implement `src/app/analytics/page.tsx`
- [ ] Add date range filter với URL query params

## Success Criteria

- Statistics page show real data (không hardcoded)
- "Top mechanics" chart hiển thị actual breakdown
- Daily creation chart có data từ DB
- Date range filter hoạt động (thay đổi → charts cập nhật)
- All 4 KPI cards phản ánh real DB counts

## Dependencies

- Phase 1: real DB data required
- Phase 6: network export data for full breakdown (optional cho MVP)
