"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Download,
  DollarSign,
  BarChart3,
  Target,
  Calendar,
  X,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
  Beaker,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";

const kpis = [
  { label: "Impressions", value: "2.4M", trend: 12.5, icon: Eye, color: "text-primary" },
  { label: "Avg CTR", value: "4.12%", trend: 3.2, icon: MousePointer, color: "text-success" },
  { label: "Total Installs", value: "98.2K", trend: -1.8, icon: Download, color: "text-info" },
  { label: "Avg CVR", value: "1.67%", trend: 5.4, icon: Target, color: "text-purple-400" },
  { label: "Revenue", value: "$182.4K", trend: 18.3, icon: DollarSign, color: "text-warning" },
  { label: "eCPM", value: "$12.80", trend: 7.1, icon: BarChart3, color: "text-pink-400" },
];

const topCreatives = [
  { name: "Pub Thief Hunter", ctr: 5.3, cvr: 2.1, installs: 12400, status: "🔥" },
  { name: "iG Sticker Out", ctr: 5.1, cvr: 2.0, installs: 11200, status: "🔥" },
  { name: "iG Color Yarn 3D", ctr: 5.0, cvr: 2.0, installs: 9800, status: "⬆️" },
  { name: "Pixel Blast", ctr: 4.8, cvr: 1.9, installs: 8900, status: "⬆️" },
  { name: "iG Coffee Rush", ctr: 4.6, cvr: 1.8, installs: 7600, status: "➡️" },
  { name: "Pub Dream Room", ctr: 4.5, cvr: 1.7, installs: 6800, status: "➡️" },
  { name: "iG ColorMood", ctr: 4.3, cvr: 1.7, installs: 5900, status: "➡️" },
  { name: "B2 Wool Loop", ctr: 4.2, cvr: 1.8, installs: 5200, status: "⬇️" },
];

const networkPerf = [
  { name: "AppLovin", impressions: "1.2M", ctr: 4.5, revenue: "$82K", fill: "96%" },
  { name: "Unity Ads", impressions: "680K", ctr: 3.8, revenue: "$52K", fill: "92%" },
  { name: "Mintegral", impressions: "520K", ctr: 4.1, revenue: "$48K", fill: "88%" },
];

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 80 * dpr;
    canvas.height = 28 * dpr;
    ctx.scale(dpr, dpr);

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 80;
    const h = 28;
    const step = w / (data.length - 1);

    ctx.beginPath();
    data.forEach((val, i) => {
      const x = step * i;
      const y = h - ((val - min) / range) * (h - 4) - 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [data, color]);

  return <canvas ref={canvasRef} style={{ width: 80, height: 28 }} />;
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar title="Analytics" subtitle="Workspace / Analytics" />

      <div className="flex-1 space-y-6 overflow-auto p-6">
        {/* Date range selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-200">Performance Overview</h2>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-zinc-500" />
            {["24h", "7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  dateRange === range
                    ? "bg-primary text-white"
                    : "bg-surface-3 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-xl border border-zinc-800/60 bg-surface-2 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                <MiniSparkline
                  data={[3, 5, 4, 7, 6, 8, 7, 9, 8, 10]}
                  color={kpi.trend >= 0 ? "#22C55E" : "#EF4444"}
                />
              </div>
              <p className="text-lg font-bold text-zinc-100">{kpi.value}</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-[11px] text-zinc-500">{kpi.label}</p>
                <span
                  className={`flex items-center gap-0.5 text-[11px] font-medium ${
                    kpi.trend >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {kpi.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(kpi.trend)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Creatives */}
          <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
            <h3 className="mb-4 text-sm font-semibold text-zinc-200">🏆 Top Performing Creatives</h3>
            <div className="space-y-2">
              {topCreatives.map((creative, i) => (
                <div
                  key={creative.name}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800/40 bg-surface-1 px-3 py-2.5"
                >
                  <span className="w-6 text-center text-sm font-bold text-zinc-500">
                    {i + 1}
                  </span>
                  <span className="text-sm">{creative.status}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-200">
                      {creative.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-center">
                      <p className="font-semibold text-primary">{creative.ctr}%</p>
                      <p className="text-[10px] text-zinc-500">CTR</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-success">{creative.cvr}%</p>
                      <p className="text-[10px] text-zinc-500">CVR</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-zinc-200">
                        {(creative.installs / 1000).toFixed(1)}K
                      </p>
                      <p className="text-[10px] text-zinc-500">Installs</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Performance */}
          <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
            <h3 className="mb-4 text-sm font-semibold text-zinc-200">🌐 Network Performance</h3>
            <div className="space-y-3">
              {networkPerf.map((network) => (
                <div
                  key={network.name}
                  className="rounded-lg border border-zinc-800/40 bg-surface-1 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-zinc-200">
                      {network.name}
                    </h4>
                    <span className="rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                      Connected
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-zinc-500">Impressions</p>
                      <p className="mt-0.5 font-semibold text-zinc-200">{network.impressions}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">CTR</p>
                      <p className="mt-0.5 font-semibold text-zinc-200">{network.ctr}%</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Revenue</p>
                      <p className="mt-0.5 font-semibold text-zinc-200">{network.revenue}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Fill Rate</p>
                      <p className="mt-0.5 font-semibold text-zinc-200">{network.fill}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insight */}
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs font-medium text-primary">💡 AI Insight</p>
              <p className="mt-1 text-[11px] text-zinc-400">
                AppLovin đang cho hiệu suất CTR cao nhất (+4.5%). Đề xuất tăng budget allocation 15% cho network này với các creative dạng Puzzle.
              </p>
            </div>
          </div>
        </div>

        {/* A/B Test Section */}
        <ABTestSection />
      </div>
    </div>
  );
}

/* ── A/B Test Section with wizard modal ───────────────────────── */

const abVariantPool = [
  { id: "v1", name: "260402 B2WL PAIH WoolLoop - Orange CTA", project: "B2 Wool Loop" },
  { id: "v2", name: "260402 B2WL PAIH WoolLoop - Green CTA", project: "B2 Wool Loop" },
  { id: "v3", name: "B2WL PAIH WoolLoop lv22 - Easy", project: "B2 Wool Loop" },
  { id: "v4", name: "iG Water Factory v3 - Neon", project: "iG Water Factory" },
  { id: "v5", name: "iG Water Factory v3 - Calm", project: "iG Water Factory" },
  { id: "v6", name: "Pub Thief Hunter - Red CTA", project: "Pub Thief Hunter" },
  { id: "v7", name: "Pub Thief Hunter - Orange CTA", project: "Pub Thief Hunter" },
  { id: "v8", name: "iG Color Yarn 3D - Match3 Easy", project: "iG Color Yarn 3D" },
];

const existingTests = [
  { name: "CTA Color Test", variant: "Orange vs Green", days: 5, confidence: 87, winner: "Orange", network: "AppLovin" },
  { name: "Difficulty Level", variant: "Hard vs Medium", days: 3, confidence: 62, winner: null, network: "Unity" },
  { name: "Tutorial Length", variant: "3 steps vs 5 steps", days: 7, confidence: 94, winner: "3 steps", network: "AppLovin" },
];

function ABTestSection() {
  const [showWizard, setShowWizard] = useState(false);
  const [wizStep, setWizStep] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [splitType, setSplitType] = useState("50/50");
  const [network, setNetwork] = useState("applovin");
  const [duration, setDuration] = useState(7);
  const [targetKPI, setTargetKPI] = useState("ctr");
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  const toggleVariant = (id: string) => {
    setSelectedVariants((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const launchTest = () => {
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      setLaunched(true);
    }, 2000);
  };

  const resetWizard = () => {
    setShowWizard(false);
    setWizStep(1);
    setSelectedVariants([]);
    setLaunching(false);
    setLaunched(false);
  };

  return (
    <>
      <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200">🧪 Active A/B Tests</h3>
          <button onClick={() => setShowWizard(true)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-dark">
            + New Test
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {existingTests.map((test) => (
            <div key={test.name} className="rounded-lg border border-zinc-800/40 bg-surface-1 p-4 transition hover:border-zinc-700/60">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-zinc-200">{test.name}</h4>
                <span className="text-[10px] text-zinc-500">{test.network}</span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">{test.variant}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">Day {test.days}/14</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  test.confidence >= 90 ? "bg-success/10 text-success" : test.confidence >= 70 ? "bg-warning/10 text-warning" : "bg-zinc-800 text-zinc-400"
                }`}>
                  {test.confidence}% confidence
                </span>
              </div>
              {test.winner && (
                <div className="mt-2 flex items-center justify-between rounded-md bg-success/10 px-2 py-1">
                  <span className="text-xs font-medium text-success">🏆 Winner: {test.winner}</span>
                  <Link href="/studio/pa-1" className="text-[10px] text-success underline hover:no-underline">Scale →</Link>
                </div>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(test.days / 14) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* A/B Test Wizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={resetWizard}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-zinc-800/60 bg-surface-1 shadow-2xl">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800/40 px-6 py-4">
                <div>
                  <h3 className="text-base font-semibold text-zinc-100">🧪 New A/B Test</h3>
                  <p className="text-xs text-zinc-500">Step {wizStep} of 3</p>
                </div>
                <button onClick={resetWizard} className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Steps indicator */}
              <div className="flex items-center gap-2 px-6 pt-4">
                {["Select Variants", "Configure", "Launch"].map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                      wizStep > i + 1 ? "bg-success text-white" : wizStep === i + 1 ? "bg-primary text-white" : "bg-zinc-800 text-zinc-500"
                    }`}>
                      {wizStep > i + 1 ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <span className={`text-xs ${wizStep === i + 1 ? "text-zinc-200" : "text-zinc-500"}`}>{label}</span>
                    {i < 2 && <div className={`h-px w-6 ${wizStep > i + 1 ? "bg-success" : "bg-zinc-800"}`} />}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                {/* Step 1: Select Variants */}
                {wizStep === 1 && (
                  <div>
                    <p className="mb-3 text-xs text-zinc-400">Chọn 2-4 variants để A/B test (đã chọn {selectedVariants.length})</p>
                    <div className="max-h-56 space-y-1.5 overflow-auto">
                      {abVariantPool.map((v) => {
                        const sel = selectedVariants.includes(v.id);
                        return (
                          <button key={v.id} onClick={() => toggleVariant(v.id)}
                            className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                              sel ? "border-primary/40 bg-primary/10" : "border-zinc-800/40 bg-surface-2 hover:border-zinc-700"
                            }`}>
                            <div className={`flex h-5 w-5 items-center justify-center rounded border ${
                              sel ? "border-primary bg-primary" : "border-zinc-600"
                            }`}>
                              {sel && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-xs font-medium text-zinc-200">{v.name}</p>
                              <p className="text-[10px] text-zinc-500">{v.project}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Configure */}
                {wizStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Traffic Split</label>
                      <div className="flex gap-2">
                        {["50/50", "70/30", "33/33/33", "Custom"].map((s) => (
                          <button key={s} onClick={() => setSplitType(s)}
                            className={`flex-1 rounded-lg border py-2 text-xs font-medium transition ${
                              splitType === s ? "border-primary bg-primary/10 text-primary" : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
                            }`}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">Ad Network</label>
                        <select value={network} onChange={(e) => setNetwork(e.target.value)}
                          className="h-9 w-full rounded-lg border border-zinc-700 bg-surface-2 px-3 text-sm text-zinc-200 focus:outline-none">
                          <option value="applovin">AppLovin MAX</option>
                          <option value="unity">Unity Ads</option>
                          <option value="mintegral">Mintegral</option>
                          <option value="all">All Networks</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">Duration</label>
                        <select value={duration} onChange={(e) => setDuration(+e.target.value)}
                          className="h-9 w-full rounded-lg border border-zinc-700 bg-surface-2 px-3 text-sm text-zinc-200 focus:outline-none">
                          <option value={3}>3 days</option>
                          <option value={7}>7 days</option>
                          <option value={14}>14 days</option>
                          <option value={30}>30 days</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Target KPI</label>
                      <div className="flex gap-2">
                        {[{ v: "ctr", l: "CTR" }, { v: "cvr", l: "CVR" }, { v: "installs", l: "Installs" }, { v: "roas", l: "ROAS" }].map((k) => (
                          <button key={k.v} onClick={() => setTargetKPI(k.v)}
                            className={`flex-1 rounded-lg border py-2 text-xs font-medium transition ${
                              targetKPI === k.v ? "border-primary bg-primary/10 text-primary" : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
                            }`}>{k.l}</button>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <p className="flex items-center gap-1.5 text-xs text-primary"><Sparkles className="h-3.5 w-3.5" /> AI Auto-Stop</p>
                      <p className="mt-1 text-[11px] text-zinc-400">AI sẽ tự dừng test khi đạt 95% statistical significance và thông báo winner.</p>
                    </div>
                  </div>
                )}

                {/* Step 3: Launch */}
                {wizStep === 3 && !launched && (
                  <div className="py-4 text-center">
                    <Beaker className="mx-auto mb-3 h-10 w-10 text-primary" />
                    <h4 className="mb-1 text-sm font-semibold text-zinc-100">Ready to Launch</h4>
                    <p className="mb-4 text-xs text-zinc-400">
                      {selectedVariants.length} variants · {splitType} split · {duration} days · {targetKPI.toUpperCase()}
                    </p>
                    <div className="mx-auto max-w-xs space-y-1.5 text-left">
                      {selectedVariants.map((id) => {
                        const v = abVariantPool.find((x) => x.id === id);
                        return v ? (
                          <div key={id} className="flex items-center gap-2 rounded-lg border border-zinc-800/40 bg-surface-2 px-3 py-2 text-xs text-zinc-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            <span className="truncate">{v.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Launched success */}
                {launched && (
                  <div className="py-6 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                      <CheckCircle2 className="h-8 w-8 text-success" />
                    </motion.div>
                    <h4 className="mb-1 text-base font-bold text-zinc-100">Test Launched! 🎉</h4>
                    <p className="text-xs text-zinc-400">A/B test đã bắt đầu. Bạn sẽ nhận thông báo khi có kết quả.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between border-t border-zinc-800/40 px-6 py-4">
                {!launched ? (
                  <>
                    <button onClick={wizStep === 1 ? resetWizard : () => setWizStep(wizStep - 1)}
                      className="rounded-lg border border-zinc-800 px-4 py-2 text-xs text-zinc-400 transition hover:text-zinc-200">
                      {wizStep === 1 ? "Cancel" : "← Back"}
                    </button>
                    {wizStep < 3 ? (
                      <button onClick={() => setWizStep(wizStep + 1)} disabled={wizStep === 1 && selectedVariants.length < 2}
                        className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition hover:bg-primary-dark disabled:opacity-40">
                        Continue <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button onClick={launchTest} disabled={launching}
                        className="flex items-center gap-1.5 rounded-lg bg-success px-5 py-2 text-xs font-bold text-white transition hover:bg-success/80 disabled:opacity-60">
                        {launching ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Launching...</> : <>🚀 Launch Test</>}
                      </button>
                    )}
                  </>
                ) : (
                  <button onClick={resetWizard} className="ml-auto rounded-lg bg-primary px-5 py-2 text-xs font-medium text-white">
                    Done
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
