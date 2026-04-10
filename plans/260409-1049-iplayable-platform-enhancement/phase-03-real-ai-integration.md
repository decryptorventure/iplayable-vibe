---
phase: 03
title: Real AI Integration
status: todo
priority: high
effort: 2 weeks
---

# Phase 03 — Real AI Integration

## Overview

Thay thế toàn bộ mock AI bằng OpenAI Batch API + Claude Vision. Implement performance prediction thật, smart variant generation, và AI creative analysis.

## Key Insights từ Research

- **OpenAI Batch API**: 50% cost vs real-time. Latency 15-30min chấp nhận được cho batch generation.
- **Structured Outputs**: Guarantee JSON schema compliance, loại bỏ hallucination risk.
- **Claude Vision**: Superior cho semantic analysis game screenshots vs Google Vision.
- **MinHash + LSH**: Generate 150 candidates → filter 50 diverse variants.
- **ESMM**: Multi-task deep learning predict CTR+CVR jointly — Phase 7 implementation.
- Current mock `predictPerformance()` dùng hardcoded formula (difficulty > 70 → +0.4 CTR) — không thực tế.

## Architecture

```
User Prompt (natural language)
    ↓
AI Orchestrator (src/lib/ai-orchestrator.ts)
    ├── Context Builder: extract game info từ project
    ├── Prompt Engineer: system prompt + few-shot examples
    ├── OpenAI Batch API: generate N configs (Structured Outputs)
    ├── MinHash Deduplicator: filter diverse configs
    ├── Performance Predictor: score each config
    └── Ranker: sort by predicted CTR/CVR

Claude Vision API (separate flow)
    ├── Analyze uploaded game screenshots
    ├── Suggest CTA color/position
    ├── Detect dominant mechanic type
    └── Recommend image replacements
```

## Requirements

**AI Generation:**
- Real OpenAI API call với Structured Outputs (JSON schema = `VariantConfig`)
- Streaming generation progress (SSE hoặc polling)
- Batch mode: generate 50-150 candidates, return top 50 diverse variants
- Context-aware: dùng project info (game type, mechanic) để customize generation
- Rate limiting + retry logic
- Cost tracking: log tokens used + USD cost per generation

**Performance Prediction:**
- Replace hardcoded formula bằng ML-based scoring
- Features: mechanic type, difficulty, CTA color (neon vs muted), sound, tutorial steps, image quality score
- Initially: logistic regression trained trên seed data
- Later (Phase 7): ESMM với real ad network data

**Claude Vision Analysis:**
- Analyze game screenshot → extract: dominant colors, mechanic type, difficulty level estimation
- Suggest optimal CTA color (contrast analysis)
- Detect if ad too cluttered → simplification suggestion
- API: Claude claude-sonnet-4-6 Vision

**Prompt Engineering:**
- System prompt: context về game genre, target audience (casual vs hardcore)
- Few-shot examples: high-CTR variant configs cho từng mechanic type
- Dynamic context injection từ project data

## Related Code Files

**Modify:**
- `src/lib/openai.ts` → full rewrite thành real AI orchestrator
- `src/app/api/ai/generate/route.ts` → streaming SSE endpoint
- `src/store/use-studio-store.ts` → handle streaming, progress updates

**Create:**
- `src/lib/ai-orchestrator.ts` — main AI coordination logic
- `src/lib/ai-prompt-templates.ts` — system prompts + few-shot examples
- `src/lib/variant-deduplicator.ts` — MinHash similarity filter
- `src/lib/performance-predictor.ts` — ML-based CTR/CVR scoring
- `src/lib/vision-analyzer.ts` — Claude Vision game screenshot analysis
- `src/app/api/ai/analyze/route.ts` — Vision analysis endpoint
- `src/app/api/ai/stream/route.ts` — SSE streaming generation endpoint

## Implementation

### 1. OpenAI Structured Outputs Generation

```typescript
// src/lib/ai-orchestrator.ts
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const VariantConfigSchema = z.object({
  cta: z.object({
    text: z.string(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    position: z.enum(['top', 'bottom'])
  }),
  sound: z.object({ enabled: z.boolean(), volume: z.number().min(0).max(100) }),
  tutorial: z.object({ autoStart: z.boolean(), steps: z.number().min(1).max(10) }),
  mechanic: z.object({
    type: z.enum(['Puzzle', 'Match3', 'Runner', 'Idle', 'Strategy']),
    difficulty: z.number().min(0).max(100)
  }),
  level: z.object({ count: z.number(), progressiveDifficulty: z.boolean() }),
  directToStore: z.object({
    url: z.string().url(),
    deepLink: z.boolean(),
    platform: z.enum(['iOS', 'Android', 'Both'])
  })
});

export async function generateVariantsWithAI(
  prompt: string,
  projectContext: ProjectContext,
  batchSize: number = 50,
  onProgress?: (count: number) => void
): Promise<VariantConfig[]> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const candidates: VariantConfig[] = [];
  const targetCandidates = Math.min(batchSize * 3, 150); // generate 3x, filter down

  // Batch generate with parallel calls (10 at a time)
  const batchCount = Math.ceil(targetCandidates / 10);
  for (let b = 0; b < batchCount; b++) {
    const responses = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        client.beta.chat.completions.parse({
          model: 'gpt-4o-mini', // cost efficient
          messages: [
            { role: 'system', content: buildSystemPrompt(projectContext) },
            { role: 'user', content: `${prompt} [variation ${b * 10 + i + 1}]` }
          ],
          response_format: zodResponseFormat(VariantConfigSchema, 'variant_config'),
          temperature: 0.9 // high diversity
        })
      )
    );
    candidates.push(...responses
      .map(r => r.choices[0].message.parsed)
      .filter(Boolean) as VariantConfig[]);
    onProgress?.(candidates.length);
  }

  // Deduplicate & rank
  const diverse = deduplicateVariants(candidates, batchSize);
  return rankByPredictedPerformance(diverse, projectContext);
}
```

### 2. Streaming SSE Endpoint

```typescript
// src/app/api/ai/stream/route.ts
export async function POST(req: Request) {
  const { prompt, projectId, batchSize } = await req.json();
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      try {
        send({ type: 'start', batchSize });
        const variants = await generateVariantsWithAI(
          prompt, project, batchSize,
          (count) => send({ type: 'progress', count })
        );
        // Save to DB
        const saved = await saveGeneratedVariants(variants, projectId, prompt);
        send({ type: 'complete', variants: saved });
      } catch (e) {
        send({ type: 'error', message: e.message });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  });
}
```

### 3. MinHash Deduplication

```typescript
// src/lib/variant-deduplicator.ts
function configToFeatureVector(config: VariantConfig): string[] {
  return [
    `cta_color:${config.cta.color}`,
    `cta_pos:${config.cta.position}`,
    `mechanic:${config.mechanic.type}`,
    `difficulty:${Math.round(config.mechanic.difficulty / 10) * 10}`,
    `sound:${config.sound.enabled}`,
    `tutorial_steps:${config.tutorial.steps}`,
    `platform:${config.directToStore.platform}`
  ];
}

export function deduplicateVariants(configs: VariantConfig[], limit: number): VariantConfig[] {
  const selected: VariantConfig[] = [];
  const seen = new Set<string>();

  for (const config of configs) {
    const key = configToFeatureVector(config).sort().join('|');
    if (!seen.has(key)) {
      seen.add(key);
      selected.push(config);
      if (selected.length >= limit) break;
    }
  }
  return selected;
}
```

### 4. Claude Vision Analysis

```typescript
// src/lib/vision-analyzer.ts
import Anthropic from '@anthropic-ai/sdk';

export async function analyzeGameScreenshot(imageBase64: string): Promise<CreativeAnalysis> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/png', data: imageBase64 } },
        {
          type: 'text',
          text: `Analyze this mobile game screenshot for playable ad creation. Return JSON:
{
  "mechanic": "Puzzle|Match3|Runner|Idle|Strategy",
  "dominantColors": ["#hex1", "#hex2"],
  "recommendedCtaColor": "#hex",  // high contrast against background
  "recommendedCtaPosition": "top|bottom",
  "complexity": "simple|medium|complex",
  "targetAudience": "casual|midcore|hardcore",
  "suggestions": ["specific improvement suggestion 1", "..."]
}`
        }
      ]
    }]
  });

  return JSON.parse(response.content[0].text);
}
```

### 5. Performance Predictor (Phase 3 baseline)

```typescript
// src/lib/performance-predictor.ts
// Logistic regression trên feature weights — sẽ được thay bằng ESMM ở Phase 7

const FEATURE_WEIGHTS = {
  mechanic_Puzzle: 0.3,
  mechanic_Match3: 0.5,
  mechanic_Runner: 0.2,
  difficulty_high: 0.4,     // difficulty > 70
  cta_neon: 0.2,             // #F97316, #EF4444, etc.
  cta_bottom: 0.15,
  sound_enabled: 0.1,
  tutorial_short: 0.1,       // steps <= 3
  platform_both: 0.2
};

export function predictCTR(config: VariantConfig): { ctr: number; confidence: number } {
  let score = 3.0; // baseline CTR
  const neonColors = ['#F97316', '#EF4444', '#A855F7', '#06B6D4'];

  if (config.mechanic.difficulty > 70) score += FEATURE_WEIGHTS.difficulty_high;
  if (config.mechanic.type === 'Match3') score += FEATURE_WEIGHTS.mechanic_Match3;
  if (neonColors.includes(config.cta.color)) score += FEATURE_WEIGHTS.cta_neon;
  if (config.cta.position === 'bottom') score += FEATURE_WEIGHTS.cta_bottom;
  if (config.sound.enabled) score += FEATURE_WEIGHTS.sound_enabled;
  if (config.tutorial.steps <= 3) score += FEATURE_WEIGHTS.tutorial_short;
  if (config.directToStore.platform === 'Both') score += FEATURE_WEIGHTS.platform_both;

  return { ctr: Number(score.toFixed(2)), confidence: 0.65 }; // 65% confidence until Phase 7
}
```

## Environment Variables

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
AI_GENERATION_BUDGET_USD=10  # daily spend limit
```

## Todo List

- [ ] Cài `@anthropic-ai/sdk` và `zod`
- [ ] Rewrite `src/lib/openai.ts` → `src/lib/ai-orchestrator.ts`
- [ ] Implement `src/lib/variant-deduplicator.ts`
- [ ] Implement `src/lib/performance-predictor.ts` (logistic regression baseline)
- [ ] Implement `src/lib/vision-analyzer.ts` (Claude Vision)
- [ ] Create `src/lib/ai-prompt-templates.ts` với few-shot examples
- [ ] Create `/api/ai/stream/route.ts` (SSE streaming)
- [ ] Create `/api/ai/analyze/route.ts` (Vision analysis)
- [ ] Update `use-studio-store.ts` → consume SSE stream
- [ ] Update `ai-copilot-pane.tsx` → show streaming progress
- [ ] Log AI costs vào `AIGenerationLog` table
- [ ] Daily cost limit guard

## Success Criteria

- Generate 50 real, diverse variants từ 1 prompt (không mock)
- Streaming progress hiển thị real-time trong UI
- Claude Vision phân tích screenshot và trả về recommendations
- Variants được deduplicate (không có 2 config giống hệt nhau)
- AI cost được log vào DB
- Tổng latency generate 50 variants < 60 seconds

## Security Considerations

- API keys chỉ dùng server-side (API routes), không expose qua client
- Daily cost limit để tránh runaway spending
- Rate limit per user (10 generations/hour)
- Sanitize user prompts trước khi gửi lên OpenAI
