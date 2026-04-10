import type { VariantConfig } from "@/types";

export const variantConfigSchema = {
  type: "object",
  properties: {
    cta: { type: "object" },
    images: { type: "object" },
    sound: { type: "object" },
    tutorial: { type: "object" },
    mechanic: { type: "object" },
    level: { type: "object" },
    directToStore: { type: "object" }
  },
  required: ["cta", "images", "sound", "tutorial", "mechanic", "level", "directToStore"]
};

export async function generateVariantConfig(prompt: string, context: object): Promise<VariantConfig> {
  // Mock-only mode: always return locally generated config.
  void context;
  return mockGeneratedConfig(prompt);
}

export function predictPerformance(config: VariantConfig): { ctr: number; reason: string } {
  const bonus = config.mechanic.difficulty > 70 ? 0.4 : 0;
  const neonBonus = config.cta.color.toLowerCase() === "#f97316" ? 0.2 : 0;
  const ctr = Number((3.6 + bonus + neonBonus).toFixed(1));
  return {
    ctr,
    reason: "based on past Neon themes and mechanic similarity"
  };
}

export function mockGeneratedConfig(prompt: string): VariantConfig {
  const neonTheme = prompt.toLowerCase().includes("neon");
  return {
    cta: {
      text: neonTheme ? "Play Neon Challenge" : "Play Now",
      color: neonTheme ? "#F97316" : "#22C55E",
      position: "bottom"
    },
    images: {
      spriteReplacement: null,
      background: null
    },
    sound: {
      enabled: true,
      volume: 65
    },
    tutorial: {
      autoStart: true,
      steps: 3
    },
    mechanic: {
      type: "Puzzle",
      difficulty: 72
    },
    level: {
      count: 50,
      progressiveDifficulty: true
    },
    directToStore: {
      url: "https://apps.apple.com",
      deepLink: false,
      platform: "Both"
    }
  };
}
