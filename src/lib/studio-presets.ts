import type { VariantConfig } from "@/types";

export interface StudioPreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  config: VariantConfig;
}

export const STUDIO_PRESETS: StudioPreset[] = [
  {
    id: "christmas-neon-hard",
    name: "Christmas Neon Hard",
    description: "Hard-level puzzle with neon Christmas visual cues and strong CTA.",
    prompt:
      "Generate 50 hard-level variants with neon themes for Christmas. Optimize first 3 seconds hook and conversion.",
    config: {
      cta: {
        text: "Play Neon Challenge",
        color: "#F97316",
        position: "bottom"
      },
      images: {
        spriteReplacement: null,
        background: null
      },
      sound: {
        enabled: true,
        volume: 68
      },
      tutorial: {
        autoStart: true,
        steps: 3
      },
      mechanic: {
        type: "Puzzle",
        difficulty: 78
      },
      level: {
        count: 50,
        progressiveDifficulty: true
      },
      directToStore: {
        url: "https://apps.apple.com/app/id1234567890",
        deepLink: true,
        platform: "Both"
      }
    }
  },
  {
    id: "casual-collect-relax",
    name: "Casual Collect Relax",
    description: "Low-friction onboarding for broad audiences with softer pacing.",
    prompt:
      "Generate 50 casual variants for broad audience. Focus on easy mechanic, calm mood, and gradual tutorial.",
    config: {
      cta: {
        text: "Try Free",
        color: "#22C55E",
        position: "bottom"
      },
      images: {
        spriteReplacement: null,
        background: null
      },
      sound: {
        enabled: true,
        volume: 45
      },
      tutorial: {
        autoStart: true,
        steps: 5
      },
      mechanic: {
        type: "Match3",
        difficulty: 34
      },
      level: {
        count: 20,
        progressiveDifficulty: false
      },
      directToStore: {
        url: "https://play.google.com/store/apps/details?id=com.example.game",
        deepLink: false,
        platform: "Android"
      }
    }
  },
  {
    id: "speed-runner-competitive",
    name: "Speed Runner Competitive",
    description: "Fast, adrenaline flow with aggressive CTA for high intent traffic.",
    prompt:
      "Generate 50 runner variants with competitive speed challenge. Emphasize fast pacing and direct install intent.",
    config: {
      cta: {
        text: "Beat This Level",
        color: "#EF4444",
        position: "top"
      },
      images: {
        spriteReplacement: null,
        background: null
      },
      sound: {
        enabled: true,
        volume: 82
      },
      tutorial: {
        autoStart: false,
        steps: 2
      },
      mechanic: {
        type: "Runner",
        difficulty: 66
      },
      level: {
        count: 35,
        progressiveDifficulty: true
      },
      directToStore: {
        url: "https://apps.apple.com/app/id1234567890",
        deepLink: true,
        platform: "iOS"
      }
    }
  }
];
