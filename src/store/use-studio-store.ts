"use client";

import { create } from "zustand";
import { mockGeneratedConfig, predictPerformance } from "@/lib/openai";
import { STUDIO_PRESETS } from "@/lib/studio-presets";
import type { ChatMessage, VariantConfig } from "@/types";

interface VariantListItem {
  id: string;
  name: string;
  createdAt: number;
  config: VariantConfig;
  predictedCTR: number;
  predictionReason: string;
}

interface StudioState {
  workflowStep: "selection" | "edit";
  config: VariantConfig;
  chatMessages: ChatMessage[];
  variants: VariantListItem[];
  selectedVariant: string | null;
  selectedVariantIds: string[];
  isGenerating: boolean;
  middlePaneCollapsed: boolean;
  predictedCTR: number;
  predictionReason: string;
  targetBatchSize: number;
  generatedCount: number;
  generationProgress: number;
  setMiddlePaneCollapsed: (value: boolean) => void;
  updateConfig: (config: VariantConfig) => void;
  addUserMessage: (content: string) => void;
  generateVariants: (prompt: string, batchSize?: number) => Promise<void>;
  selectVariant: (id: string) => void;
  toggleVariantSelection: (id: string) => void;
  loadPreset: (presetId: string) => void;
  goToEditStep: () => void;
  backToSelectionStep: () => void;
}

const defaultConfig = mockGeneratedConfig("default");
const prediction = predictPerformance(defaultConfig);

const mechanics: Array<VariantConfig["mechanic"]["type"]> = ["Puzzle", "Match3", "Runner"];
const ctaPalette = ["#F97316", "#22C55E", "#06B6D4", "#A855F7", "#EF4444"];

function buildVariantFromPrompt(prompt: string, index: number): VariantListItem {
  const seeded = mockGeneratedConfig(`${prompt} v${index + 1}`);
  const difficulty = 35 + ((index * 9) % 65);
  const steps = 1 + (index % 6);
  const ctaColor = ctaPalette[index % ctaPalette.length];

  const config: VariantConfig = {
    ...seeded,
    cta: {
      ...seeded.cta,
      text: `${seeded.cta.text} #${index + 1}`,
      color: ctaColor,
      position: index % 2 === 0 ? "bottom" : "top"
    },
    sound: {
      ...seeded.sound,
      volume: 30 + ((index * 7) % 70)
    },
    tutorial: {
      ...seeded.tutorial,
      autoStart: index % 3 !== 0,
      steps
    },
    mechanic: {
      ...seeded.mechanic,
      difficulty,
      type: mechanics[index % mechanics.length]
    },
    level: {
      ...seeded.level,
      count: 10 + ((index + 1) % 50),
      progressiveDifficulty: index % 2 === 0
    }
  };

  const nextPrediction = predictPerformance(config);

  return {
    id: crypto.randomUUID(),
    name: `Variant ${index + 1}`,
    createdAt: Date.now() + index,
    config,
    predictedCTR: nextPrediction.ctr + Number((Math.random() * 0.8).toFixed(1)),
    predictionReason: nextPrediction.reason
  };
}

export const useStudioStore = create<StudioState>((set, get) => ({
  workflowStep: "selection",
  config: defaultConfig,
  chatMessages: [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Xin chao! Mo ta campaign mong muon va toi se tao batch playable variants tu dong cho ban.",
      createdAt: Date.now()
    }
  ],
  variants: [],
  selectedVariant: null,
  selectedVariantIds: [],
  isGenerating: false,
  middlePaneCollapsed: false,
  predictedCTR: prediction.ctr,
  predictionReason: prediction.reason,
  targetBatchSize: 50,
  generatedCount: 0,
  generationProgress: 0,
  setMiddlePaneCollapsed: (value) => set({ middlePaneCollapsed: value }),
  updateConfig: (config) => {
    const nextPrediction = predictPerformance(config);
    set({
      config,
      predictedCTR: nextPrediction.ctr,
      predictionReason: nextPrediction.reason
    });
  },
  addUserMessage: (content) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          id: crypto.randomUUID(),
          role: "user",
          content,
          createdAt: Date.now()
        }
      ]
    })),
  generateVariants: async (prompt, batchSize = get().targetBatchSize) => {
    const assistantLoading: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Dang sinh config voi AI...",
      createdAt: Date.now()
    };

    set((state) => ({
      isGenerating: true,
      workflowStep: "selection",
      generationProgress: 0,
      generatedCount: 0,
      chatMessages: [...state.chatMessages, assistantLoading]
    }));

    await new Promise((resolve) => setTimeout(resolve, 600));

    const generated: VariantListItem[] = [];
    for (let index = 0; index < batchSize; index += 1) {
      generated.push(buildVariantFromPrompt(prompt, index));
      if (index % 10 === 0 || index === batchSize - 1) {
        set({
          generationProgress: Math.round(((index + 1) / batchSize) * 100),
          generatedCount: index + 1
        });
        await new Promise((resolve) => setTimeout(resolve, 90));
      }
    }

    generated.sort((a, b) => b.predictedCTR - a.predictedCTR);

    const firstRecommended = generated[0];
    const nextPrediction = predictPerformance(firstRecommended.config);

    set((state) => ({
      config: firstRecommended.config,
      variants: generated,
      selectedVariant: firstRecommended.id,
      selectedVariantIds: generated.slice(0, 8).map((item) => item.id),
      isGenerating: false,
      predictedCTR: nextPrediction.ctr,
      predictionReason: nextPrediction.reason,
      generationProgress: 100,
      generatedCount: generated.length,
      chatMessages: [
        ...state.chatMessages.filter((message) => message.id !== assistantLoading.id),
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            `Da tao xong ${generated.length} variants. Hay chon cac mau co CTR tot nhat, sau do chuyen sang man hinh edit chi tiet.`,
          createdAt: Date.now()
        }
      ]
    }));
  },
  selectVariant: (id) =>
    set((state) => {
      const variant = state.variants.find((item) => item.id === id);
      if (!variant) return {};
      const nextPrediction = predictPerformance(variant.config);
      return {
        selectedVariant: id,
        config: variant.config,
        predictedCTR: nextPrediction.ctr,
        predictionReason: nextPrediction.reason
      };
    }),
  toggleVariantSelection: (id) =>
    set((state) => {
      const exists = state.selectedVariantIds.includes(id);
      return {
        selectedVariantIds: exists
          ? state.selectedVariantIds.filter((variantId) => variantId !== id)
          : [...state.selectedVariantIds, id]
      };
    }),
  loadPreset: (presetId) =>
    set((state) => {
      const preset = STUDIO_PRESETS.find((item) => item.id === presetId);
      if (!preset) return {};
      const nextPrediction = predictPerformance(preset.config);
      return {
        config: preset.config,
        predictedCTR: nextPrediction.ctr,
        predictionReason: nextPrediction.reason,
        chatMessages: [
          ...state.chatMessages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Loaded preset: ${preset.name}. Ban co the bam generate de tao 50 variants tu preset nay.`,
            createdAt: Date.now()
          }
        ]
      };
    }),
  goToEditStep: () =>
    set((state) => {
      const firstSelectedId = state.selectedVariantIds[0] ?? state.selectedVariant;
      const firstSelectedVariant = state.variants.find((item) => item.id === firstSelectedId);
      if (!firstSelectedVariant) return { workflowStep: "edit" as const };
      const nextPrediction = predictPerformance(firstSelectedVariant.config);
      return {
        workflowStep: "edit" as const,
        selectedVariant: firstSelectedVariant.id,
        config: firstSelectedVariant.config,
        predictedCTR: nextPrediction.ctr,
        predictionReason: nextPrediction.reason
      };
    }),
  backToSelectionStep: () => set({ workflowStep: "selection" })
}));
