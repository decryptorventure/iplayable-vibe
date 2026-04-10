"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Settings,
  ExternalLink,
  Zap,
  Shield,
  Clock,
  ArrowUpRight,
  X,
  Plus,
  AlertTriangle,
  Pause,
  ArrowRightLeft,
  Bell,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";

interface NetworkConfig {
  id: string;
  name: string;
  logo: string;
  status: "connected" | "disconnected" | "syncing";
  lastSync?: string;
  metrics: {
    impressions: string;
    revenue: string;
    fillRate: string;
    creatives: number;
  };
  features: string[];
}

const networks: NetworkConfig[] = [
  {
    id: "applovin",
    name: "AppLovin MAX",
    logo: "🟣",
    status: "connected",
    lastSync: "2 phút trước",
    metrics: { impressions: "1.2M", revenue: "$82K", fillRate: "96%", creatives: 48 },
    features: ["Bidding", "Playable", "Video", "Banner"],
  },
  {
    id: "unity",
    name: "Unity Ads",
    logo: "⚪",
    status: "connected",
    lastSync: "15 phút trước",
    metrics: { impressions: "680K", revenue: "$52K", fillRate: "92%", creatives: 32 },
    features: ["Bidding", "Playable", "Rewarded"],
  },
  {
    id: "mintegral",
    name: "Mintegral",
    logo: "🔵",
    status: "syncing",
    lastSync: "Đang đồng bộ...",
    metrics: { impressions: "520K", revenue: "$48K", fillRate: "88%", creatives: 28 },
    features: ["Playable", "Interactive", "Native"],
  },
  {
    id: "ironsource",
    name: "ironSource",
    logo: "🟠",
    status: "connected",
    lastSync: "1 giờ trước",
    metrics: { impressions: "340K", revenue: "$31K", fillRate: "85%", creatives: 20 },
    features: ["Bidding", "Playable", "Offerwall"],
  },
  {
    id: "facebook",
    name: "Meta Audience Network",
    logo: "🔷",
    status: "disconnected",
    metrics: { impressions: "—", revenue: "—", fillRate: "—", creatives: 0 },
    features: ["Playable", "Video", "Native"],
  },
  {
    id: "google",
    name: "Google AdMob",
    logo: "🟡",
    status: "disconnected",
    metrics: { impressions: "—", revenue: "—", fillRate: "—", creatives: 0 },
    features: ["Playable", "Rewarded", "Interstitial"],
  },
];

function StatusBadge({ status }: { status: NetworkConfig["status"] }) {
  if (status === "connected")
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
        <CheckCircle2 className="h-3 w-3" /> Connected
      </span>
    );
  if (status === "syncing")
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
        <RefreshCw className="h-3 w-3 animate-spin" /> Syncing
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
      <XCircle className="h-3 w-3" /> Disconnected
    </span>
  );
}

interface OptRule {
  rule: string;
  status: "active" | "paused";
  triggered: number;
}

export default function NetworksPage() {
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [rules, setRules] = useState<OptRule[]>([
    { rule: "Pause creative if CTR < 2.0% after 10K impressions", status: "active", triggered: 3 },
    { rule: "Scale budget +20% for creative with CTR > 5.0%", status: "active", triggered: 1 },
    { rule: "Rotate creative after 500K impressions (anti-fatigue)", status: "active", triggered: 8 },
    { rule: "Alert if fill rate drops below 80%", status: "paused", triggered: 0 },
  ]);

  // Rule form state
  const [ruleCondition, setRuleCondition] = useState("ctr-below");
  const [ruleThreshold, setRuleThreshold] = useState("2.0");
  const [ruleNetwork, setRuleNetwork] = useState("all");
  const [ruleAction, setRuleAction] = useState("pause");
  const [ruleFreq, setRuleFreq] = useState("immediate");
  const [ruleCreated, setRuleCreated] = useState(false);

  const conditionLabels: Record<string, string> = {
    "ctr-below": "CTR drops below",
    "cvr-below": "CVR drops below",
    "fill-below": "Fill rate below",
    "size-above": "File size above",
    "impressions-above": "Impressions exceed",
  };
  const actionLabels: Record<string, string> = {
    pause: "Pause creative",
    replace: "Replace with best variant",
    notify: "Notify team",
    scale: "Scale budget +20%",
  };

  const createRule = () => {
    const condLabel = conditionLabels[ruleCondition] || ruleCondition;
    const actLabel = actionLabels[ruleAction] || ruleAction;
    const netLabel = ruleNetwork === "all" ? "all networks" : networks.find((n) => n.id === ruleNetwork)?.name || ruleNetwork;
    const newRule: OptRule = {
      rule: `${actLabel} when ${condLabel} ${ruleThreshold}% on ${netLabel} (${ruleFreq})`,
      status: "active",
      triggered: 0,
    };
    setRules((prev) => [newRule, ...prev]);
    setRuleCreated(true);
  };

  const resetRuleModal = () => {
    setShowRuleModal(false);
    setRuleCreated(false);
    setRuleCondition("ctr-below");
    setRuleThreshold("2.0");
    setRuleNetwork("all");
    setRuleAction("pause");
    setRuleFreq("immediate");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar title="Networks" subtitle="NMS Integration Hub" />

      <div className="flex-1 space-y-6 overflow-auto p-6">
        {/* Summary stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Connected Networks", value: "3/6", icon: Network, color: "text-success" },
            { label: "Total Creatives Deployed", value: "128", icon: Zap, color: "text-primary" },
            { label: "Auto-Sync Active", value: "3", icon: RefreshCw, color: "text-info" },
            { label: "Last Full Sync", value: "2m ago", icon: Clock, color: "text-warning" },
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

        {/* Network Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {networks.map((network, index) => (
            <motion.div
              key={network.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="group rounded-xl border border-zinc-800/60 bg-surface-2 p-5 transition-all duration-200 hover:border-zinc-700/60"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{network.logo}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-200">{network.name}</h3>
                    {network.lastSync && (
                      <p className="text-[10px] text-zinc-500">Last sync: {network.lastSync}</p>
                    )}
                  </div>
                </div>
                <StatusBadge status={network.status} />
              </div>

              {network.status !== "disconnected" && (
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Impressions", value: network.metrics.impressions },
                    { label: "Revenue", value: network.metrics.revenue },
                    { label: "Fill Rate", value: network.metrics.fillRate },
                    { label: "Creatives", value: network.metrics.creatives.toString() },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg bg-surface-1 p-2.5">
                      <p className="text-[10px] text-zinc-500">{m.label}</p>
                      <p className="text-sm font-bold text-zinc-200">{m.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-4 flex flex-wrap gap-1.5">
                {network.features.map((f) => (
                  <span key={f} className="rounded-md bg-zinc-800/60 px-2 py-0.5 text-[10px] font-medium text-zinc-400">{f}</span>
                ))}
              </div>

              <div className="flex gap-2">
                {network.status === "disconnected" ? (
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition hover:bg-primary-dark">
                    <Zap className="h-3.5 w-3.5" /> Connect
                  </button>
                ) : (
                  <>
                    <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-800/60 bg-surface-3 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:text-zinc-200">
                      <RefreshCw className="h-3.5 w-3.5" /> Sync Now
                    </button>
                    <button className="rounded-lg border border-zinc-800/60 bg-surface-3 p-2 text-zinc-400 transition hover:text-zinc-200">
                      <Settings className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded-lg border border-zinc-800/60 bg-surface-3 p-2 text-zinc-400 transition hover:text-zinc-200">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Auto-optimization Rules */}
        <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">⚡ Auto-Optimization Rules</h3>
              <p className="text-xs text-zinc-500">Tự động tối ưu distribution dựa trên performance</p>
            </div>
            <button onClick={() => setShowRuleModal(true)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-dark">
              + Add Rule
            </button>
          </div>
          <div className="space-y-2">
            {rules.map((rule, i) => (
              <motion.div
                key={i}
                initial={i === 0 && ruleCreated ? { opacity: 0, y: -8 } : false}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-lg border border-zinc-800/40 bg-surface-1 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${rule.status === "active" ? "bg-success" : "bg-zinc-500"}`} />
                  <p className="text-sm text-zinc-300">{rule.rule}</p>
                </div>
                <div className="flex items-center gap-3">
                  {rule.triggered > 0 && (
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Triggered {rule.triggered}x
                    </span>
                  )}
                  <span className={`text-[11px] font-medium ${rule.status === "active" ? "text-success" : "text-zinc-500"}`}>
                    {rule.status === "active" ? "Active" : "Paused"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Rule Builder Modal */}
      <AnimatePresence>
        {showRuleModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={resetRuleModal}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-zinc-800/60 bg-surface-1 shadow-2xl">

              <div className="flex items-center justify-between border-b border-zinc-800/40 px-6 py-4">
                <h3 className="text-base font-semibold text-zinc-100">⚡ New Automation Rule</h3>
                <button onClick={resetRuleModal} className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {!ruleCreated ? (
                <div className="space-y-4 px-6 py-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">When (Condition)</label>
                    <div className="flex gap-2">
                      <select value={ruleCondition} onChange={(e) => setRuleCondition(e.target.value)}
                        className="h-9 flex-1 rounded-lg border border-zinc-700 bg-surface-2 px-3 text-sm text-zinc-200 focus:outline-none">
                        <option value="ctr-below">CTR drops below</option>
                        <option value="cvr-below">CVR drops below</option>
                        <option value="fill-below">Fill rate below</option>
                        <option value="size-above">File size above</option>
                        <option value="impressions-above">Impressions exceed</option>
                      </select>
                      <input value={ruleThreshold} onChange={(e) => setRuleThreshold(e.target.value)}
                        className="h-9 w-20 rounded-lg border border-zinc-700 bg-surface-2 px-3 text-center text-sm text-zinc-200 focus:outline-none" />
                      <span className="flex items-center text-xs text-zinc-500">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">On Network</label>
                    <select value={ruleNetwork} onChange={(e) => setRuleNetwork(e.target.value)}
                      className="h-9 w-full rounded-lg border border-zinc-700 bg-surface-2 px-3 text-sm text-zinc-200 focus:outline-none">
                      <option value="all">All Connected Networks</option>
                      <option value="applovin">AppLovin MAX</option>
                      <option value="unity">Unity Ads</option>
                      <option value="mintegral">Mintegral</option>
                      <option value="ironsource">ironSource</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Then (Action)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: "pause", l: "Pause creative", icon: Pause },
                        { v: "replace", l: "Replace with best", icon: ArrowRightLeft },
                        { v: "notify", l: "Notify team", icon: Bell },
                        { v: "scale", l: "Scale budget +20%", icon: ArrowUpRight },
                      ].map((a) => (
                        <button key={a.v} onClick={() => setRuleAction(a.v)}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition ${
                            ruleAction === a.v ? "border-primary bg-primary/10 text-primary" : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}>
                          <a.icon className="h-3.5 w-3.5" /> {a.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Check Frequency</label>
                    <div className="flex gap-2">
                      {["immediate", "hourly", "daily"].map((f) => (
                        <button key={f} onClick={() => setRuleFreq(f)}
                          className={`flex-1 rounded-lg border py-2 text-xs font-medium capitalize transition ${
                            ruleFreq === f ? "border-primary bg-primary/10 text-primary" : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}>{f}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-success" />
                  </motion.div>
                  <h4 className="mb-1 text-sm font-bold text-zinc-100">Rule Created! ✅</h4>
                  <p className="text-xs text-zinc-400">Rule đã được kích hoạt và sẽ bắt đầu monitoring ngay.</p>
                </div>
              )}

              <div className="flex justify-end border-t border-zinc-800/40 px-6 py-4">
                {!ruleCreated ? (
                  <div className="flex gap-2">
                    <button onClick={resetRuleModal} className="rounded-lg border border-zinc-800 px-4 py-2 text-xs text-zinc-400 transition hover:text-zinc-200">Cancel</button>
                    <button onClick={createRule} className="rounded-lg bg-primary px-5 py-2 text-xs font-medium text-white transition hover:bg-primary-dark">
                      Create Rule
                    </button>
                  </div>
                ) : (
                  <button onClick={resetRuleModal} className="rounded-lg bg-primary px-5 py-2 text-xs font-medium text-white">Done</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

