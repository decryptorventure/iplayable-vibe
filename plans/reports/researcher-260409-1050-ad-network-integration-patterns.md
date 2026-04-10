# Ad Network Integration Patterns for iPlayable
**Research Report | 2026-04-09 | Focus: AppLovin MAX, Google Ads UAC, Performance Data Pipelines**

---

## Executive Summary

iPlayable requires three integration layers: (1) **Creative Upload** — batch HTML5 delivery to ad networks, (2) **Performance Telemetry** — real-time CTR/CVR/ROAS ingestion, (3) **Feedback Loop** — AI training on creative performance signals. Current AppLovin-only export can scale to multi-network by adopting standardized ETL patterns and API-driven asset management.

---

## 1. Creative Management & Batch Upload

### AppLovin MAX
- **Reporting API** surfaces aggregated stats: impressions, clicks, installs, CTR, CVR, CPM, ROAS (45-day history limit)
- **Self-Serve Ads Manager** (launched June 2025) supports direct creative upload with granular metrics by ad unit (video, endcard, DPA)
- **Direct-to-platform pipeline**: DCO-generated assets sync automatically, eliminating manual workflows

### Google Ads UAC
- **Asset-level reporting**: Creative Asset Report grades each asset as "Low," "Good," or "Best" relative to peers
- **Multi-asset support**: UAC contains multiple assets (image, video, text), enabling granular performance tracking via Google Ads API
- **2025 enhancement**: Full placement reporting expanded to Performance Max, Search, Shopping, App campaigns

### HTML5/Playable Batch Upload Pattern
1. **Zip structure**: index.html at root, relative paths, <5MB total, <2MB index.html
2. **Meta API**: `/advideos` (lead-in video) → `/adcreatives` (composite with playable asset)
3. **Batch processing**: 50 req/batch, upload images first → collect hashes → create creatives in second batch
4. **LinkedIn**: X-RestLi-Method: BATCH_CREATE header required; all creatives must belong to same Ad Account

**Recommendation**: Implement abstraction layer mapping iPlayable creative export → network-agnostic ZIP format, then route to network-specific API handlers (AppLovin, Meta, LinkedIn, Google).

---

## 2. Performance Data Pipeline

### Architecture Pattern (Real-Time ETL)
- **Event broker**: Kafka/Redpanda for asynchronous ingestion from ad network APIs
- **Stream layer**: Apache Flink or Spark Structured Streaming for low-latency transformation
- **Storage**: Time-series DB (InfluxDB/TimescaleDB) for metrics; data warehouse for analytics
- **Latency SLA**: 1–5 min for delivery/spend signals; hours–days for conversions (attribution settling)

### Metrics to Ingest
**Delivery signals** (minute-level): impressions, clicks, spend, CTR, CPM, IPM  
**Conversion signals** (hourly): installs, conversions, CVR, CPA, ROAS  
**Creative signals** (hourly): performance rating (Low/Good/Best), asset-level CTR variance

### Integration Points
| Network | Data Access | Update Frequency | Key Challenge |
|---------|-------------|------------------|---|
| **AppLovin MAX** | Reporting API | Poll every 5 min | 45-day history limit; aggregate only |
| **Google UAC** | Google Ads API | Pull daily; real-time via GA4 | Asset-level data delayed 24h; requires UA4 setup |
| **Meta** | Conversions API, Insights API | Real-time webhooks available | Event deduplication; privacy aggregation rules |

---

## 3. NMS (Network Management System) Definition

In Vietnamese and broader AdTech contexts, **NMS typically refers to**:
- Unified dashboard managing creatives across multiple ad networks
- Bidirectional sync: push creatives → pull performance → update allocation rules
- iKame context: iPlayable as creative hub → auto-distribute to AppLovin, Google, Meta, TikTok, etc.

Not a standardized acronym; often called "multi-network mediation platform" (AppLovin MAX is an example). Custom NMS for iPlayable would:
1. Abstract creative format (iPlayable export → standardized intermediate)
2. Route to network-specific adapters (AppLovin, Google, Meta)
3. Aggregate performance metrics into unified analytics dashboard

---

## 4. Creative Performance Feedback Loop for AI Training

### Current Industry Pattern (2025)
- **Feedback cycle compression**: AI tools collapse weeks of A/B testing into daily auto-generation + swap cycles
- **Learning signal**: Each asset scored by performance rating (Low/Good/Best) and CTR variance
- **Reinforcement mechanism**: Monthly retraining on top-performing creatives; poor performers deprioritized

### iPlayable Implementation Path
1. **Collect signals**: AppLovin/Google CTR, CVR, engagement duration (if available from playable metrics)
2. **Feature engineering**: Extract design elements (color palette, copy style, CTA placement) from HTML5 metadata
3. **Model training**: Binary classifier (High/Low performance) or regression (CTR prediction) on historical creatives
4. **Closed loop**: AI suggests design tweaks → export new playable → deploy → measure → retrain (monthly)

### Benchmark Performance Impact
- Companies using AI creative optimization report **$4.52 ROAS per $1 spent** (AdAmigo 2025)
- 83% of ad executives deployed AI in creative processes (IAB 2025, up from 60% in 2024)

---

## 5. Reporting & Analytics Standards

### Playable Ad KPIs
| Metric | Definition | Target (Casual Games) |
|--------|-----------|---|
| CTR | Clicks / Impressions | 3–6% |
| CVR | Installs / Clicks | 20–35% |
| ROAS | Revenue / Ad Spend | 3:1 – 5:1 (tier-1 studios) |
| Engagement Duration | Time spent in playable (sec) | 30–60s ideal |

### Dashboard Components
1. **Real-time pacing**: Spend vs. plan, CPM trend, impression velocity
2. **Creative performance**: Asset-level CTR, ROAS by creative variant, performance rating distribution
3. **Network comparison**: CTR/CVR/ROAS benchmarks across AppLovin, Google, Meta
4. **Attribution**: Install-to-LTV pipeline (requires GA4 + MMP integration)

---

## Technical Recommendations (Ranked)

### Tier 1: Foundation (MVP, 3–4 weeks)
1. **AppLovin MAX Reporting API polling**: 5-min cadence for CTR/CVR/ROAS; store in PostgreSQL time-series
2. **Creative export standardization**: HTML5 → validated ZIP format with metadata JSON (creative ID, design tags)
3. **Simple dashboard**: Grafana + PostgreSQL for trend visualization

### Tier 2: Scale (Week 5–8)
1. **Kafka-based ETL**: async ingestion from AppLovin + Google APIs; reduce polling latency to 2–3 min
2. **Data warehouse (optional)**: Postgres data lake → dbt transforms → BI layer (Metabase or Looker)
3. **Google Ads UAC API integration**: asset-level performance; requires OAuth + service account

### Tier 3: AI Feedback (Week 9+)
1. **Feature extraction pipeline**: Parse playable HTML → design metadata (colors, layout, copy)
2. **ML model**: CTR/CVR prediction from design features; monthly retraining
3. **Recommendation engine**: "Try warmer colors" or "Longer CTA copy" suggestions

---

## Known Constraints & Gaps

- **AppLovin 45-day history**: No long-term trend analysis without exporting and storing snapshots
- **Asset-level attribution**: Google UAC asset performance delayed 24h; real-time feedback loop limited
- **Playable metric standardization**: No industry standard for engagement duration; custom tracking required
- **Privacy compliance**: GDPR/CCPA impact on cross-network data flows; requires consent management
- **Vietnam-specific**: Recommend validating ad network coverage in Vietnam market (AppLovin strong; Google/Meta universal)

---

## Integration Roadmap Summary

**Phase 1 (Weeks 1–4):** AppLovin → PostgreSQL → Grafana  
**Phase 2 (Weeks 5–8):** Multi-network (Google, Meta) + Kafka ETL  
**Phase 3 (Weeks 9–12):** AI feedback loop + design feature extraction  

Estimated team: 1 backend engineer + 1 data engineer (phases 1–2); +1 ML engineer for phase 3.

---

**Unresolved Questions:**
1. Does iPlayable currently track playable engagement metrics (time-in-creative, completion %)? AppLovin may expose via custom events if configured.
2. What's the preferred BI tool (Metabase, Looker, Tableau)? Impacts dashboard design.
3. Is there an existing MMP (AppsFlyer, Adjust) integration for install attribution?
