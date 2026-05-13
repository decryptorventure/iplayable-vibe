// ──────────────────────────────────────────────
// iPlayable AI Agent — Mock Orchestrator
// Rule-based intent matching (no API key needed)
// ──────────────────────────────────────────────

import type { ToolResult } from "@/types/agent";
import { queryPlayableMetrics, listPlayables, comparePlayables, getTrend, getTopN, aggregateByDimension, getPortfolioOverview } from "@/lib/ai/agent-tools";
import { getAllPlayables, getPortfolioSummary } from "@/lib/agent-data";

interface AgentResponse {
  content: string;
  citations: { label: string; href: string }[];
  followUps: string[];
}

// ── Intent patterns ──

interface IntentPattern {
  keywords: string[];
  handler: (query: string) => AgentResponse;
}

function findPlayableName(query: string): string | null {
  const all = getAllPlayables();
  const lower = query.toLowerCase();
  for (const p of all) {
    if (lower.includes(p.name.toLowerCase()) || lower.includes(p.code.toLowerCase())) {
      return p.name;
    }
  }
  return null;
}

function findMechanic(query: string): string | null {
  const mechanics = ["Puzzle", "Match-3", "Word", "Runner", "Shooter", "Merge", "Decoration", "Action", "Sorting"];
  const lower = query.toLowerCase();
  for (const m of mechanics) {
    if (lower.includes(m.toLowerCase())) return m;
  }
  if (lower.includes("match 3") || lower.includes("match3")) return "Match-3";
  if (lower.includes("word")) return "Word";
  return null;
}

function findNetwork(query: string): string | null {
  const networks = ["AppLovin", "Unity", "Mintegral", "Facebook"];
  const lower = query.toLowerCase();
  for (const n of networks) {
    if (lower.includes(n.toLowerCase())) return n;
  }
  if (lower.includes("unity ads")) return "Unity";
  return null;
}

function findTimeRange(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes("24h") || lower.includes("hôm nay") || lower.includes("today")) return "24h";
  if (lower.includes("7 ngày") || lower.includes("tuần") || lower.includes("7d") || lower.includes("week")) return "7d";
  if (lower.includes("90") || lower.includes("quý") || lower.includes("quarter")) return "90d";
  return "30d";
}

function findN(query: string): number {
  const match = query.match(/top\s*(\d+)/i);
  if (match) return parseInt(match[1], 10);
  return 5;
}

// ── Response builders ──

function buildMetricsResponse(result: ToolResult): AgentResponse {
  if (!result.success) {
    return { content: `⚠️ ${result.summary}`, citations: [], followUps: ["Bạn có thể cho tôi tên hoặc mã playable chính xác?", "Xem danh sách tất cả playable active?"] };
  }
  const d = result.data as Record<string, unknown>;
  const name = d.name as string;
  const range = d.timeRange as string;

  let content = `📊 **Metrics của ${name}** (${range})\n\n`;
  content += `| Metric | Giá trị |\n|---|---|\n`;
  content += `| CTR | **${d.avgCTR}%** |\n`;
  content += `| CVR | **${d.avgCVR}%** |\n`;
  content += `| Impressions | ${(d.totalImpressions as number).toLocaleString()} |\n`;
  content += `| Clicks | ${(d.totalClicks as number).toLocaleString()} |\n`;
  content += `| Installs | ${(d.totalInstalls as number).toLocaleString()} |\n`;
  content += `| Revenue | $${d.totalRevenue} |\n`;
  content += `| Spend | $${d.totalSpend} |\n`;
  content += `| ROAS | ${d.roas}x |\n`;

  const nets = d.networkBreakdown as { network: string; ctr: number; impressions: number }[];
  if (nets && nets.length > 0) {
    content += `\n**Breakdown theo network:**\n`;
    content += `| Network | CTR | Impressions |\n|---|---|---|\n`;
    nets.forEach((n) => {
      content += `| ${n.network} | ${n.ctr}% | ${n.impressions.toLocaleString()} |\n`;
    });
  }

  content += `\n> Mechanic: ${d.mechanic} · ${d.variantCount} variants · File: ${d.fileSize}KB`;

  return {
    content,
    citations: [{ label: name, href: `/playable-ads/${(d as Record<string, string>).code?.toLowerCase() ?? ""}` }],
    followUps: [`So sánh ${name} với playable khác?`, `Trend CTR của ${name} trong 30 ngày?`, `Top 5 playable có CTR cao nhất?`],
  };
}

function buildTopResponse(result: ToolResult, metric: string): AgentResponse {
  const items = result.data as { rank: number; name: string; value: number; mechanic: string; networks: string[] }[];
  let content = `🔥 **Top ${items.length} playable theo ${metric}:**\n\n`;
  content += `| # | Tên | ${metric.toUpperCase()} | Mechanic | Networks |\n|---|---|---|---|---|\n`;
  items.forEach((item) => {
    const val = metric.toLowerCase() === "impressions" ? item.value.toLocaleString() : metric.toLowerCase() === "revenue" ? `$${item.value}` : `${item.value}%`;
    content += `| ${item.rank} | **${item.name}** | ${val} | ${item.mechanic} | ${item.networks.join(", ") || "—"} |\n`;
  });

  return {
    content,
    citations: items.map((i) => ({ label: i.name, href: "/playable-ads" })),
    followUps: [`Phân tích chi tiết ${items[0]?.name}?`, `So sánh top 3 với nhau?`, `Xem trend ${metric} portfolio?`],
  };
}

function buildCompareResponse(result: ToolResult): AgentResponse {
  if (!result.success) return { content: `⚠️ ${result.summary}`, citations: [], followUps: [] };
  const items = result.data as { name: string; mechanic: string; avgCTR: number; totalImpressions: number; totalInstalls: number; totalRevenue: number; roas: number }[];
  let content = `📊 **So sánh ${items.length} playable:**\n\n`;
  content += `| Playable | CTR | Impressions | Installs | Revenue | ROAS |\n|---|---|---|---|---|---|\n`;
  items.forEach((d) => {
    content += `| **${d.name}** | ${d.avgCTR}% | ${d.totalImpressions.toLocaleString()} | ${d.totalInstalls.toLocaleString()} | $${d.totalRevenue} | ${d.roas}x |\n`;
  });

  const best = items.reduce((a, b) => (a.avgCTR > b.avgCTR ? a : b));
  content += `\n💡 **Nhận xét:** ${best.name} đang dẫn đầu về CTR (${best.avgCTR}%).`;

  return { content, citations: items.map((i) => ({ label: i.name, href: "/playable-ads" })), followUps: [`Phân tích chi tiết ${best.name}?`, `Xem trend 30 ngày?`] };
}

function buildTrendResponse(result: ToolResult): AgentResponse {
  const d = result.data as { metric: string; changePercent: number; avgFirst: number; avgSecond: number; timeRange: string };
  const direction = d.changePercent > 0 ? "📈 tăng" : d.changePercent < 0 ? "📉 giảm" : "➡️ ổn định";
  let content = `📊 **Trend ${d.metric} portfolio (${d.timeRange}):**\n\n`;
  content += `- Nửa đầu: **${d.avgFirst}**\n`;
  content += `- Nửa sau: **${d.avgSecond}**\n`;
  content += `- Thay đổi: **${d.changePercent > 0 ? "+" : ""}${d.changePercent}%** ${direction}\n`;

  if (d.changePercent < -10) {
    content += `\n⚠️ **Cảnh báo:** ${d.metric} đang giảm đáng kể. Nên review các playable underperform.`;
  } else if (d.changePercent > 10) {
    content += `\n🎉 ${d.metric} đang cải thiện tốt!`;
  }

  return { content, citations: [{ label: "Analytics", href: "/analytics" }], followUps: [`Playable nào có ${d.metric} giảm mạnh nhất?`, "Top 5 playable hiệu quả nhất?", "So sánh performance theo mechanic?"] };
}

function buildAggregateResponse(result: ToolResult, dimension: string, metric: string): AgentResponse {
  const items = result.data as { dimension: string; value: number; count: number }[];
  let content = `📊 **${metric.toUpperCase()} theo ${dimension}:**\n\n`;
  content += `| ${dimension} | ${metric.toUpperCase()} | Số lượng |\n|---|---|---|\n`;
  items.forEach((d) => {
    const val = metric.toLowerCase() === "impressions" || metric.toLowerCase() === "installs" ? d.value.toLocaleString() : metric.toLowerCase() === "revenue" ? `$${d.value}` : `${d.value}%`;
    content += `| **${d.dimension}** | ${val} | ${d.count} playable |\n`;
  });
  const best = items[0];
  if (best) content += `\n💡 **Insight:** ${best.dimension} đang dẫn đầu về ${metric} với ${typeof best.value === "number" && best.value > 100 ? best.value.toLocaleString() : best.value}.`;

  return { content, citations: [{ label: "Dashboard", href: "/dashboard" }], followUps: [`Top 5 playable mechanic ${items[0]?.dimension}?`, `Trend ${metric} 30 ngày?`] };
}

function buildOverviewResponse(result: ToolResult): AgentResponse {
  const d = result.data as ReturnType<typeof getPortfolioSummary>;
  let content = `📊 **Tổng quan Portfolio:**\n\n`;
  content += `| Metric | Giá trị |\n|---|---|\n`;
  content += `| Active | **${d.totalActive}** playable |\n`;
  content += `| Draft | ${d.totalDraft} |\n`;
  content += `| Inactive | ${d.totalInactive} |\n`;
  content += `| CTR trung bình | **${d.avgCTR}%** |\n`;
  content += `| CVR trung bình | **${d.avgCVR}%** |\n`;
  content += `| Tổng Impressions | ${d.totalImpressions.toLocaleString()} |\n`;
  content += `| Tổng Revenue | **$${d.totalRevenue.toLocaleString()}** |\n`;
  content += `| ROAS | **${d.roas}x** |\n`;
  content += `\n**Mechanics:**\n`;
  d.mechanics.forEach((m) => { content += `- ${m.name}: ${m.count} playable\n`; });

  return { content, citations: [{ label: "Dashboard", href: "/dashboard" }], followUps: ["Top 5 playable CTR cao nhất?", "Trend CTR 30 ngày?", "So sánh performance theo network?"] };
}

function buildSuggestionResponse(playableName: string): AgentResponse {
  const result = queryPlayableMetrics({ playable_name: playableName, time_range: "30d" });
  if (!result.success) return { content: `⚠️ ${result.summary}`, citations: [], followUps: [] };

  const d = result.data as Record<string, unknown>;
  const avgCTR = d.avgCTR as number;
  const imageCount = d.imageCount as number;
  const fileSize = d.fileSize as number;
  const name = d.name as string;

  let content = `💡 **3 đề xuất cải thiện cho ${name}:**\n\n`;
  const suggestions: string[] = [];

  if (avgCTR < 4.0) {
    suggestions.push(`1. **Tối ưu CTA** — CTR hiện tại ${avgCTR}% thấp hơn portfolio avg. Thử thay đổi CTA color sang orange/red gradient và di chuyển vị trí CTA lên top. Dựa trên data, các playable có CTA orange đang có CTR cao hơn ~15%.`);
  } else {
    suggestions.push(`1. **Mở rộng networks** — CTR ${avgCTR}% rất tốt, nên deploy thêm sang các network khác để tăng reach. Hiện chỉ chạy trên ${(d.networks as string[]).length} network.`);
  }

  if (imageCount > 18) {
    suggestions.push(`2. **Giảm visual overload** — ${imageCount} images có thể gây overload. Các playable có 10-15 images đang có CTR trung bình cao hơn. Thử remove 3-5 decorative images.`);
  } else {
    suggestions.push(`2. **Thêm visual variety** — Chỉ ${imageCount} images, có thể tăng lên 15-18 để enricher experience. Đặc biệt thêm animated backgrounds.`);
  }

  if (fileSize > 4500) {
    suggestions.push(`3. **Optimize file size** — ${fileSize}KB khá nặng. Target dưới 4MB để cải thiện load time trên slow connections. Compress images và remove unused assets.`);
  } else {
    suggestions.push(`3. **A/B test mechanic** — Thử tạo variant với mechanic khác (ví dụ: nếu đang Puzzle thì test Match-3). Data cho thấy diversify mechanic có thể boost CVR 10-20%.`);
  }

  content += suggestions.join("\n\n");

  return { content, citations: [{ label: name, href: "/playable-ads" }, { label: "Analytics", href: "/analytics" }], followUps: [`Chi tiết metrics ${name}?`, "Top 5 playable cần pause?", "So sánh mechanic hiệu quả nhất?"] };
}

function buildUnderperformResponse(): AgentResponse {
  const all = getAllPlayables().filter((p) => p.status === "active");
  const sorted = [...all].sort((a, b) => a.avgCTR - b.avgCTR);
  const bottom5 = sorted.slice(0, 5);

  let content = `⚠️ **5 Playable nên cân nhắc pause (underperform):**\n\n`;
  content += `| # | Playable | CTR | CVR | ROAS | Lý do |\n|---|---|---|---|---|---|\n`;
  bottom5.forEach((p, i) => {
    const reason = p.avgCTR < 3.0 ? "CTR thấp" : p.roas < 1.0 ? "ROAS < 1" : "Below average";
    content += `| ${i + 1} | **${p.name}** | ${p.avgCTR}% | ${p.avgCVR}% | ${p.roas}x | ${reason} |\n`;
  });
  content += `\n💡 **Đề xuất:** Pause các playable có ROAS < 1.0 trước, chuyển budget sang top performers.`;

  return { content, citations: [{ label: "Analytics", href: "/analytics" }], followUps: ["Top 5 playable hiệu quả nhất?", "Trend CTR 30 ngày?"] };
}

function buildMechanicRecommendation(): AgentResponse {
  const result = aggregateByDimension({ dimension: "mechanic", metric: "ctr" });
  const data = result.data as { dimension: string; value: number; count: number }[];
  const irResult = aggregateByDimension({ dimension: "mechanic", metric: "ir" });
  const irData = irResult.data as { dimension: string; value: number }[];

  let content = `💡 **Đề xuất mechanic đáng đầu tư H2:**\n\n`;
  content += `| Mechanic | CTR | IR | Playable count |\n|---|---|---|---|\n`;
  data.forEach((d) => {
    const ir = irData.find((i) => i.dimension === d.dimension)?.value ?? 0;
    content += `| **${d.dimension}** | ${d.value}% | ${ir}% | ${d.count} |\n`;
  });
  const top = data[0];
  if (top) {
    content += `\n🎯 **Khuyến nghị:** Tập trung invest vào **${top.dimension}** (CTR ${top.value}%) — đang cho hiệu quả cao nhất. Đồng thời duy trì ${data[1]?.dimension ?? "Puzzle"} vì đã có track record tốt.`;
  }

  return { content, citations: [{ label: "Dashboard", href: "/dashboard" }], followUps: [`Top playable mechanic ${top?.dimension}?`, "So sánh theo network?"] };
}

// ── Main orchestrator ──

const INTENT_PATTERNS: IntentPattern[] = [
  // Overview / Summary
  { keywords: ["tổng kết", "overview", "tổng quan", "bao nhiêu playable", "portfolio"], handler: () => buildOverviewResponse(getPortfolioOverview()) },
  // Suggestions
  { keywords: ["suggest", "đề xuất", "cải thiện", "improve", "gợi ý"], handler: (q) => {
    const name = findPlayableName(q);
    if (name) return buildSuggestionResponse(name);
    return buildMechanicRecommendation();
  }},
  // Underperform / pause
  { keywords: ["pause", "underperform", "kém", "nên dừng", "nên pause"], handler: () => buildUnderperformResponse() },
  // Mechanic recommendation
  { keywords: ["invest", "đầu tư", "mechanic nào", "nên invest"], handler: () => buildMechanicRecommendation() },
  // Compare
  { keywords: ["so sánh", "compare", "vs"], handler: (q) => {
    const all = getAllPlayables();
    const found: string[] = [];
    const lower = q.toLowerCase();
    all.forEach((p) => { if (lower.includes(p.name.toLowerCase()) || lower.includes(p.code.toLowerCase())) found.push(p.name); });
    const mechanic1 = findMechanic(q);
    if (found.length >= 2) return buildCompareResponse(comparePlayables({ names: found }));
    if (mechanic1) {
      // Find another mechanic
      const allMechanics = [...new Set(all.map(p => p.mechanic))];
      const others = allMechanics.filter(m => m.toLowerCase() !== mechanic1.toLowerCase());
      if (others.length > 0) return buildAggregateResponse(aggregateByDimension({ dimension: "mechanic", metric: "ctr" }), "mechanic", "CTR");
    }
    return buildAggregateResponse(aggregateByDimension({ dimension: "mechanic", metric: "ctr" }), "mechanic", "CTR");
  }},
  // Trend
  { keywords: ["trend", "xu hướng", "biến động", "giảm mạnh"], handler: (q) => {
    const metric = q.toLowerCase().includes("cvr") ? "cvr" : q.toLowerCase().includes("impression") ? "impressions" : q.toLowerCase().includes("revenue") ? "revenue" : "ctr";
    const range = findTimeRange(q);
    return buildTrendResponse(getTrend({ metric, time_range: range }));
  }},
  // Top N
  { keywords: ["top", "cao nhất", "best", "highest", "tốt nhất", "nhiều nhất"], handler: (q) => {
    const n = findN(q);
    const lower = q.toLowerCase();
    let metric = "ctr";
    if (lower.includes("impression")) metric = "impressions";
    else if (lower.includes("roas")) metric = "roas";
    else if (lower.includes("cvr")) metric = "cvr";
    else if (lower.includes("install")) metric = "installs";
    else if (lower.includes("revenue") || lower.includes("doanh thu")) metric = "revenue";
    else if (lower.includes("ir")) metric = "ir";
    const network = findNetwork(q);
    const mechanic = findMechanic(q);
    return buildTopResponse(getTopN({ metric, n, filter: { network: network ?? undefined, mechanic: mechanic ?? undefined } }), metric);
  }},
  // Aggregate by dimension
  { keywords: ["theo mechanic", "theo network", "theo project", "phân bố", "distribution", "group"], handler: (q) => {
    const dim = q.toLowerCase().includes("network") ? "network" : q.toLowerCase().includes("project") ? "project" : "mechanic";
    const metric = q.toLowerCase().includes("cvr") ? "cvr" : q.toLowerCase().includes("impression") ? "impressions" : q.toLowerCase().includes("ir") ? "ir" : "ctr";
    return buildAggregateResponse(aggregateByDimension({ dimension: dim, metric }), dim, metric);
  }},
  // List by mechanic/network/status
  { keywords: ["list", "danh sách", "thuộc", "liệt kê", "có bao nhiêu"], handler: (q) => {
    const mechanic = findMechanic(q);
    const network = findNetwork(q);
    const status = q.toLowerCase().includes("active") ? "active" : q.toLowerCase().includes("inactive") ? "inactive" : q.toLowerCase().includes("draft") ? "draft" : undefined;
    if (q.toLowerCase().includes("bao nhiêu") && q.toLowerCase().includes("active")) {
      const result = listPlayables({ status: "active" });
      const items = result.data as { name: string }[];
      return { content: `📊 Hiện có **${items.length} playable active** đang chạy.`, citations: [{ label: "Playable Ads", href: "/playable-ads" }], followUps: ["Xem danh sách chi tiết?", "Top 5 playable hiệu quả nhất?"] };
    }
    const result = listPlayables({ mechanic: mechanic ?? undefined, network: network ?? undefined, status });
    const items = result.data as { name: string; avgCTR: number; mechanic: string; networks: string[] }[];
    let content = `📋 **${result.summary}**\n\n`;
    content += `| Playable | CTR | Mechanic | Networks |\n|---|---|---|---|\n`;
    items.forEach((p) => { content += `| ${p.name} | ${p.avgCTR}% | ${p.mechanic} | ${p.networks.join(", ") || "—"} |\n`; });
    return { content, citations: [{ label: "Playable Ads", href: "/playable-ads" }], followUps: [`Top playable trong danh sách?`, "So sánh 2 playable?"] };
  }},
  // Single playable query (fallback for specific names)
  { keywords: ["ctr", "cvr", "metrics", "performance", "hiệu quả", "khi nào", "được tạo", "network", "đang chạy"], handler: (q) => {
    const name = findPlayableName(q);
    if (name) return buildMetricsResponse(queryPlayableMetrics({ playable_name: name, time_range: findTimeRange(q) }));
    // Correlation question
    if (q.toLowerCase().includes("correlation") || q.toLowerCase().includes("tương quan") || q.toLowerCase().includes("image") && q.toLowerCase().includes("ctr")) {
      const all = getAllPlayables().filter(p => p.status === "active");
      const sorted = [...all].sort((a, b) => b.avgCTR - a.avgCTR);
      let content = `📊 **Phân tích tương quan Image Count vs CTR:**\n\n`;
      content += `| Playable | Images | CTR |\n|---|---|---|\n`;
      sorted.slice(0, 10).forEach((p) => { content += `| ${p.name} | ${p.imageCount} | ${p.avgCTR}% |\n`; });
      const highCTR = sorted.slice(0, 5);
      const avgImages = Math.round(highCTR.reduce((s, p) => s + p.imageCount, 0) / highCTR.length);
      content += `\n💡 **Insight:** Top 5 playable CTR cao nhất có trung bình **${avgImages} images**. Nhiều image không đồng nghĩa CTR cao — sweet spot là 10-16 images.`;
      return { content, citations: [{ label: "Analytics", href: "/analytics" }], followUps: ["Top playable ít image nhưng CTR cao?", "Suggest cải thiện playable có nhiều image?"] };
    }
    return buildOverviewResponse(getPortfolioOverview());
  }},
];

export function processAgentQuery(query: string): AgentResponse {
  const lower = query.toLowerCase();

  // Match intent
  for (const pattern of INTENT_PATTERNS) {
    if (pattern.keywords.some((kw) => lower.includes(kw))) {
      return pattern.handler(query);
    }
  }

  // Fallback: check if query mentions a playable name
  const name = findPlayableName(query);
  if (name) {
    return buildMetricsResponse(queryPlayableMetrics({ playable_name: name, time_range: findTimeRange(query) }));
  }

  // Default fallback
  return {
    content: `Xin chào! Tôi là **iPlayable AI Assistant** 🤖\n\nTôi có thể giúp bạn:\n- 📊 Tra cứu metrics playable ads\n- 📈 Phân tích trends và so sánh\n- 💡 Đề xuất cải thiện performance\n\nHãy thử hỏi tôi một câu từ danh sách gợi ý bên dưới!`,
    citations: [],
    followUps: [
      "Top 5 playable CTR cao nhất?",
      "Có bao nhiêu playable active?",
      "Trend CTR portfolio 30 ngày?",
      "So sánh mechanic Match-3 vs Puzzle",
    ],
  };
}
