// ──────────────────────────────────────────────
// iPlayable AI Agent — Tool Functions
// 7 tools the agent can call to query data.
// ──────────────────────────────────────────────

import type { ToolResult } from "@/types/agent";
import {
  getAllPlayables,
  getPlayableById,
  getPlayableByName,
  filterPlayables,
  filterMetricsByRange,
  getPortfolioSummary,
} from "@/lib/agent-data";

// ────────────────────────────
// 1. query_playable_metrics
// ────────────────────────────
export function queryPlayableMetrics(args: {
  playable_id?: string;
  playable_name?: string;
  time_range?: string;
  metrics?: string[];
}): ToolResult {
  const p =
    (args.playable_id && getPlayableById(args.playable_id)) ||
    (args.playable_name && getPlayableByName(args.playable_name)) ||
    undefined;

  if (!p) {
    return { success: false, data: null, summary: `Không tìm thấy playable "${args.playable_name ?? args.playable_id}".` };
  }

  const range = args.time_range ?? "30d";
  const filtered = filterMetricsByRange(p.dailyMetrics, range);

  if (filtered.length === 0) {
    return { success: true, data: { name: p.name, status: p.status }, summary: `${p.name} ở trạng thái "${p.status}", không có dữ liệu metrics.` };
  }

  const totals = filtered.reduce(
    (acc, d) => ({
      impressions: acc.impressions + d.impressions,
      clicks: acc.clicks + d.clicks,
      installs: acc.installs + d.installs,
      revenue: acc.revenue + d.revenue,
      spend: acc.spend + d.spend,
    }),
    { impressions: 0, clicks: 0, installs: 0, revenue: 0, spend: 0 }
  );

  const avgCTR = totals.impressions > 0 ? Number(((totals.clicks / totals.impressions) * 100).toFixed(2)) : 0;
  const avgCVR = totals.clicks > 0 ? Number(((totals.installs / totals.clicks) * 100).toFixed(2)) : 0;

  const data = {
    name: p.name,
    code: p.code,
    mechanic: p.mechanic,
    status: p.status,
    networks: p.networks,
    imageCount: p.imageCount,
    fileSize: p.fileSize,
    timeRange: range,
    days: filtered.length,
    totalImpressions: totals.impressions,
    totalClicks: totals.clicks,
    totalInstalls: totals.installs,
    avgCTR,
    avgCVR,
    totalRevenue: Number(totals.revenue.toFixed(2)),
    totalSpend: Number(totals.spend.toFixed(2)),
    roas: totals.spend > 0 ? Number((totals.revenue / totals.spend).toFixed(2)) : 0,
    networkBreakdown: p.networkMetrics,
    createdAt: p.createdAt,
    variantCount: p.variantCount,
  };

  return {
    success: true,
    data,
    summary: `${p.name} (${range}): CTR ${avgCTR}%, CVR ${avgCVR}%, ${totals.impressions.toLocaleString()} impressions, revenue $${totals.revenue.toFixed(0)}`,
  };
}

// ────────────────────────────
// 2. list_playables
// ────────────────────────────
export function listPlayables(args: {
  mechanic?: string;
  status?: string;
  network?: string;
  project_id?: string;
}): ToolResult {
  const results = filterPlayables({
    mechanic: args.mechanic,
    status: args.status,
    network: args.network,
    projectId: args.project_id,
  });

  const data = results.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    mechanic: p.mechanic,
    status: p.status,
    networks: p.networks,
    avgCTR: p.avgCTR,
    avgCVR: p.avgCVR,
    totalImpressions: p.totalImpressions,
    variantCount: p.variantCount,
  }));

  return {
    success: true,
    data,
    summary: `Tìm thấy ${results.length} playable ads${args.mechanic ? ` (mechanic: ${args.mechanic})` : ""}${args.status ? ` (status: ${args.status})` : ""}${args.network ? ` (network: ${args.network})` : ""}.`,
  };
}

// ────────────────────────────
// 3. compare_playables
// ────────────────────────────
export function comparePlayables(args: {
  names?: string[];
  ids?: string[];
  time_range?: string;
}): ToolResult {
  const range = args.time_range ?? "30d";
  const targets =
    args.names?.map((n) => getPlayableByName(n)).filter(Boolean) ??
    args.ids?.map((id) => getPlayableById(id)).filter(Boolean) ??
    [];

  if (targets.length < 2) {
    return { success: false, data: null, summary: "Cần ít nhất 2 playable để so sánh." };
  }

  const data = targets.map((p) => {
    const filtered = filterMetricsByRange(p!.dailyMetrics, range);
    const totals = filtered.reduce(
      (acc, d) => ({
        impressions: acc.impressions + d.impressions,
        clicks: acc.clicks + d.clicks,
        installs: acc.installs + d.installs,
        revenue: acc.revenue + d.revenue,
        spend: acc.spend + d.spend,
      }),
      { impressions: 0, clicks: 0, installs: 0, revenue: 0, spend: 0 }
    );
    const avgCTR = totals.impressions > 0 ? Number(((totals.clicks / totals.impressions) * 100).toFixed(2)) : 0;
    return {
      name: p!.name,
      mechanic: p!.mechanic,
      avgCTR,
      totalImpressions: totals.impressions,
      totalInstalls: totals.installs,
      totalRevenue: Number(totals.revenue.toFixed(2)),
      roas: totals.spend > 0 ? Number((totals.revenue / totals.spend).toFixed(2)) : 0,
      imageCount: p!.imageCount,
      fileSize: p!.fileSize,
      networks: p!.networks,
    };
  });

  return {
    success: true,
    data,
    summary: `So sánh ${targets.length} playable trong ${range}: ${data.map((d) => `${d.name} CTR ${d.avgCTR}%`).join(" vs ")}`,
  };
}

// ────────────────────────────
// 4. get_trend
// ────────────────────────────
export function getTrend(args: {
  metric: string;
  dimension?: string;
  time_range?: string;
}): ToolResult {
  const range = args.time_range ?? "30d";
  const all = getAllPlayables().filter((p) => p.status === "active");

  // Portfolio-level trend: aggregate daily metrics across all active playables
  const dateMap = new Map<string, { impressions: number; clicks: number; installs: number; revenue: number }>();

  all.forEach((p) => {
    const filtered = filterMetricsByRange(p.dailyMetrics, range);
    filtered.forEach((d) => {
      const existing = dateMap.get(d.date) ?? { impressions: 0, clicks: 0, installs: 0, revenue: 0 };
      existing.impressions += d.impressions;
      existing.clicks += d.clicks;
      existing.installs += d.installs;
      existing.revenue += d.revenue;
      dateMap.set(d.date, existing);
    });
  });

  const sorted = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({
      date,
      ...vals,
      ctr: vals.impressions > 0 ? Number(((vals.clicks / vals.impressions) * 100).toFixed(2)) : 0,
    }));

  // Calculate trend direction
  if (sorted.length >= 2) {
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
    const metric = args.metric.toLowerCase();

    const avgFirst = firstHalf.reduce((s, d) => s + ((d as unknown as Record<string, number>)[metric] ?? 0), 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((s, d) => s + ((d as unknown as Record<string, number>)[metric] ?? 0), 0) / secondHalf.length;
    const changePercent = avgFirst > 0 ? Number((((avgSecond - avgFirst) / avgFirst) * 100).toFixed(1)) : 0;

    return {
      success: true,
      data: { metric: args.metric, timeRange: range, trend: sorted, changePercent, avgFirst: Number(avgFirst.toFixed(2)), avgSecond: Number(avgSecond.toFixed(2)) },
      summary: `Trend ${args.metric} portfolio (${range}): ${changePercent > 0 ? "+" : ""}${changePercent}% (${avgFirst.toFixed(2)} → ${avgSecond.toFixed(2)})`,
    };
  }

  return { success: true, data: { metric: args.metric, trend: sorted }, summary: "Không đủ dữ liệu để phân tích trend." };
}

// ────────────────────────────
// 5. get_top_n
// ────────────────────────────
export function getTopN(args: {
  metric: string;
  n?: number;
  filter?: { mechanic?: string; network?: string; status?: string };
}): ToolResult {
  const n = args.n ?? 5;
  const playables = args.filter
    ? filterPlayables({ mechanic: args.filter.mechanic, status: args.filter.status ?? "active", network: args.filter.network })
    : getAllPlayables().filter((p) => p.status === "active");

  const metricKey = args.metric.toLowerCase();
  const metricMap: Record<string, (p: typeof playables[0]) => number> = {
    ctr: (p) => p.avgCTR,
    cvr: (p) => p.avgCVR,
    ir: (p) => p.avgIR,
    impressions: (p) => p.totalImpressions,
    installs: (p) => p.totalInstalls,
    revenue: (p) => p.totalRevenue,
    roas: (p) => p.roas,
    spend: (p) => p.totalSpend,
  };

  const getter = metricMap[metricKey] ?? metricMap["ctr"];
  playables.sort((a, b) => getter(b) - getter(a));
  const top = playables.slice(0, n);

  const data = top.map((p, i) => ({
    rank: i + 1,
    name: p.name,
    code: p.code,
    mechanic: p.mechanic,
    value: getter(p),
    networks: p.networks,
    impressions: p.totalImpressions,
  }));

  return {
    success: true,
    data,
    summary: `Top ${n} playable theo ${args.metric}: ${data.map((d) => `#${d.rank} ${d.name} (${d.value})`).join(", ")}`,
  };
}

// ────────────────────────────
// 6. aggregate_by_dimension
// ────────────────────────────
export function aggregateByDimension(args: {
  dimension: string;
  metric: string;
  time_range?: string;
}): ToolResult {
  const all = getAllPlayables().filter((p) => p.status === "active");
  const dim = args.dimension.toLowerCase();
  const metric = args.metric.toLowerCase();

  const groups = new Map<string, typeof all>();

  all.forEach((p) => {
    let key: string;
    if (dim === "mechanic") key = p.mechanic;
    else if (dim === "network") {
      p.networks.forEach((n) => {
        const list = groups.get(n) ?? [];
        list.push(p);
        groups.set(n, list);
      });
      return;
    } else if (dim === "project") key = p.projectName;
    else if (dim === "creator" || dim === "createdby") key = p.createdBy;
    else key = p.mechanic;

    const list = groups.get(key) ?? [];
    list.push(p);
    groups.set(key, list);
  });

  const metricMap: Record<string, (ps: typeof all) => number> = {
    ctr: (ps) => {
      const ti = ps.reduce((s, p) => s + p.totalImpressions, 0);
      const tc = ps.reduce((s, p) => s + p.totalClicks, 0);
      return ti > 0 ? Number(((tc / ti) * 100).toFixed(2)) : 0;
    },
    cvr: (ps) => {
      const tc = ps.reduce((s, p) => s + p.totalClicks, 0);
      const ti2 = ps.reduce((s, p) => s + p.totalInstalls, 0);
      return tc > 0 ? Number(((ti2 / tc) * 100).toFixed(2)) : 0;
    },
    ir: (ps) => {
      const ti = ps.reduce((s, p) => s + p.totalImpressions, 0);
      const tins = ps.reduce((s, p) => s + p.totalInstalls, 0);
      return ti > 0 ? Number(((tins / ti) * 100).toFixed(3)) : 0;
    },
    impressions: (ps) => ps.reduce((s, p) => s + p.totalImpressions, 0),
    installs: (ps) => ps.reduce((s, p) => s + p.totalInstalls, 0),
    revenue: (ps) => Number(ps.reduce((s, p) => s + p.totalRevenue, 0).toFixed(2)),
    count: (ps) => ps.length,
  };

  const calc = metricMap[metric] ?? metricMap["ctr"];

  const data = Array.from(groups.entries())
    .map(([key, ps]) => ({
      dimension: key,
      metric: args.metric,
      value: calc(ps),
      count: ps.length,
    }))
    .sort((a, b) => b.value - a.value);

  return {
    success: true,
    data,
    summary: `${args.metric} theo ${args.dimension}: ${data.map((d) => `${d.dimension}: ${d.value}`).join(", ")}`,
  };
}

// ────────────────────────────
// 7. get_portfolio_overview
// ────────────────────────────
export function getPortfolioOverview(): ToolResult {
  const summary = getPortfolioSummary();
  return {
    success: true,
    data: summary,
    summary: `Portfolio: ${summary.totalActive} active, CTR trung bình ${summary.avgCTR}%, tổng revenue $${summary.totalRevenue.toLocaleString()}, ROAS ${summary.roas}`,
  };
}

// ── Tool registry for orchestrator ──

export const AGENT_TOOLS: Record<string, (args: Record<string, unknown>) => ToolResult> = {
  query_playable_metrics: (args) => queryPlayableMetrics(args as Parameters<typeof queryPlayableMetrics>[0]),
  list_playables: (args) => listPlayables(args as Parameters<typeof listPlayables>[0]),
  compare_playables: (args) => comparePlayables(args as Parameters<typeof comparePlayables>[0]),
  get_trend: (args) => getTrend(args as Parameters<typeof getTrend>[0]),
  get_top_n: (args) => getTopN(args as Parameters<typeof getTopN>[0]),
  aggregate_by_dimension: (args) => aggregateByDimension(args as Parameters<typeof aggregateByDimension>[0]),
  get_portfolio_overview: () => getPortfolioOverview(),
};
