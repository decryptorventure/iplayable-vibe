---
phase: 04
title: Automation & Batch Processing
status: todo
priority: high
effort: 1 week
---

# Phase 04 — Automation & Batch Processing

## Overview

Tự động hóa workflow: batch generation, auto-export pipeline, scheduled tasks, và smart variant selection.

## Key Insights

- Production app shows "Auto-uploaded for iG Screwdom 3D" → system tự upload theo game
- Screenshots show batch deploy modal với 5-step pipeline — cần làm thật
- "Mixed Creative" feature trên list view — generate variants kết hợp nhiều mechanic/theme
- User có thể cần generate 50+ variants một lúc và deploy tất cả → cần queue system

## Requirements

**Batch Generation:**
- Generate N variants (10, 25, 50, 100) với 1 click
- Progress tracking real-time (SSE từ Phase 3)
- Smart batch: tự động diversify mechanics, CTA colors, difficulty levels
- Batch job queue (không block UI khi generate nhiều)

**Auto-Export Pipeline:**
- Zip HTML5 ad + assets thành single file
- Validate: file size check (max 2MB AppLovin, 150KB Google), asset count
- Auto-name theo convention: `{GameCode}_{Type}_{Theme}_{Version}`
- Export to: Google Cloud Storage → AppLovin upload → Google Ads upload

**Scheduled Automation:**
- Auto-generate variants định kỳ khi có game update
- Schedule: "Generate 20 new variants every Monday 9AM cho project X"
- Notification khi batch complete

**Smart Selection:**
- Auto-select top N variants by predicted CTR sau khi generate
- Diversity filter: đảm bảo selected set cover đủ mechanic types
- "Quick Deploy" — 1 click select top 8 + deploy

## Architecture

```
Batch Job Queue (Next.js + Prisma + pg_notify)
    ↓
Job Processor (background async function)
    ├── AI Generation (Phase 3)
    ├── HTML Export Builder
    ├── File Validator
    ├── Cloud Storage Upload
    └── Status Update → DB

Cron Scheduler (Vercel Cron Jobs hoặc pg_cron)
    ↓
Batch Generation Jobs
```

**Note:** Vì project dùng Next.js, sẽ dùng:
- **Short jobs** (< 60s): Next.js API Route với `maxDuration`
- **Long jobs** (> 60s): Background function hoặc Vercel Queue
- **Scheduled**: Vercel Cron Jobs (`vercel.json`)

## Related Code Files

**Modify:**
- `src/components/deploy/batch-deploy-modal.tsx` — real deployment steps
- `src/components/studio/preview-pane.tsx` — Quick Deploy button

**Create:**
- `src/lib/export-builder.ts` — HTML5 zip builder
- `src/lib/file-validator.ts` — size/asset validation
- `src/lib/batch-job-manager.ts` — job queue management
- `src/lib/smart-selector.ts` — auto-select top diverse variants
- `src/app/api/export/route.ts` — trigger export
- `src/app/api/export/[jobId]/route.ts` — poll job status
- `src/app/api/jobs/route.ts` — list/manage jobs
- `vercel.json` — cron job configuration

## Implementation

### 1. Export Builder

```typescript
// src/lib/export-builder.ts
import JSZip from 'jszip';

export interface ExportResult {
  blob: Blob;
  sizeKb: number;
  warnings: string[];
  errors: string[];
  filename: string;
}

export async function buildHTMLExport(
  variant: Variant,
  project: Project
): Promise<ExportResult> {
  const zip = new JSZip();
  const warnings: string[] = [];
  const errors: string[] = [];

  // Build HTML from config
  const html = renderVariantHTML(variant.config);
  zip.file('index.html', html);

  // Add assets (images từ config)
  const assets = extractAssetUrls(variant.config);
  for (const [name, url] of assets) {
    const data = await fetchAsset(url);
    zip.file(`assets/${name}`, data);
  }

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  const sizeKb = Math.round(blob.size / 1024);

  // Validate
  if (sizeKb > 2048) errors.push(`File size ${sizeKb}KB exceeds AppLovin 2MB limit`);
  if (sizeKb > 150) warnings.push(`File size ${sizeKb}KB exceeds Google 150KB guideline`);

  // Auto-naming convention
  const filename = buildFilename(project, variant);

  return { blob, sizeKb, warnings, errors, filename };
}

function buildFilename(project: Project, variant: Variant): string {
  // Convention: {date}_{GameCode}_PAIH_{Theme}
  const date = new Date().toISOString().slice(0,8).replace(/-/g,'');
  const gameCode = project.slug.toUpperCase().slice(0,4);
  const theme = variant.name.replace(/\s+/g, '');
  return `${date}_${gameCode}_PAIH_${theme}`;
}
```

### 2. Batch Job Manager

```typescript
// src/lib/batch-job-manager.ts
// Sử dụng Prisma + polling thay vì external queue (KISS)

export async function createBatchJob(params: {
  projectId: string;
  prompt: string;
  batchSize: number;
  autoExport?: boolean;
  networks?: string[];
}): Promise<string> {
  const job = await prisma.batchJob.create({
    data: {
      projectId: params.projectId,
      type: 'GENERATE',
      status: 'PENDING',
      config: params
    }
  });
  // Trigger async processing (fire and forget)
  processBatchJob(job.id).catch(console.error);
  return job.id;
}

async function processBatchJob(jobId: string) {
  await prisma.batchJob.update({
    where: { id: jobId },
    data: { status: 'RUNNING', startedAt: new Date() }
  });
  try {
    const job = await prisma.batchJob.findUnique({ where: { id: jobId } });
    const config = job.config as BatchJobConfig;

    // Step 1: Generate
    const variants = await generateVariantsWithAI(config.prompt, ..., config.batchSize);
    await prisma.batchJob.update({ where: { id: jobId }, data: { progress: 50 } });

    // Step 2: Save variants
    const saved = await saveGeneratedVariants(variants, config.projectId);
    await prisma.batchJob.update({ where: { id: jobId }, data: { progress: 70 } });

    // Step 3: Auto-export nếu configured
    if (config.autoExport) {
      for (const variant of saved) {
        await exportVariant(variant, config.networks);
      }
    }

    await prisma.batchJob.update({
      where: { id: jobId },
      data: { status: 'COMPLETED', progress: 100, completedAt: new Date() }
    });
  } catch (e) {
    await prisma.batchJob.update({
      where: { id: jobId },
      data: { status: 'FAILED', error: e.message }
    });
  }
}
```

### 3. Smart Selector

```typescript
// src/lib/smart-selector.ts
export function selectDiverseTopVariants(
  variants: VariantListItem[],
  count: number = 8
): string[] {
  // Sort by predicted CTR
  const sorted = [...variants].sort((a, b) => b.predictedCTR - a.predictedCTR);

  const selected: VariantListItem[] = [];
  const mechanicsSeen = new Set<string>();
  const colorsSeen = new Set<string>();

  // First pass: ensure diversity
  for (const v of sorted) {
    if (selected.length >= count) break;
    const mechanic = v.config.mechanic.type;
    const colorGroup = getNeonGroup(v.config.cta.color); // neon vs muted
    if (!mechanicsSeen.has(mechanic) || !colorsSeen.has(colorGroup)) {
      selected.push(v);
      mechanicsSeen.add(mechanic);
      colorsSeen.add(colorGroup);
    }
  }

  // Fill remaining with top CTR
  for (const v of sorted) {
    if (selected.length >= count) break;
    if (!selected.find(s => s.id === v.id)) selected.push(v);
  }

  return selected.map(v => v.id);
}
```

### 4. Vercel Cron (Schedule)

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/jobs/cron",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

### 5. Real Batch Deploy Modal

```
Steps trong batch-deploy-modal.tsx (real implementation):
1. Packaging: buildHTMLExport() → zip
2. Validating: fileValidator() → size/asset checks
3. Uploading to Cloud: POST to /api/export → GCS upload
4. Registering in Network: POST to AppLovin/Google API
5. Complete: update ExportRecord in DB, show stats
```

## Prisma Schema Addition

```prisma
model BatchJob {
  id          String   @id @default(cuid())
  projectId   String
  type        String   // GENERATE | EXPORT | DEPLOY
  status      String   // PENDING | RUNNING | COMPLETED | FAILED
  progress    Int      @default(0)
  config      Json
  error       String?
  startedAt   DateTime?
  completedAt DateTime?
  createdAt   DateTime @default(now())
}
```

## Todo List

- [ ] Cài `jszip` cho export builder
- [ ] Implement `src/lib/export-builder.ts`
- [ ] Implement `src/lib/file-validator.ts`
- [ ] Implement `src/lib/smart-selector.ts`
- [ ] Implement `src/lib/batch-job-manager.ts`
- [ ] Add `BatchJob` model vào Prisma schema
- [ ] Create `/api/export/route.ts`
- [ ] Create `/api/export/[jobId]/route.ts` (polling)
- [ ] Create `/api/jobs/cron/route.ts` (Vercel Cron)
- [ ] Update `batch-deploy-modal.tsx` → real steps
- [ ] Cập nhật `use-studio-store.ts` → `smartAutoSelect` sau generate
- [ ] `vercel.json` với cron config

## Success Criteria

- Export tạo ra `.zip` hợp lệ với `index.html` + assets
- File size badge hiển thị đúng KB + warnings
- Batch deploy modal chạy qua 5 steps thật (không fake delay)
- Smart selection auto-chọn top 8 diverse variants sau generate
- Job status có thể poll qua API
