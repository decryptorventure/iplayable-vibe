// ──────────────────────────────────────────────
// iPlayable AI Agent — Extended Mock Data Layer
// Rich performance data for 20 playable ads with
// 30-day time series & per-network breakdowns.
// ──────────────────────────────────────────────

import type { PlayableDetail, DailyMetric, NetworkMetric } from "@/types/agent";

// ── Helpers ──

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function generateDailyMetrics(
  baseCTR: number,
  baseImpressions: number,
  days: number = 30,
  trend: "up" | "down" | "stable" = "stable"
): DailyMetric[] {
  const metrics: DailyMetric[] = [];
  for (let i = days; i >= 0; i--) {
    const trendFactor =
      trend === "up"
        ? 1 + ((days - i) / days) * 0.25
        : trend === "down"
          ? 1 - ((days - i) / days) * 0.3
          : 1;
    const noise = 0.85 + Math.random() * 0.3;
    const impressions = Math.round(baseImpressions * noise * trendFactor);
    const ctr = Number((baseCTR * (0.9 + Math.random() * 0.2) * trendFactor).toFixed(2));
    const clicks = Math.round(impressions * ctr / 100);
    const cvr = Number((ctr * 0.42 * (0.85 + Math.random() * 0.3)).toFixed(2));
    const installs = Math.round(clicks * cvr / 100);
    const ir = Number(((installs / impressions) * 100).toFixed(3));
    const revenue = Number((installs * (1.2 + Math.random() * 0.8)).toFixed(2));
    const spend = Number((impressions * 0.012 * (0.9 + Math.random() * 0.2)).toFixed(2));
    const roas = spend > 0 ? Number((revenue / spend).toFixed(2)) : 0;

    metrics.push({
      date: daysAgo(i),
      impressions,
      clicks,
      installs,
      ctr,
      cvr,
      ir,
      revenue,
      spend,
      roas,
    });
  }
  return metrics;
}

function generateNetworkMetrics(
  networks: string[],
  totalImpressions: number,
  baseCTR: number
): NetworkMetric[] {
  const shares: Record<string, number> = {
    AppLovin: 0.45,
    Unity: 0.3,
    Mintegral: 0.25,
  };
  return networks.map((network) => {
    const share = shares[network] ?? 0.33;
    const impressions = Math.round(totalImpressions * share);
    const ctr = Number((baseCTR * (0.9 + Math.random() * 0.2)).toFixed(2));
    const clicks = Math.round(impressions * ctr / 100);
    const cvr = Number((ctr * 0.4 * (0.85 + Math.random() * 0.3)).toFixed(2));
    const installs = Math.round(clicks * cvr / 100);
    const revenue = Number((installs * (1.0 + Math.random() * 1.0)).toFixed(2));
    const fillRate = Number((85 + Math.random() * 12).toFixed(1));
    return { network, impressions, clicks, installs, ctr, cvr, revenue, fillRate };
  });
}

function aggregate(daily: DailyMetric[]) {
  const totals = daily.reduce(
    (acc, d) => ({
      impressions: acc.impressions + d.impressions,
      clicks: acc.clicks + d.clicks,
      installs: acc.installs + d.installs,
      revenue: acc.revenue + d.revenue,
      spend: acc.spend + d.spend,
    }),
    { impressions: 0, clicks: 0, installs: 0, revenue: 0, spend: 0 }
  );
  return {
    totalImpressions: totals.impressions,
    totalClicks: totals.clicks,
    totalInstalls: totals.installs,
    avgCTR: Number(((totals.clicks / totals.impressions) * 100).toFixed(2)),
    avgCVR: Number(
      totals.clicks > 0
        ? ((totals.installs / totals.clicks) * 100).toFixed(2)
        : "0"
    ),
    avgIR: Number(
      totals.impressions > 0
        ? ((totals.installs / totals.impressions) * 100).toFixed(3)
        : "0"
    ),
    totalRevenue: Number(totals.revenue.toFixed(2)),
    totalSpend: Number(totals.spend.toFixed(2)),
    roas: Number(
      totals.spend > 0 ? (totals.revenue / totals.spend).toFixed(2) : "0"
    ),
  };
}

// ── Build Database ──

interface PlayableSeed {
  id: string;
  name: string;
  code: string;
  projectId: string;
  projectName: string;
  status: "active" | "inactive" | "draft";
  mechanic: string;
  imageCount: number;
  soundEnabled: boolean;
  fileSize: number;
  tutorialSteps: number;
  variantCount: number;
  networks: string[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
  baseCTR: number;
  baseImpressions: number;
  trend: "up" | "down" | "stable";
}

const seeds: PlayableSeed[] = [
  { id: "pa-1", name: "B2 Wool Loop", code: "B2WL", projectId: "proj-water-factory", projectName: "iG Water Factory", status: "active", mechanic: "Puzzle", imageCount: 12, soundEnabled: true, fileSize: 4300, tutorialSteps: 3, variantCount: 3, networks: ["AppLovin", "Unity"], createdBy: "chungqt@ikameglobal.com", createdAt: "2026-02-15", lastModified: "2026-04-08", baseCTR: 4.2, baseImpressions: 8500, trend: "stable" },
  { id: "pa-2", name: "B2 Word Jam", code: "B2WJ", projectId: "proj-water-factory", projectName: "iG Water Factory", status: "active", mechanic: "Word", imageCount: 8, soundEnabled: true, fileSize: 3800, tutorialSteps: 4, variantCount: 4, networks: ["Mintegral"], createdBy: "chungqt@ikameglobal.com", createdAt: "2026-02-20", lastModified: "2026-04-08", baseCTR: 3.6, baseImpressions: 7200, trend: "down" },
  { id: "pa-3", name: "iG Sticker Out", code: "IGSO", projectId: "proj-sticker-out", projectName: "iG Sticker Out", status: "active", mechanic: "Puzzle", imageCount: 15, soundEnabled: true, fileSize: 5200, tutorialSteps: 3, variantCount: 4, networks: ["AppLovin", "Mintegral"], createdBy: "binhht@ikameglobal.com", createdAt: "2026-01-10", lastModified: "2026-04-07", baseCTR: 5.1, baseImpressions: 12000, trend: "up" },
  { id: "pa-4", name: "Majong Jam", code: "IGMJ", projectId: "proj-monster-merge", projectName: "iG Monster Merge", status: "active", mechanic: "Match-3", imageCount: 18, soundEnabled: true, fileSize: 4100, tutorialSteps: 2, variantCount: 4, networks: ["Unity"], createdBy: "chungqt@ikameglobal.com", createdAt: "2026-03-01", lastModified: "2026-04-07", baseCTR: 3.9, baseImpressions: 6800, trend: "stable" },
  { id: "pa-5", name: "Pixel Blast", code: "B2PB", projectId: "proj-water-factory", projectName: "iG Water Factory", status: "active", mechanic: "Shooter", imageCount: 20, soundEnabled: true, fileSize: 3500, tutorialSteps: 2, variantCount: 5, networks: ["AppLovin"], createdBy: "dungxv@ikameglobal.com", createdAt: "2026-01-25", lastModified: "2026-04-06", baseCTR: 4.8, baseImpressions: 9500, trend: "up" },
  { id: "pa-6", name: "Ptit Merge Fruit", code: "IGMF", projectId: "proj-monster-merge", projectName: "iG Monster Merge", status: "active", mechanic: "Merge", imageCount: 22, soundEnabled: true, fileSize: 4800, tutorialSteps: 4, variantCount: 6, networks: ["Mintegral", "Unity"], createdBy: "thannv@ikameglobal.com", createdAt: "2026-02-10", lastModified: "2026-04-06", baseCTR: 3.2, baseImpressions: 5800, trend: "down" },
  { id: "pa-7", name: "Pub Dream Room", code: "GPDR", projectId: "proj-bubble-quest", projectName: "iG Bubble Quest", status: "active", mechanic: "Decoration", imageCount: 25, soundEnabled: false, fileSize: 5500, tutorialSteps: 5, variantCount: 3, networks: ["AppLovin"], createdBy: "binhht@ikameglobal.com", createdAt: "2026-03-05", lastModified: "2026-04-05", baseCTR: 4.5, baseImpressions: 7800, trend: "stable" },
  { id: "pa-8", name: "Pub Thief Hunter", code: "p1H", projectId: "proj-bubble-quest", projectName: "iG Bubble Quest", status: "active", mechanic: "Action", imageCount: 14, soundEnabled: true, fileSize: 4600, tutorialSteps: 2, variantCount: 5, networks: ["Unity", "Mintegral"], createdBy: "chungqt@ikameglobal.com", createdAt: "2026-01-15", lastModified: "2026-04-05", baseCTR: 5.3, baseImpressions: 11000, trend: "up" },
  { id: "pa-9", name: "Pub Tidy Up", code: "IGTU", projectId: "proj-sticker-out", projectName: "iG Sticker Out", status: "active", mechanic: "Sorting", imageCount: 10, soundEnabled: false, fileSize: 3200, tutorialSteps: 3, variantCount: 2, networks: ["AppLovin"], createdBy: "dungxv@ikameglobal.com", createdAt: "2026-03-10", lastModified: "2026-04-04", baseCTR: 3.0, baseImpressions: 4500, trend: "down" },
  { id: "pa-10", name: "iG Block Buster", code: "IGBB", projectId: "proj-water-factory", projectName: "iG Water Factory", status: "active", mechanic: "Puzzle", imageCount: 16, soundEnabled: true, fileSize: 4200, tutorialSteps: 3, variantCount: 4, networks: ["Mintegral"], createdBy: "thannv@ikameglobal.com", createdAt: "2026-02-28", lastModified: "2026-04-04", baseCTR: 4.1, baseImpressions: 7000, trend: "stable" },
  { id: "pa-11", name: "iG Block Escape 3D", code: "IGBE", projectId: "proj-monster-merge", projectName: "iG Monster Merge", status: "inactive", mechanic: "Puzzle", imageCount: 30, soundEnabled: true, fileSize: 6100, tutorialSteps: 5, variantCount: 1, networks: [], createdBy: "binhht@ikameglobal.com", createdAt: "2026-01-20", lastModified: "2026-04-03", baseCTR: 2.1, baseImpressions: 3000, trend: "down" },
  { id: "pa-12", name: "iG Bus Out", code: "IGBO", projectId: "proj-sticker-out", projectName: "iG Sticker Out", status: "active", mechanic: "Puzzle", imageCount: 11, soundEnabled: true, fileSize: 3900, tutorialSteps: 3, variantCount: 1, networks: ["AppLovin"], createdBy: "chungqt@ikameglobal.com", createdAt: "2026-03-15", lastModified: "2026-04-03", baseCTR: 3.7, baseImpressions: 5500, trend: "stable" },
  { id: "pa-13", name: "iG Coffee Rush", code: "IGCR", projectId: "proj-water-factory", projectName: "iG Water Factory", status: "active", mechanic: "Runner", imageCount: 13, soundEnabled: true, fileSize: 4500, tutorialSteps: 2, variantCount: 5, networks: ["Unity"], createdBy: "dungxv@ikameglobal.com", createdAt: "2026-02-05", lastModified: "2026-04-02", baseCTR: 4.6, baseImpressions: 8800, trend: "up" },
  { id: "pa-14", name: "iG Color Bus Flow", code: "IGCF", projectId: "proj-monster-merge", projectName: "iG Monster Merge", status: "active", mechanic: "Match-3", imageCount: 17, soundEnabled: true, fileSize: 5000, tutorialSteps: 3, variantCount: 4, networks: ["Mintegral", "AppLovin"], createdBy: "thannv@ikameglobal.com", createdAt: "2026-03-20", lastModified: "2026-04-02", baseCTR: 3.4, baseImpressions: 6200, trend: "stable" },
  { id: "pa-15", name: "iG Color Yarn 3D", code: "IGCU", projectId: "proj-bubble-quest", projectName: "iG Bubble Quest", status: "active", mechanic: "Match-3", imageCount: 19, soundEnabled: true, fileSize: 4700, tutorialSteps: 3, variantCount: 5, networks: ["Unity"], createdBy: "binhht@ikameglobal.com", createdAt: "2026-01-30", lastModified: "2026-04-01", baseCTR: 5.0, baseImpressions: 10000, trend: "up" },
  { id: "pa-16", name: "iG ColorMood", code: "IGCM", projectId: "proj-sticker-out", projectName: "iG Sticker Out", status: "active", mechanic: "Puzzle", imageCount: 9, soundEnabled: false, fileSize: 3600, tutorialSteps: 4, variantCount: 5, networks: ["AppLovin", "Mintegral"], createdBy: "chungqt@ikameglobal.com", createdAt: "2026-02-18", lastModified: "2026-04-01", baseCTR: 4.3, baseImpressions: 7500, trend: "stable" },
  { id: "pa-17", name: "iG Dragon Shooter", code: "IGDS", projectId: "proj-water-factory", projectName: "iG Water Factory", status: "draft", mechanic: "Shooter", imageCount: 5, soundEnabled: false, fileSize: 2800, tutorialSteps: 0, variantCount: 0, networks: [], createdBy: "dungxv@ikameglobal.com", createdAt: "2026-04-01", lastModified: "2026-04-01", baseCTR: 0, baseImpressions: 0, trend: "stable" },
  { id: "pa-18", name: "iG Drop In", code: "IGDI", projectId: "proj-monster-merge", projectName: "iG Monster Merge", status: "active", mechanic: "Merge", imageCount: 14, soundEnabled: true, fileSize: 4000, tutorialSteps: 3, variantCount: 3, networks: ["Unity"], createdBy: "thannv@ikameglobal.com", createdAt: "2026-03-08", lastModified: "2026-03-31", baseCTR: 3.8, baseImpressions: 6000, trend: "stable" },
  { id: "pa-19", name: "iG Gecko Arrow", code: "IGGA", projectId: "proj-bubble-quest", projectName: "iG Bubble Quest", status: "active", mechanic: "Action", imageCount: 11, soundEnabled: true, fileSize: 3700, tutorialSteps: 2, variantCount: 2, networks: ["Mintegral"], createdBy: "binhht@ikameglobal.com", createdAt: "2026-03-12", lastModified: "2026-03-31", baseCTR: 3.5, baseImpressions: 5200, trend: "down" },
  { id: "pa-20", name: "iG Goods Jam", code: "IGGJ", projectId: "proj-sticker-out", projectName: "iG Sticker Out", status: "active", mechanic: "Sorting", imageCount: 13, soundEnabled: true, fileSize: 4400, tutorialSteps: 3, variantCount: 4, networks: ["AppLovin"], createdBy: "chungqt@ikameglobal.com", createdAt: "2026-02-25", lastModified: "2026-03-30", baseCTR: 4.0, baseImpressions: 6500, trend: "stable" },
];

function buildPlayable(seed: PlayableSeed): PlayableDetail {
  const daily = seed.status === "draft"
    ? []
    : generateDailyMetrics(seed.baseCTR, seed.baseImpressions, 30, seed.trend);
  const agg = daily.length > 0
    ? aggregate(daily)
    : { totalImpressions: 0, totalClicks: 0, totalInstalls: 0, avgCTR: 0, avgCVR: 0, avgIR: 0, totalRevenue: 0, totalSpend: 0, roas: 0 };
  const networkMetrics = seed.networks.length > 0
    ? generateNetworkMetrics(seed.networks, agg.totalImpressions, seed.baseCTR)
    : [];

  return { ...seed, dailyMetrics: daily, networkMetrics, ...agg };
}

// ── Singleton DB (generated once) ──

let _db: PlayableDetail[] | null = null;

function getDB(): PlayableDetail[] {
  if (!_db) {
    _db = seeds.map(buildPlayable);
  }
  return _db;
}

// ──────────────────────────────────────────────
// Public Query Functions (used by agent tools)
// ──────────────────────────────────────────────

export function getAllPlayables(): PlayableDetail[] {
  return getDB();
}

export function getPlayableById(id: string): PlayableDetail | undefined {
  return getDB().find((p) => p.id === id);
}

export function getPlayableByCode(code: string): PlayableDetail | undefined {
  return getDB().find((p) => p.code.toLowerCase() === code.toLowerCase());
}

export function getPlayableByName(name: string): PlayableDetail | undefined {
  const lower = name.toLowerCase();
  return getDB().find(
    (p) =>
      p.name.toLowerCase() === lower ||
      p.name.toLowerCase().includes(lower) ||
      p.code.toLowerCase() === lower
  );
}

export function searchPlayables(query: string): PlayableDetail[] {
  const q = query.toLowerCase();
  return getDB().filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.mechanic.toLowerCase().includes(q) ||
      p.projectName.toLowerCase().includes(q)
  );
}

export function filterPlayables(filter: {
  mechanic?: string;
  status?: string;
  network?: string;
  projectId?: string;
}): PlayableDetail[] {
  return getDB().filter((p) => {
    if (filter.mechanic && p.mechanic.toLowerCase() !== filter.mechanic.toLowerCase()) return false;
    if (filter.status && p.status !== filter.status) return false;
    if (filter.network && !p.networks.some((n) => n.toLowerCase() === filter.network!.toLowerCase())) return false;
    if (filter.projectId && p.projectId !== filter.projectId) return false;
    return true;
  });
}

/** Filter daily metrics to a time range */
export function filterMetricsByRange(
  daily: DailyMetric[],
  range: string
): DailyMetric[] {
  const days =
    range === "24h" ? 1 : range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return daily.slice(-days);
}

/** Get portfolio-level summary */
export function getPortfolioSummary() {
  const all = getDB().filter((p) => p.status === "active");
  const total = all.length;
  const totalImpressions = all.reduce((s, p) => s + p.totalImpressions, 0);
  const totalClicks = all.reduce((s, p) => s + p.totalClicks, 0);
  const totalInstalls = all.reduce((s, p) => s + p.totalInstalls, 0);
  const totalRevenue = all.reduce((s, p) => s + p.totalRevenue, 0);
  const totalSpend = all.reduce((s, p) => s + p.totalSpend, 0);
  const avgCTR = totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0;
  const avgCVR = totalClicks > 0 ? Number(((totalInstalls / totalClicks) * 100).toFixed(2)) : 0;

  // Mechanics distribution
  const mechanicMap = new Map<string, number>();
  all.forEach((p) => {
    mechanicMap.set(p.mechanic, (mechanicMap.get(p.mechanic) ?? 0) + 1);
  });
  const mechanics = Array.from(mechanicMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalActive: total,
    totalDraft: getDB().filter((p) => p.status === "draft").length,
    totalInactive: getDB().filter((p) => p.status === "inactive").length,
    totalImpressions,
    totalClicks,
    totalInstalls,
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalSpend: Number(totalSpend.toFixed(2)),
    avgCTR,
    avgCVR,
    roas: totalSpend > 0 ? Number((totalRevenue / totalSpend).toFixed(2)) : 0,
    mechanics,
  };
}
