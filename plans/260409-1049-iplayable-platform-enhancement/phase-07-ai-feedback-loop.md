---
phase: 07
title: AI Feedback Loop & Model Training
status: todo
priority: low
effort: 2 weeks
---

# Phase 07 — AI Feedback Loop & Model Training

## Overview

Sử dụng performance data thật (CTR/CVR từ Phase 6) để cải thiện AI generation, build ESMM prediction model, và implement Thompson Bandit A/B testing tự động.

## Key Insights từ Research

- **ESMM (Entire Space Multi-task Model)**: Jointly predict CTR + CVR, xử lý sample selection bias — tốt nhất cho mobile ad context.
- **Thompson Bandit**: Adaptive A/B testing, tự động shift traffic về winner. Không cần restart test.
- **Weekly training cycle**: Collect → Analyze → Update generation params → Retrain predictor.
- **Phase 3 baseline predictor** (logistic regression) → Phase 7: ESMM với real data.
- **RLAIF**: Reinforcement Learning from AI Feedback — use Claude to rate generated configs → fine-tune generation.
- Minimum data threshold: **500+ variants với real CTR data** trước khi training meaningful model.

## Architecture

```
Ad Network Data (Phase 6 daily sync)
    ↓
Feature Extractor (config → ML features)
    ↓
Training Data Store (PostgreSQL)
    ↓
Model Training (weekly cron)
    ├── ESMM CTR/CVR Predictor → model weights
    ├── Prompt Optimizer → update few-shot examples
    └── Generation Params → update FEATURE_WEIGHTS
    ↓
Updated Prediction Model
    ↓
Better AI Generation (Phase 3 uses new weights)

Thompson Bandit (parallel, per-project)
    ├── Track variant impressions/clicks
    ├── Update Beta distribution per variant
    └── Auto-select winner when confident
```

## Requirements

**Data Pipeline:**
- Extract ML features từ `VariantConfig` JSON
- Label với actual CTR/CVR từ `PerformanceMetric`
- Weekly aggregate: sufficient impressions threshold (min 1000 impressions/variant)
- Store training dataset trong `MLTrainingRecord` table

**Model Training (Lightweight, self-hosted):**
- Simple gradient boosting (không cần PyTorch/TensorFlow cho MVP)
- Feature engineering từ config fields
- Train/validation split (80/20)
- Model versioning: lưu weights vào DB, track accuracy
- Weekly cron trigger

**Thompson Bandit A/B Testing:**
- Mỗi project có active variants được tracked
- Beta distribution update per variant khi nhận click/impression data
- Auto-declare winner khi confidence ≥ 95%
- UI: show "Testing" badge trên variants, show winner badge

**Prompt Optimization:**
- Sau mỗi training cycle: extract top-10 performing variant configs
- Convert thành few-shot examples cho AI generation prompt
- Store trong `PromptExample` table, inject vào next generation

**AI Self-Rating (RLAIF):**
- Generate config → Claude rates it (1-5) trước khi serving
- Filter configs dưới threshold rating
- Lưu ratings → training data

## Related Code Files

**Modify:**
- `src/lib/performance-predictor.ts` — load trained weights từ DB
- `src/lib/ai-prompt-templates.ts` — dynamic few-shot từ DB
- `src/app/api/networks/cron/route.ts` — trigger training pipeline

**Create:**
- `src/lib/ml/feature-extractor.ts` — config → feature vector
- `src/lib/ml/model-trainer.ts` — training pipeline
- `src/lib/ml/thompson-bandit.ts` — A/B testing engine
- `src/lib/ml/prompt-optimizer.ts` — dynamic prompt improvement
- `src/lib/ml/rlaif-rater.ts` — Claude self-rating
- `src/app/api/ml/train/route.ts` — trigger training manually
- `src/app/api/ml/bandit/route.ts` — update bandit state
- `src/components/studio/ab-test-badge.tsx` — testing/winner UI

## Implementation

### 1. Feature Extractor

```typescript
// src/lib/ml/feature-extractor.ts
export interface MLFeatureVector {
  // Mechanic features
  mechanic_puzzle: 0 | 1;
  mechanic_match3: 0 | 1;
  mechanic_runner: 0 | 1;
  mechanic_idle: 0 | 1;
  difficulty_normalized: number; // 0-1

  // CTA features
  cta_bottom: 0 | 1;
  cta_neon_color: 0 | 1; // hue saturation > 80%
  cta_text_length: number; // normalized

  // Sound
  sound_enabled: 0 | 1;
  sound_volume_normalized: number;

  // Tutorial
  tutorial_auto: 0 | 1;
  tutorial_steps_normalized: number;

  // Platform
  platform_both: 0 | 1;
  platform_ios_only: 0 | 1;

  // Computed
  complexity_score: number; // composite: difficulty + tutorial steps + level count
}

export function extractFeatures(config: VariantConfig): MLFeatureVector {
  const neonColors = ['#F97316', '#EF4444', '#A855F7', '#06B6D4', '#FACC15'];
  const isNeon = neonColors.includes(config.cta.color.toUpperCase());

  return {
    mechanic_puzzle: config.mechanic.type === 'Puzzle' ? 1 : 0,
    mechanic_match3: config.mechanic.type === 'Match3' ? 1 : 0,
    mechanic_runner: config.mechanic.type === 'Runner' ? 1 : 0,
    mechanic_idle: config.mechanic.type === 'Idle' ? 1 : 0,
    difficulty_normalized: config.mechanic.difficulty / 100,
    cta_bottom: config.cta.position === 'bottom' ? 1 : 0,
    cta_neon_color: isNeon ? 1 : 0,
    cta_text_length: Math.min(config.cta.text.length / 20, 1),
    sound_enabled: config.sound.enabled ? 1 : 0,
    sound_volume_normalized: config.sound.volume / 100,
    tutorial_auto: config.tutorial.autoStart ? 1 : 0,
    tutorial_steps_normalized: config.tutorial.steps / 10,
    platform_both: config.directToStore.platform === 'Both' ? 1 : 0,
    platform_ios_only: config.directToStore.platform === 'iOS' ? 1 : 0,
    complexity_score: (
      config.mechanic.difficulty / 100 +
      config.tutorial.steps / 10 +
      Math.min(config.level.count / 100, 1)
    ) / 3
  };
}
```

### 2. Thompson Bandit

```typescript
// src/lib/ml/thompson-bandit.ts
// Beta distribution A/B testing

interface BanditArm {
  variantId: string;
  alpha: number; // successes + 1
  beta: number;  // failures + 1
}

export function updateBanditArm(
  arm: BanditArm,
  clicks: number,
  impressions: number
): BanditArm {
  return {
    ...arm,
    alpha: arm.alpha + clicks,
    beta: arm.beta + (impressions - clicks)
  };
}

export function sampleBeta(alpha: number, beta: number): number {
  // Approximate Beta distribution sample using JS
  // For production: use proper math library
  const x = gammaSample(alpha);
  const y = gammaSample(beta);
  return x / (x + y);
}

export function selectBanditWinner(
  arms: BanditArm[],
  confidenceThreshold = 0.95
): { winnerId: string | null; confidence: number } {
  if (arms.length < 2) return { winnerId: null, confidence: 0 };

  // Sample each arm 1000 times
  const sampleCounts = arms.map(arm => ({ id: arm.variantId, wins: 0 }));
  for (let i = 0; i < 1000; i++) {
    const samples = arms.map(arm => sampleBeta(arm.alpha, arm.beta));
    const maxIdx = samples.indexOf(Math.max(...samples));
    sampleCounts[maxIdx].wins++;
  }

  const best = sampleCounts.sort((a, b) => b.wins - a.wins)[0];
  const confidence = best.wins / 1000;

  return {
    winnerId: confidence >= confidenceThreshold ? best.id : null,
    confidence
  };
}
```

### 3. Model Trainer (Lightweight Gradient Boosting)

```typescript
// src/lib/ml/model-trainer.ts
// Sử dụng simple gradient boosting bằng pure TypeScript
// Không cần Python/PyTorch cho MVP — đủ cho <10K samples

export interface TrainedModel {
  version: number;
  trainedAt: Date;
  accuracy: number; // MAE vs actual CTR
  featureWeights: Record<string, number>;
}

export async function trainCTRModel(): Promise<TrainedModel> {
  // 1. Load training data
  const records = await prisma.mLTrainingRecord.findMany({
    where: {
      actualCTR: { not: null },
      impressions: { gte: 1000 } // only statistically significant
    }
  });

  if (records.length < 50) {
    throw new Error(`Insufficient training data: ${records.length} records (need 50+)`);
  }

  // 2. Extract features + labels
  const X = records.map(r => extractFeatures(r.config as VariantConfig));
  const y = records.map(r => r.actualCTR!);

  // 3. Simple linear regression for MVP
  const weights = fitLinearRegression(X, y);
  const predictions = X.map(x => predictLinear(x, weights));
  const mae = calculateMAE(y, predictions);

  // 4. Save model
  const model = await prisma.mLModel.create({
    data: {
      version: await getNextModelVersion(),
      weights: weights as any,
      accuracy: mae,
      sampleCount: records.length,
      trainedAt: new Date()
    }
  });

  return {
    version: model.version,
    trainedAt: model.trainedAt,
    accuracy: mae,
    featureWeights: weights
  };
}
```

### 4. Prompt Optimizer

```typescript
// src/lib/ml/prompt-optimizer.ts
export async function updateFewShotExamples() {
  // Pull top 10 variants by actual CTR với sufficient data
  const topVariants = await prisma.variant.findMany({
    where: { ctr: { not: null }, impressions: { gte: 5000 } },
    orderBy: { ctr: 'desc' },
    take: 10,
    include: { project: true }
  });

  // Convert to few-shot format
  const examples = topVariants.map(v => ({
    game: v.project.name,
    mechanic: v.mechanic,
    config: v.config,
    actualCTR: v.ctr,
    note: `High-performing variant for ${v.project.name}`
  }));

  // Store in DB
  await prisma.promptExample.upsert({
    where: { type: 'high_ctr_variants' },
    update: { examples: examples as any, updatedAt: new Date() },
    create: { type: 'high_ctr_variants', examples: examples as any }
  });
}
```

## Prisma Schema Additions

```prisma
model MLTrainingRecord {
  id          String   @id @default(cuid())
  variantId   String   @unique
  config      Json     // VariantConfig snapshot
  features    Json     // MLFeatureVector
  actualCTR   Float?
  actualCVR   Float?
  impressions Int      @default(0)
  network     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model MLModel {
  id          String   @id @default(cuid())
  version     Int      @unique
  weights     Json
  accuracy    Float    // MAE
  sampleCount Int
  isActive    Boolean  @default(false)
  trainedAt   DateTime
}

model BanditState {
  id        String   @id @default(cuid())
  projectId String
  variantId String
  alpha     Float    @default(1)
  beta      Float    @default(1)
  winnerId  String?
  confidence Float?
  updatedAt DateTime @updatedAt

  @@unique([projectId, variantId])
}

model PromptExample {
  id        String   @id @default(cuid())
  type      String   @unique
  examples  Json
  updatedAt DateTime @updatedAt
}
```

## Training Cron Schedule

```json
// vercel.json
{
  "crons": [
    { "path": "/api/networks/cron", "schedule": "0 6 * * *" },
    { "path": "/api/ml/train", "schedule": "0 2 * * 1" }
  ]
}
```

## Maturity Roadmap

| Stage | Trigger | Action |
|-------|---------|--------|
| **L0** | Now | Phase 3 logistic regression (hardcoded weights) |
| **L1** | 50+ variants with CTR data | Linear regression trained on real data |
| **L2** | 500+ variants | Gradient boosting, prompt optimization |
| **L3** | 5000+ variants | ESMM multi-task, RLAIF rating |
| **L4** | 50k+ variants | Full fine-tuning of generation model |

## Todo List

- [ ] Prisma: thêm `MLTrainingRecord`, `MLModel`, `BanditState`, `PromptExample`
- [ ] Implement `feature-extractor.ts`
- [ ] Implement `model-trainer.ts` (linear regression baseline)
- [ ] Implement `thompson-bandit.ts`
- [ ] Implement `prompt-optimizer.ts`
- [ ] Implement `rlaif-rater.ts` (Claude self-rating)
- [ ] Create `/api/ml/train/route.ts`
- [ ] Create `/api/ml/bandit/route.ts`
- [ ] Weekly cron trong `vercel.json`
- [ ] UI: A/B test badge trên variants
- [ ] Cập nhật `performance-predictor.ts` → load model từ DB
- [ ] Cập nhật `ai-prompt-templates.ts` → dynamic few-shot từ DB
- [ ] Dashboard: model accuracy card trong Statistics page

## Success Criteria

- Training cron chạy weekly, không crash
- Model accuracy (MAE) giảm theo thời gian khi có thêm data
- Thompson Bandit auto-declare winner sau 7-30 ngày test
- Few-shot examples trong prompt tự động update với top performers
- Prediction confidence hiển thị trong UI (Phase 3's `confidence: 0.65` → dynamic)

## Unresolved Questions

- Minimum data threshold: 500+ variants đủ chưa hay cần nhiều hơn? (phụ thuộc vào variance trong CTR)
- ESMM implementation: tự build hay dùng cloud ML (Vertex AI, SageMaker)?
- Privacy: performance data có PII không cần anonymize trước training?
