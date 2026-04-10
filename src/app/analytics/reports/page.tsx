"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  Download,
  Mail,
  Clock,
  CheckCircle2,
  Plus,
  BarChart3,
  TrendingUp,
  Target,
  Sparkles,
  Eye,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";

const reportTemplates = [
  {
    id: "weekly",
    name: "Weekly Performance",
    desc: "Tổng hợp CTR, CVR, revenue theo tuần cho tất cả creatives",
    icon: "📊",
    lastRun: "07/04/26",
    schedule: "Mỗi thứ 2",
    format: "PDF",
    status: "scheduled",
  },
  {
    id: "monthly",
    name: "Monthly Creative Review",
    desc: "Phân tích chi tiết top/bottom creatives, network comparison, AI insights",
    icon: "📈",
    lastRun: "01/04/26",
    schedule: "Ngày 1 mỗi tháng",
    format: "PDF + CSV",
    status: "scheduled",
  },
  {
    id: "campaign",
    name: "Campaign Summary",
    desc: "Kết quả campaign cụ thể: A/B test results, budget spend, ROAS",
    icon: "🎯",
    lastRun: "05/04/26",
    schedule: "Manual",
    format: "Google Sheets",
    status: "ready",
  },
  {
    id: "ai-insights",
    name: "AI Insights Report",
    desc: "Báo cáo từ AI: winning patterns, optimization suggestions, model accuracy",
    icon: "🤖",
    lastRun: "08/04/26",
    schedule: "Mỗi thứ 6",
    format: "PDF",
    status: "scheduled",
  },
  {
    id: "network",
    name: "Network Health Report",
    desc: "Tình trạng kết nối, fill rate, eCPM, anomaly alerts cho từng ad network",
    icon: "🌐",
    lastRun: "08/04/26",
    schedule: "Hàng ngày",
    format: "Email",
    status: "scheduled",
  },
];

const recentReports = [
  { name: "Weekly Performance — W14 2026", date: "07/04/26 09:00", size: "2.4MB", format: "PDF" },
  { name: "AI Insights — April W1", date: "04/04/26 18:00", size: "1.8MB", format: "PDF" },
  { name: "Campaign: Wool Loop A/B Test", date: "02/04/26 14:30", size: "856KB", format: "CSV" },
  { name: "Monthly Review — March 2026", date: "01/04/26 09:00", size: "4.1MB", format: "PDF" },
  { name: "Network Health — 31/03", date: "31/03/26 08:00", size: "1.2MB", format: "PDF" },
];

export default function ReportsPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar title="Reports" subtitle="Analytics / Automated Reports" />

      <div className="flex-1 space-y-6 overflow-auto p-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Scheduled Reports", value: "4", icon: Clock, color: "text-primary" },
            { label: "Generated This Month", value: "12", icon: FileText, color: "text-success" },
            { label: "Email Recipients", value: "8", icon: Mail, color: "text-info" },
            { label: "Auto-insights Included", value: "23", icon: Sparkles, color: "text-warning" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-zinc-800/60 bg-surface-2 p-4">
              <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
              <p className="text-lg font-bold text-zinc-100">{stat.value}</p>
              <p className="text-[11px] text-zinc-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Report Templates */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-200">📋 Report Templates</h2>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">
              <Plus className="h-3.5 w-3.5" /> Create Template
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map((tmpl, i) => (
              <motion.div key={tmpl.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5 transition hover:border-zinc-700/60">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-2xl">{tmpl.icon}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tmpl.status === "scheduled" ? "bg-success/10 text-success" : "bg-zinc-800 text-zinc-400"}`}>
                    {tmpl.status === "scheduled" ? "Scheduled" : "Manual"}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-zinc-200">{tmpl.name}</h3>
                <p className="mb-3 text-xs text-zinc-500">{tmpl.desc}</p>

                <div className="mb-3 space-y-1 text-[11px]">
                  <div className="flex justify-between text-zinc-400">
                    <span>Schedule:</span><span className="text-zinc-300">{tmpl.schedule}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Format:</span><span className="text-zinc-300">{tmpl.format}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Last run:</span><span className="text-zinc-300">{tmpl.lastRun}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-800/60 bg-surface-3 py-2 text-xs text-zinc-400 transition hover:text-zinc-200">
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-2 text-xs font-medium text-primary transition hover:bg-primary/20">
                    <Download className="h-3.5 w-3.5" /> Run Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div>
          <h2 className="mb-4 text-sm font-semibold text-zinc-200">📁 Recent Reports</h2>
          <div className="rounded-xl border border-zinc-800/60 bg-surface-2">
            {recentReports.map((report, i) => (
              <div key={i} className="flex items-center justify-between border-b border-zinc-800/40 px-5 py-3 last:border-0 transition hover:bg-surface-3/50">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-sm text-zinc-200">{report.name}</p>
                    <p className="text-[10px] text-zinc-500">{report.date} · {report.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">{report.format}</span>
                  <button className="rounded-lg border border-zinc-800/60 p-1.5 text-zinc-400 transition hover:text-zinc-200">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded-lg border border-zinc-800/60 p-1.5 text-zinc-400 transition hover:text-zinc-200">
                    <Mail className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email scheduling */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h3 className="mb-1 text-sm font-semibold text-primary">Email Scheduling Active</h3>
              <p className="text-xs text-zinc-400">
                Reports đang được gửi tự động đến 8 recipients. Bao gồm AI-generated insights và performance highlights.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["dungxv@ikameglobal.com", "chungqt@ikameglobal.com", "binhht@ikameglobal.com", "+5 others"].map((email) => (
                  <span key={email} className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] text-zinc-300">{email}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
