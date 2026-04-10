---
phase: 06
title: NMS / Ad Network Integration
status: todo
priority: medium
effort: 3 weeks
---

# Phase 06 — NMS / Ad Network Integration

## Overview

Tích hợp iPlayable với các ad network (AppLovin, Google Ads) để upload creatives tự động và pull performance data về. iPlayable trở thành NMS (Network Management System) trung tâm.

## Key Insights từ Research

- **NMS trong context này**: iPlayable = unified hub quản lý creative + performance từ nhiều ad networks.
- **AppLovin MAX**: API mạnh cho mobile games, Vietnam market dominant.
- **Google UAC (Universal App Campaigns)**: HTML5 upload via Google Ads API.
- **Pipeline**: Creative Upload → Performance Ingestion → Analytics → AI Training (Phase 7).
- Screenshots show "Networks Export: 4794" → tracking lượt upload per network là crucial.
- "Auto-uploaded for iG Screwdom 3D" → cần auto-upload trigger khi project ready.

## Architecture

```
iPlayable Studio
    │
    ├── Creative Upload Pipeline
    │   ├── Export Builder (Phase 4) → ZIP
    │   ├── AppLovin Creatives API → upload
    │   └── Google Ads Assets API → upload HTML5
    │
    ├── Performance Data Ingestion
    │   ├── AppLovin Reporting API → pull CTR/CVR/ROAS
    │   ├── Google Ads Reporting API → pull metrics
    │   └── Data Normalizer → PerformanceMetric table
    │
    └── Cron Scheduler (daily sync)
        ├── Pull yesterday's metrics
        ├── Update variant performance scores
        └── Trigger AI feedback (Phase 7)
```

## Requirements

**Creative Upload:**
- Upload ZIP export lên AppLovin MAX Creatives API
- Upload HTML5 asset lên Google Ads (Display & Video 360)
- Track upload status per variant per network
- Retry on failure (3 attempts, exponential backoff)
- Return network creative ID → store trong ExportRecord

**Performance Data Pull:**
- Pull daily CTR/CVR/impressions/clicks/installs từ AppLovin Reporting API
- Pull equivalent metrics từ Google Ads Reporting API
- Normalize sang PerformanceMetric schema thống nhất
- Cron job: daily 6AM pull previous day data
- Handle API rate limits

**Network Management UI:**
- Cấu hình API keys per network (Settings page)
- Network connection status (connected/error)
- Export history với status per network
- Manual "Sync Now" button

## Related Code Files

**Modify:**
- `src/app/settings/page.tsx` — add Network Configuration section
- `src/components/deploy/batch-deploy-modal.tsx` — real upload steps

**Create:**
- `src/lib/networks/applovin-client.ts` — AppLovin API wrapper
- `src/lib/networks/google-ads-client.ts` — Google Ads API wrapper
- `src/lib/networks/network-types.ts` — shared types
- `src/lib/performance-ingester.ts` — pull & normalize metrics
- `src/app/api/networks/route.ts` — list configured networks
- `src/app/api/networks/[network]/upload/route.ts` — upload creative
- `src/app/api/networks/[network]/sync/route.ts` — pull performance data
- `src/app/api/networks/cron/route.ts` — daily sync cron
- `src/components/settings/network-config-panel.tsx` — API key config UI

## Implementation

### 1. AppLovin Client

```typescript
// src/lib/networks/applovin-client.ts
const APPLOVIN_BASE = 'https://o.applovin.com/creative_service/v2';

export class AppLovinClient {
  constructor(private apiKey: string, private sdkKey: string) {}

  async uploadCreative(params: {
    name: string;
    zipBlob: Blob;
    adType: 'playable';
    bundleId: string;
  }): Promise<{ creativeId: string; status: string }> {
    const form = new FormData();
    form.append('creative_name', params.name);
    form.append('ad_type', 'playable');
    form.append('bundle_id', params.bundleId);
    form.append('creative_file', params.zipBlob, `${params.name}.zip`);

    const res = await fetch(`${APPLOVIN_BASE}/creatives`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: form
    });

    if (!res.ok) throw new Error(`AppLovin upload failed: ${res.statusText}`);
    const data = await res.json();
    return { creativeId: data.creative_id, status: data.status };
  }

  async getPerformanceReport(params: {
    startDate: string; // YYYY-MM-DD
    endDate: string;
    columns: string[];
  }): Promise<AppLovinReportRow[]> {
    const url = new URL('https://r.applovin.com/report');
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('start', params.startDate);
    url.searchParams.set('end', params.endDate);
    url.searchParams.set('columns', params.columns.join(','));
    url.searchParams.set('format', 'json');

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`AppLovin report failed: ${res.statusText}`);
    const data = await res.json();
    return data.results ?? [];
  }
}
```

### 2. Performance Ingester

```typescript
// src/lib/performance-ingester.ts
export async function ingestAppLovinMetrics(date: string) {
  const client = new AppLovinClient(
    process.env.APPLOVIN_API_KEY!,
    process.env.APPLOVIN_SDK_KEY!
  );

  const rows = await client.getPerformanceReport({
    startDate: date,
    endDate: date,
    columns: ['creative', 'impressions', 'clicks', 'installs', 'ctr', 'cvr', 'revenue']
  });

  for (const row of rows) {
    // Match creative_id → our ExportRecord → variantId
    const exportRecord = await prisma.exportRecord.findFirst({
      where: { networkCreativeId: row.creative_id, network: 'AppLovin' }
    });
    if (!exportRecord?.variantId) continue;

    await prisma.performanceMetric.upsert({
      where: {
        variantId_network_date: {
          variantId: exportRecord.variantId,
          network: 'AppLovin',
          date: new Date(date)
        }
      },
      update: {
        impressions: row.impressions,
        clicks: row.clicks,
        installs: row.installs,
        ctr: row.ctr,
        cvr: row.cvr,
        spend: row.revenue
      },
      create: {
        variantId: exportRecord.variantId,
        network: 'AppLovin',
        date: new Date(date),
        impressions: row.impressions,
        clicks: row.clicks,
        installs: row.installs,
        ctr: row.ctr,
        cvr: row.cvr,
        spend: row.revenue
      }
    });
  }

  // Update variant's actual CTR/CVR
  await updateVariantActualMetrics(rows);
}
```

### 3. Daily Cron

```typescript
// src/app/api/networks/cron/route.ts
// Triggered by Vercel Cron: "0 6 * * *"
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];

  await Promise.all([
    ingestAppLovinMetrics(dateStr),
    ingestGoogleAdsMetrics(dateStr)
  ]);

  return Response.json({ ok: true, date: dateStr });
}
```

### 4. Network Config UI (Settings)

```
Settings → Integrations Tab:
┌─────────────────────────────────────────────┐
│ Ad Networks                                  │
├─────────────────────────────────────────────┤
│ 🟢 AppLovin MAX                    [Config] │
│    API Key: ***...abc              [Test]   │
│    SDK Key: ***...xyz              [Sync]   │
├─────────────────────────────────────────────┤
│ 🔴 Google Ads                      [Config] │
│    OAuth: Not connected        [Connect]    │
├─────────────────────────────────────────────┤
│ ⚪ Meta (Facebook)                 [Config] │
│    Token: Not set              [Connect]    │
└─────────────────────────────────────────────┘
```

### 5. Retry Logic

```typescript
// src/lib/networks/retry-upload.ts
export async function uploadWithRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (attempt === maxAttempts) throw e;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

## Prisma Schema Updates

```prisma
model ExportRecord {
  // ... existing
  networkCreativeId  String?  // returned by ad network after upload
  bundleId          String?  // app bundle ID for ad network
  uploadedAt        DateTime?
}

model NetworkConfig {
  id        String   @id @default(cuid())
  network   String   @unique // AppLovin | Google | Meta
  apiKey    String?  // encrypted at rest
  sdkKey    String?
  oauthToken String? // for Google
  status    String   @default("inactive") // active | inactive | error
  lastSync  DateTime?
  updatedAt DateTime @updatedAt
}
```

## Environment Variables

```env
APPLOVIN_API_KEY=...
APPLOVIN_SDK_KEY=...
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
GOOGLE_ADS_DEVELOPER_TOKEN=...
CRON_SECRET=...  # Vercel Cron auth
```

## Todo List

- [ ] `NetworkConfig` model trong Prisma
- [ ] Update `ExportRecord` với `networkCreativeId`
- [ ] Implement `src/lib/networks/applovin-client.ts`
- [ ] Implement `src/lib/networks/google-ads-client.ts` (basic)
- [ ] Implement `src/lib/performance-ingester.ts`
- [ ] Create `/api/networks/[network]/upload/route.ts`
- [ ] Create `/api/networks/[network]/sync/route.ts`
- [ ] Create `/api/networks/cron/route.ts` + `vercel.json` cron entry
- [ ] Implement retry logic `retry-upload.ts`
- [ ] Build `network-config-panel.tsx` trong Settings page
- [ ] Encrypt API keys at rest (dùng `crypto.createCipher` hoặc env-based)
- [ ] Manual "Sync Now" button trong Settings
- [ ] Test với AppLovin sandbox/test environment

## Success Criteria

- Upload 1 variant lên AppLovin → nhận `networkCreativeId` về
- Daily cron pull metrics → `PerformanceMetric` table có data
- Variant actual CTR/CVR cập nhật sau sync
- Settings page cho phép configure AppLovin API key
- ExportRecord tracking đầy đủ per network

## Security Considerations

- API keys không được log ra console
- API keys encrypt trước khi lưu vào DB
- CRON_SECRET bảo vệ cron endpoint khỏi unauthorized trigger
- Google OAuth flow cần HTTPS (production only)

## Unresolved Questions

- iKame có AppLovin sandbox/test account để dev/test không?
- Google Ads API cần white-list developer token — có sẵn chưa?
- "NMS" trong context iKame có nghĩa gì cụ thể — có hệ thống NMS riêng không?
