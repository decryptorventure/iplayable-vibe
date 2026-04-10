export type ProjectStatus = "Active" | "AI Syncing" | "Paused";

export interface Project {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  totalVariants: number;
  avgCTR: number;
  avgCVR: number;
  totalSpend: number;
  thumbnail?: string | null;
}

export interface VariantConfig {
  cta: {
    text: string;
    color: string;
    position: "top" | "bottom";
  };
  images: {
    spriteReplacement: string | null;
    background: string | null;
  };
  sound: {
    enabled: boolean;
    volume: number;
  };
  tutorial: {
    autoStart: boolean;
    steps: number;
  };
  mechanic: {
    type: "Puzzle" | "Match3" | "Runner";
    difficulty: number;
  };
  level: {
    count: number;
    progressiveDifficulty: boolean;
  };
  directToStore: {
    url: string;
    deepLink: boolean;
    platform: "iOS" | "Android" | "Both";
  };
}

export interface Variant {
  id: string;
  projectId: string;
  name: string;
  config: VariantConfig;
  status: "Draft" | "Ready" | "Deployed";
  ctr?: number | null;
  cvr?: number | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}
