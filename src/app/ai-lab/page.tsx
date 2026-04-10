"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Database,
  FlaskConical,
  LineChart,
  Lightbulb,
  TrendingUp,
  Cpu,
  BarChart3,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";

const models = [
  {
    id: "predictor-v3",
    name: "CTR Predictor",
    version: "v3.2",
    type: "predictor",
    accuracy: 87.4,
    status: "deployed",
    lastTrained: "2 ngày trước",
    samples: 14200,
    description: "Dự đoán CTR cho variant configurations dựa trên historical data",
  },
  {
    id: "generator-v2",
    name: "Config Generator",
    version: "v2.1",
    type: "generator",
    accuracy: 82.1,
    status: "deployed",
    lastTrained: "5 ngày trước",
    samples: 8900,
    description: "Sinh tạo variant configurations tối ưu cho campaign mục tiêu",
  },
  {
    id: "classifier-v1",
    name: "Creative Classifier",
    version: "v1.4",
    type: "classifier",
    accuracy: 91.2,
    status: "training",
    lastTrained: "Đang training...",
    samples: 6500,
    description: "Phân loại playable ads theo mechanic type và quality score",
  },
  {
    id: "anomaly-v1",
    name: "Anomaly Detector",
    version: "v1.0",
    type: "predictor",
    accuracy: null,
    status: "collecting",
    lastTrained: "N/A",
    samples: 2100,
    description: "Phát hiện bất thường trong performance metrics",
  },
];

const insights = [
  {
    icon: "🎯",
    title: "Puzzle mechanics lead CTR by 23%",
    description: "Puzzle-type ads consistently outperform other mechanics across all networks. Especially effective with difficulty level 65-80.",
    confidence: 94,
    actionable: true,
  },
  {
    icon: "🎨",
    title: "Orange CTA color correlates with +18% CVR",
    description: "Warm-toned CTA buttons (#F97316 family) show significantly higher conversion rates than cool tones.",
    confidence: 89,
    actionable: true,
  },
  {
    icon: "📱",
    title: "3-step tutorials maximize engagement",
    description: "Ads with exactly 3 tutorial steps have the highest completion rate (78%). More steps cause drop-off.",
    confidence: 91,
    actionable: true,
  },
  {
    icon: "🔊",
    title: "Sound volume 55-70% optimal range",
    description: "Sound-enabled ads with volume in 55-70% range show 12% better engagement than louder or quieter variants.",
    confidence: 76,
    actionable: false,
  },
  {
    icon: "⏱️",
    title: "First 3 seconds critical for retention",
    description: "92% of high-CTR ads present interactive gameplay within first 3 seconds. Delayed intros correlate with 40% lower engagement.",
    confidence: 96,
    actionable: true,
  },
];

function ModelStatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string; icon: React.ReactNode; text: string }> = {
    deployed: {
      className: "bg-success/10 text-success",
      icon: <CheckCircle2 className="h-3 w-3" />,
      text: "Deployed",
    },
    training: {
      className: "bg-primary/10 text-primary",
      icon: <RefreshCw className="h-3 w-3 animate-spin" />,
      text: "Training",
    },
    collecting: {
      className: "bg-warning/10 text-warning",
      icon: <Database className="h-3 w-3" />,
      text: "Collecting Data",
    },
  };
  const c = config[status] ?? config.collecting;
  return (
    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${c.className}`}>
      {c.icon} {c.text}
    </span>
  );
}

export default function AILabPage() {
  const [activeTab, setActiveTab] = useState<"models" | "insights" | "datasets">("models");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar title="AI Lab" subtitle="Machine Learning & Creative Intelligence" />

      <div className="flex-1 space-y-6 overflow-auto p-6">
        {/* Lab Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Active Models", value: "4", icon: Brain, color: "text-primary" },
            { label: "Training Samples", value: "31.7K", icon: Database, color: "text-info" },
            { label: "Avg Accuracy", value: "86.9%", icon: TrendingUp, color: "text-success" },
            { label: "Insights Generated", value: "23", icon: Lightbulb, color: "text-warning" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-zinc-800/60 bg-surface-2 p-4"
            >
              <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
              <p className="text-lg font-bold text-zinc-100">{stat.value}</p>
              <p className="text-[11px] text-zinc-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-zinc-800/60 bg-surface-1 p-1">
          {(["models", "insights", "datasets"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-surface-3 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab === "models" && <Brain className="h-4 w-4" />}
              {tab === "insights" && <Lightbulb className="h-4 w-4" />}
              {tab === "datasets" && <Database className="h-4 w-4" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Models Tab */}
        {activeTab === "models" && (
          <div className="grid gap-4 md:grid-cols-2">
            {models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Cpu className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-200">{model.name}</h3>
                      <p className="text-[10px] text-zinc-500">{model.version}</p>
                    </div>
                  </div>
                  <ModelStatusBadge status={model.status} />
                </div>

                <p className="mb-3 text-xs text-zinc-400">{model.description}</p>

                <div className="mb-3 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-surface-1 p-2.5 text-center">
                    <p className="text-[10px] text-zinc-500">Accuracy</p>
                    <p className="text-sm font-bold text-zinc-200">
                      {model.accuracy ? `${model.accuracy}%` : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface-1 p-2.5 text-center">
                    <p className="text-[10px] text-zinc-500">Samples</p>
                    <p className="text-sm font-bold text-zinc-200">
                      {(model.samples / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface-1 p-2.5 text-center">
                    <p className="text-[10px] text-zinc-500">Last Train</p>
                    <p className="truncate text-[11px] font-medium text-zinc-200">
                      {model.lastTrained}
                    </p>
                  </div>
                </div>

                {/* Accuracy bar */}
                {model.accuracy && (
                  <div>
                    <div className="mb-1 flex justify-between text-[10px]">
                      <span className="text-zinc-500">Model Accuracy</span>
                      <span className="text-zinc-300">{model.accuracy}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${model.accuracy}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={`h-full rounded-full ${
                          model.accuracy >= 85 ? "bg-success" : model.accuracy >= 70 ? "bg-warning" : "bg-danger"
                        }`}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-800/60 bg-surface-3 px-3 py-2 text-xs text-zinc-400 transition hover:text-zinc-200">
                    <BarChart3 className="h-3.5 w-3.5" />
                    View Metrics
                  </button>
                  {model.status !== "training" && (
                    <button className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/10">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Retrain
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === "insights" && (
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{insight.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-zinc-200">{insight.title}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          insight.confidence >= 90
                            ? "bg-success/10 text-success"
                            : insight.confidence >= 80
                            ? "bg-primary/10 text-primary"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {insight.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{insight.description}</p>
                    {insight.actionable && (
                      <button className="mt-3 flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20">
                        <Sparkles className="h-3.5 w-3.5" />
                        Apply to Generator
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Datasets Tab */}
        {activeTab === "datasets" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
              <h3 className="mb-4 text-sm font-semibold text-zinc-200">📊 Training Datasets</h3>
              <div className="space-y-2">
                {[
                  { name: "Creative Performance Q1 2026", samples: 14200, status: "Ready", size: "284MB" },
                  { name: "User Interaction Patterns", samples: 8900, status: "Ready", size: "156MB" },
                  { name: "Network Cross-Reference", samples: 6500, status: "Collecting", size: "89MB" },
                  { name: "A/B Test Results Archive", samples: 2100, status: "Collecting", size: "42MB" },
                ].map((ds, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-zinc-800/40 bg-surface-1 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 text-info" />
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{ds.name}</p>
                        <p className="text-[10px] text-zinc-500">
                          {(ds.samples / 1000).toFixed(1)}K samples · {ds.size}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        ds.status === "Ready" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      }`}
                    >
                      {ds.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Loop */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-start gap-3">
                <Zap className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-primary">Feedback Loop Active</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    Hệ thống đang tự động thu thập performance data từ 3 ad networks đã kết nối.
                    Dữ liệu mới sẽ được sync mỗi 15 phút và AI models sẽ tự retrain khi đạt đủ 500 samples mới.
                  </p>
                  <div className="mt-3 flex gap-4 text-xs">
                    <span className="text-zinc-400">Next sync: <span className="text-zinc-200">13 phút</span></span>
                    <span className="text-zinc-400">Pending samples: <span className="text-zinc-200">127</span></span>
                    <span className="text-zinc-400">Auto-retrain: <span className="text-success">Enabled</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
