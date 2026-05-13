// ──────────────────────────────────────────────
// iPlayable AI Agent — Type Definitions
// ──────────────────────────────────────────────

export type TimeRange = "24h" | "7d" | "30d" | "90d";

export interface AgentMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  citations?: AgentCitation[];
  followUps?: string[];
}

export interface AgentCitation {
  label: string;
  href: string;
}

export interface AgentSession {
  sessionId: string;
  messages: AgentMessage[];
  createdAt: number;
}

// ── Data types for mock metrics ──

export interface DailyMetric {
  date: string; // YYYY-MM-DD
  impressions: number;
  clicks: number;
  installs: number;
  ctr: number;
  cvr: number;
  ir: number;
  revenue: number;
  spend: number;
  roas: number;
}

export interface NetworkMetric {
  network: string;
  impressions: number;
  clicks: number;
  installs: number;
  ctr: number;
  cvr: number;
  revenue: number;
  fillRate: number;
}

export interface PlayableDetail {
  id: string;
  name: string;
  code: string;
  projectId: string;
  projectName: string;
  status: "active" | "inactive" | "draft";
  mechanic: string;
  imageCount: number;
  soundEnabled: boolean;
  fileSize: number; // KB
  tutorialSteps: number;
  variantCount: number;
  networks: string[];
  createdBy: string;
  createdAt: string; // ISO date
  lastModified: string;
  // Aggregated metrics (latest period)
  totalImpressions: number;
  totalClicks: number;
  totalInstalls: number;
  avgCTR: number;
  avgCVR: number;
  avgIR: number;
  totalRevenue: number;
  totalSpend: number;
  roas: number;
  // Time series & per-network
  dailyMetrics: DailyMetric[];
  networkMetrics: NetworkMetric[];
}

// ── Tool-related types ──

export interface ToolResult {
  success: boolean;
  data: unknown;
  summary: string;
}
