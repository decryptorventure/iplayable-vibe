"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  CloudUpload,
  Rocket,
  RotateCcw,
  SlidersHorizontal,
  Code,
  Eye,
  Pencil,
  Smartphone,
  Tablet,
  Monitor,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  Minus,
  Plus,
  ImagePlus,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Wand2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Layers,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Palette,
  Type,
  Lightbulb,
  Zap,
  Download,
} from "lucide-react";
import Link from "next/link";

type EditorTab = "settings" | "advanced";
type PreviewTab = "preview" | "editor";
type DeviceType = "phone" | "phone-landscape" | "tablet" | "desktop";

// Mock AI suggestions
const aiSuggestions = [
  { id: 1, type: "cta", title: "Đổi CTA sang màu cam", impact: "+0.8% CTR", confidence: 92, applied: false, detail: 'Brand color #F97316 consistently outperforms green CTA by 18%' },
  { id: 2, type: "difficulty", title: "Giảm difficulty xuống 65", impact: "+0.5% CVR", confidence: 87, applied: false, detail: 'Sweet spot for casual audience: difficulty 60-70 maximizes completion rate' },
  { id: 3, type: "tutorial", title: "Rút tutorial còn 3 bước", impact: "+1.2% Engagement", confidence: 94, applied: true, detail: '3-step tutorials have 78% completion rate vs 5-step at 52%' },
  { id: 4, type: "sound", title: "Tăng volume lên 65%", impact: "+0.3% CTR", confidence: 76, applied: false, detail: 'Sound volume 55-70% range optimal for engagement without annoyance' },
  { id: 5, type: "filesize", title: "Compress images giảm 40%", impact: "-1.2MB size", confidence: 98, applied: false, detail: 'WEBP conversion + lossless compression available. Current: 4.3MB → Target: 3.1MB' },
];

export default function StudioEditorPage({ params }: { params: { projectId: string } }) {
  const [editorTab, setEditorTab] = useState<EditorTab>("settings");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("preview");
  const [device, setDevice] = useState<DeviceType>("phone");
  const [zoom, setZoom] = useState(100);
  const [autoApply, setAutoApply] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [showDistribute, setShowDistribute] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Xin chào! Tôi là AI Assistant. Tôi đã phân tích playable ad này và có 5 gợi ý tối ưu. Hãy xem tab AI Optimize bên trái." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [suggestions, setSuggestions] = useState(aiSuggestions);

  // Sections collapse state
  const [sections, setSections] = useState({ cta: true, images: true, sound: true, aiOptimize: true });
  const toggleSection = (key: keyof typeof sections) => setSections((s) => ({ ...s, [key]: !s[key] }));

  const applySuggestion = (id: number) => {
    setSuggestions((s) => s.map((sg) => sg.id === id ? { ...sg, applied: true } : sg));
    setChatMessages((m) => [...m, { role: "assistant", text: `✅ Đã áp dụng: "${suggestions.find((s) => s.id === id)?.title}". Preview sẽ được cập nhật.` }]);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatMessages((m) => [...m, { role: "user", text: msg }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((m) => [...m, {
        role: "assistant",
        text: msg.toLowerCase().includes("ctr")
          ? "Dựa trên historical data, CTR predict cho config hiện tại là 4.2%. Nếu apply tất cả suggestions, predicted CTR có thể đạt 5.1% (+21%). Bạn muốn apply all không?"
          : msg.toLowerCase().includes("generate")
          ? "Tôi sẽ generate 50 variants dựa trên config hiện tại. Mỗi variant sẽ thay đổi CTA color, difficulty, tutorial steps. Bắt đầu generate?"
          : "Tôi hiểu. Hãy cho tôi biết bạn muốn tối ưu khía cạnh nào: CTA, gameplay mechanic, hay file size?"
      }]);
    }, 800);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-1">
      {/* Top toolbar */}
      <div className="flex h-12 items-center justify-between border-b border-zinc-800/60 bg-surface-1 px-4">
        <div className="flex items-center gap-3">
          <Link href="/playable-ads" className="flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-zinc-100">260402 B2WL PAIH WoolLoop</h1>
            <Pencil className="h-3 w-3 text-primary cursor-pointer" />
          </div>
          <span className="text-[10px] text-zinc-500">● Last saved: 3 ngày trước</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Editor tabs */}
          <div className="flex rounded-lg border border-zinc-800/60">
            {(["settings", "advanced"] as const).map((tab) => (
              <button key={tab} onClick={() => setEditorTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition ${editorTab === tab ? "bg-primary text-white" : "text-zinc-400 hover:text-zinc-200"} ${tab === "settings" ? "rounded-l-lg" : "rounded-r-lg"}`}
              >{tab}</button>
            ))}
          </div>
          <div className="mx-2 h-5 w-px bg-zinc-800" />
          {/* Preview tabs */}
          <div className="flex rounded-lg border border-zinc-800/60">
            {(["preview", "editor"] as const).map((tab) => (
              <button key={tab} onClick={() => setPreviewTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition ${previewTab === tab ? "bg-primary text-white" : "text-zinc-400 hover:text-zinc-200"} ${tab === "preview" ? "rounded-l-lg" : "rounded-r-lg"}`}
              >{tab === "preview" ? "Preview" : "Editor"}</button>
            ))}
          </div>
          <div className="mx-2 h-5 w-px bg-zinc-800" />
          <span className="rounded bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info">tra.cp1</span>
          <span className="text-[10px] text-zinc-500">● Reset Factory</span>
          <div className="mx-2 h-5 w-px bg-zinc-800" />
          <button className="flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/20">
            <Save className="h-3.5 w-3.5" /> Save
          </button>
          <button onClick={() => setShowExport(true)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-dark">
            <Rocket className="h-3.5 w-3.5" /> Export ▾
          </button>
        </div>
      </div>

      {/* Main 3-pane layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Settings & AI Panel */}
        <div className="flex w-[380px] shrink-0 flex-col border-r border-zinc-800/60 bg-surface-1">
          {/* Auto apply toggle */}
          <div className="flex items-center justify-between border-b border-zinc-800/40 px-4 py-2">
            <span className="text-xs text-zinc-400">✨ Mở tất cả</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500">Auto Apply</span>
              <button
                onClick={() => setAutoApply(!autoApply)}
                className={`relative h-5 w-9 rounded-full transition ${autoApply ? "bg-primary" : "bg-zinc-700"}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${autoApply ? "left-[18px]" : "left-0.5"}`} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-3">
            {/* CTA Section */}
            <div className="rounded-lg border border-zinc-800/40 bg-surface-2">
              <button onClick={() => toggleSection("cta")} className="flex w-full items-center justify-between px-3 py-2.5">
                <span className="text-xs font-semibold text-zinc-200">CTA</span>
                {sections.cta ? <ChevronUp className="h-3.5 w-3.5 text-zinc-500" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />}
              </button>
              {sections.cta && (
                <div className="space-y-3 px-3 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Tắt CTA</span>
                    <button className="relative h-5 w-9 rounded-full bg-zinc-700">
                      <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
                    </button>
                  </div>
                  <div>
                    <p className="mb-1 text-[11px] text-zinc-400">Text</p>
                    <input defaultValue="PLAY NOW" className="h-8 w-full rounded border border-zinc-700 bg-surface-1 px-2 text-xs text-zinc-200 focus:border-primary/40 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="mb-1 text-[11px] text-zinc-400">Color</p>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded border border-zinc-700 bg-primary" />
                        <input defaultValue="#F97316" className="h-8 flex-1 rounded border border-zinc-700 bg-surface-1 px-2 text-xs text-zinc-200 focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] text-zinc-400">Position</p>
                      <select className="h-8 w-full rounded border border-zinc-700 bg-surface-1 px-2 text-xs text-zinc-200 focus:outline-none">
                        <option>Bottom</option><option>Top</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Images Section */}
            <div className="rounded-lg border border-zinc-800/40 bg-surface-2">
              <button onClick={() => toggleSection("images")} className="flex w-full items-center justify-between px-3 py-2.5">
                <span className="text-xs font-semibold text-zinc-200">Images</span>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); }} className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200">
                    🔄 Revert All
                  </button>
                  {sections.images ? <ChevronUp className="h-3.5 w-3.5 text-zinc-500" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />}
                </div>
              </button>
              {sections.images && (
                <div className="px-3 pb-3 space-y-2">
                  <select className="h-7 w-full rounded border border-zinc-700 bg-surface-1 px-2 text-[11px] text-zinc-400 focus:outline-none">
                    <option>Không sắp xếp</option>
                    <option>Theo kích thước</option>
                    <option>Theo loại</option>
                  </select>
                  {/* Image rows */}
                  {[
                    { label: "1", size: "64×128px", fileSize: "0.5 KB", color: "#E91E63" },
                    { label: "2", size: "48×48px", fileSize: "1.1 KB", color: "#9E9E9E" },
                    { label: "3", size: "256×256px", fileSize: "35.4 KB", color: "#333" },
                    { label: "4", size: "240×240px", fileSize: "24.7 KB", color: "#8B5CF6" },
                  ].map((img, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-zinc-800/40 bg-surface-1 p-2">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">{img.label}</span>
                      <div className="h-10 w-10 rounded border border-zinc-700" style={{ background: img.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-primary">Gốc</p>
                        <p className="text-[10px] text-zinc-500">{img.size}</p>
                        <p className="text-[10px] text-zinc-500">{img.fileSize}</p>
                      </div>
                      <span className="text-zinc-600">→</span>
                      <div className="h-10 w-10 rounded border border-zinc-700" style={{ background: img.color, filter: "hue-rotate(30deg)" }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-primary">Hiện thị</p>
                        <p className="text-[10px] text-zinc-500">{img.size}</p>
                        <p className="text-[10px] text-zinc-500">{img.fileSize}</p>
                      </div>
                      <button className="text-[10px] text-zinc-400 hover:text-zinc-200">👁 Xem</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sound Section */}
            <div className="rounded-lg border border-zinc-800/40 bg-surface-2">
              <button onClick={() => toggleSection("sound")} className="flex w-full items-center justify-between px-3 py-2.5">
                <span className="text-xs font-semibold text-zinc-200">Sound</span>
                {sections.sound ? <ChevronUp className="h-3.5 w-3.5 text-zinc-500" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />}
              </button>
              {sections.sound && (
                <div className="space-y-2 px-3 pb-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-primary" />
                    <span className="text-xs text-zinc-300">Bật nhạc nền</span>
                  </div>
                  <div>
                    <p className="mb-1 text-[11px] text-zinc-400">Âm lượng nhạc nền: 50</p>
                    <div className="relative h-1.5 rounded-full bg-zinc-700">
                      <div className="h-full w-1/2 rounded-full bg-primary" />
                      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Optimize Section */}
            <div className="rounded-lg border border-primary/20 bg-primary/5">
              <button onClick={() => toggleSection("aiOptimize")} className="flex w-full items-center justify-between px-3 py-2.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> AI Optimize
                  <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px]">{suggestions.filter((s) => !s.applied).length} gợi ý</span>
                </span>
                {sections.aiOptimize ? <ChevronUp className="h-3.5 w-3.5 text-primary/60" /> : <ChevronDown className="h-3.5 w-3.5 text-primary/60" />}
              </button>
              {sections.aiOptimize && (
                <div className="space-y-2 px-3 pb-3">
                  <button className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white transition hover:bg-primary-dark">
                    ⚡ Apply All Recommended ({suggestions.filter((s) => !s.applied).length})
                  </button>
                  {suggestions.map((sg) => (
                    <div key={sg.id} className={`rounded-lg border p-2.5 transition ${sg.applied ? "border-success/30 bg-success/5" : "border-zinc-800/40 bg-surface-1"}`}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium text-zinc-200">{sg.title}</span>
                        {sg.applied ? (
                          <span className="flex items-center gap-1 text-[10px] text-success"><CheckCircle2 className="h-3 w-3" /> Applied</span>
                        ) : (
                          <button onClick={() => applySuggestion(sg.id)} className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/30">
                            Apply
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500">{sg.detail}</p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <span className="rounded bg-success/10 px-1.5 py-0.5 text-[9px] font-medium text-success">{sg.impact}</span>
                        <span className="text-[9px] text-zinc-500">{sg.confidence}% confidence</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CENTER: Preview */}
        <div className="flex flex-1 flex-col bg-surface-1">
          {/* Preview toolbar */}
          <div className="flex items-center justify-between border-b border-zinc-800/40 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-300">Preview</span>
              <span className="rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">● 4.10 MB</span>
              <span className="rounded bg-warning/10 px-1.5 py-0.5 text-[10px] text-warning">⚠ 5</span>
              <span className="rounded bg-danger/10 px-1.5 py-0.5 text-[10px] text-danger">⊘ 1</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Device toggle */}
              {([
                { type: "phone" as DeviceType, icon: Smartphone },
                { type: "tablet" as DeviceType, icon: Tablet },
                { type: "desktop" as DeviceType, icon: Monitor },
              ]).map(({ type, icon: Icon }) => (
                <button key={type} onClick={() => setDevice(type)}
                  className={`rounded-md p-1.5 transition ${device === type ? "bg-primary text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
              <div className="mx-1 h-4 w-px bg-zinc-800" />
              {/* Zoom */}
              <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="p-1 text-zinc-500 hover:text-zinc-300"><Minus className="h-3.5 w-3.5" /></button>
              <span className="w-10 text-center text-[11px] text-zinc-400">{zoom}%</span>
              <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className="p-1 text-zinc-500 hover:text-zinc-300"><Plus className="h-3.5 w-3.5" /></button>
              <button onClick={() => setZoom(100)} className="p-1 text-zinc-500 hover:text-zinc-300"><Maximize className="h-3.5 w-3.5" /></button>
              <button className="p-1 text-zinc-500 hover:text-zinc-300"><RotateCw className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex flex-1 items-center justify-center bg-zinc-900/30 p-4">
            <motion.div
              animate={{ scale: zoom / 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative"
            >
              {/* Phone mockup */}
              <div className={`overflow-hidden rounded-[32px] border border-zinc-700 bg-zinc-950 shadow-2xl ${device === "phone" ? "w-[290px]" : device === "tablet" ? "w-[480px]" : "w-[640px]"}`}
                style={{ padding: 12 }}
              >
                <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-zinc-700" />
                <div className="overflow-hidden rounded-[24px] border border-zinc-800 bg-black"
                  style={{ height: device === "phone" ? 520 : device === "tablet" ? 640 : 400 }}
                >
                  {/* Fake playable content */}
                  <div className="relative flex h-full flex-col items-center justify-center" style={{ background: "linear-gradient(180deg, #1a0a2e 0%, #0d1117 100%)" }}>
                    {/* Game content mockup */}
                    <div className="mb-4 text-center">
                      <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-yellow-500 to-pink-500">
                        <span className="text-3xl">🧩</span>
                      </div>
                      <div className="mx-auto mb-6 h-40 w-48 rounded-xl border border-zinc-700/50 bg-zinc-800/30 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-1.5">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="h-8 w-8 rounded-lg" style={{
                              background: ["#F97316", "#22C55E", "#06B6D4", "#A855F7", "#EF4444", "#FBBF24", "#F97316", "#22C55E", "#06B6D4"][i],
                              opacity: 0.7 + Math.random() * 0.3,
                            }} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* CTA button */}
                    <motion.button
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="rounded-full bg-gradient-to-r from-primary to-primary-light px-8 py-3 text-sm font-bold text-white shadow-glow-lg"
                    >
                      PLAY NOW
                    </motion.button>
                  </div>
                </div>
                <div className="mx-auto mt-2 w-fit rounded-full border border-zinc-700 p-1.5">
                  <Smartphone className="h-3 w-3 text-zinc-500" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT: AI Chat */}
        <div className="flex w-[320px] shrink-0 flex-col border-l border-zinc-800/60 bg-surface-1">
          <div className="border-b border-zinc-800/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-zinc-200">AI Assistant</h3>
            </div>
            <p className="text-[10px] text-zinc-500">Trợ lý tối ưu playable ads</p>
          </div>

          {/* Predicted performance */}
          <div className="border-b border-zinc-800/40 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-zinc-400">Predicted Performance</span>
              <span className="rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">Good</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-surface-2 p-2 text-center">
                <p className="text-sm font-bold text-primary">4.2%</p>
                <p className="text-[9px] text-zinc-500">CTR</p>
              </div>
              <div className="rounded-lg bg-surface-2 p-2 text-center">
                <p className="text-sm font-bold text-success">1.8%</p>
                <p className="text-[9px] text-zinc-500">CVR</p>
              </div>
              <div className="rounded-lg bg-surface-2 p-2 text-center">
                <p className="text-sm font-bold text-info">$12.4</p>
                <p className="text-[9px] text-zinc-500">eCPM</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="border-b border-zinc-800/40 px-4 py-2">
            <div className="flex flex-wrap gap-1.5">
              {["Tối ưu CTA", "Giảm file size", "Generate variants", "So sánh A/B"].map((action) => (
                <button key={action} onClick={() => { setChatInput(action); }}
                  className="rounded-full border border-zinc-700 bg-surface-2 px-2.5 py-1 text-[10px] text-zinc-400 transition hover:border-primary/40 hover:text-primary"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`rounded-lg p-2.5 text-xs ${msg.role === "assistant" ? "bg-surface-2 text-zinc-300" : "ml-6 bg-primary/10 text-zinc-200"}`}>
                {msg.role === "assistant" && <span className="mb-1 block text-[10px] font-medium text-primary">🤖 AI</span>}
                {msg.text}
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="border-t border-zinc-800/40 p-3">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Hỏi AI về playable ad..."
                className="h-9 flex-1 rounded-lg border border-zinc-700 bg-surface-2 px-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-primary/40 focus:outline-none"
              />
              <button onClick={sendChat} className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-primary-dark">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowExport(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="mx-4 w-full max-w-md rounded-2xl border border-zinc-800/60 bg-surface-2 p-6">
              <h3 className="mb-1 text-lg font-semibold text-zinc-100">Export & Distribute</h3>
              <p className="mb-4 text-xs text-zinc-500">Chọn hành động cho playable ad này</p>

              <div className="space-y-2">
                <button className="flex w-full items-center gap-3 rounded-xl border border-zinc-800/40 bg-surface-1 p-4 text-left transition hover:border-primary/30">
                  <Download className="h-5 w-5 text-info" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Download HTML</p>
                    <p className="text-[11px] text-zinc-500">Tải file HTML5 single file</p>
                  </div>
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl border border-zinc-800/40 bg-surface-1 p-4 text-left transition hover:border-primary/30">
                  <CloudUpload className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Export to Google Cloud</p>
                    <p className="text-[11px] text-zinc-500">Push to Cloud Storage bucket</p>
                  </div>
                </button>
                <button onClick={() => { setShowExport(false); setShowDistribute(true); }}
                  className="flex w-full items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-left transition hover:bg-primary/10">
                  <Rocket className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-primary">Distribute to Ad Networks</p>
                    <p className="text-[11px] text-zinc-400">Deploy đến AppLovin, Unity, Mintegral</p>
                  </div>
                </button>
              </div>

              <button onClick={() => setShowExport(false)} className="mt-4 w-full rounded-lg border border-zinc-800/60 py-2 text-xs text-zinc-400 hover:text-zinc-200">
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Distribution Wizard Modal */}
      <AnimatePresence>
        {showDistribute && <DistributionWizard onClose={() => setShowDistribute(false)} />}
      </AnimatePresence>
    </div>
  );
}

function DistributionWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(["applovin"]);
  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);

  const networks = [
    { id: "applovin", name: "AppLovin MAX", status: "connected", logo: "🟣" },
    { id: "unity", name: "Unity Ads", status: "connected", logo: "⚪" },
    { id: "mintegral", name: "Mintegral", status: "connected", logo: "🔵" },
    { id: "ironsource", name: "ironSource", status: "connected", logo: "🟠" },
    { id: "facebook", name: "Meta", status: "disconnected", logo: "🔷" },
  ];

  const deploySteps = [
    "Validating file size & format...",
    "Packaging HTML5 bundle...",
    "Minifying JS & CSS...",
    "Uploading to AppLovin...",
    "Registering creative...",
    "✅ Deploy complete!",
  ];

  const startDeploy = () => {
    setDeploying(true);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDeployStep(i);
      if (i >= deploySteps.length - 1) clearInterval(timer);
    }, 900);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()} className="mx-4 w-full max-w-lg rounded-2xl border border-zinc-800/60 bg-surface-2 p-6">

        {/* Progress steps */}
        <div className="mb-6 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step >= s ? "bg-primary text-white" : "bg-zinc-800 text-zinc-500"}`}>
                {step > s ? "✓" : s}
              </div>
              <span className={`text-xs ${step >= s ? "text-zinc-200" : "text-zinc-500"}`}>
                {s === 1 ? "Select Networks" : s === 2 ? "Configure" : "Deploy"}
              </span>
              {s < 3 && <div className={`h-0.5 flex-1 rounded ${step > s ? "bg-primary" : "bg-zinc-800"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Select networks */}
        {step === 1 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-100">Chọn ad networks để deploy</h3>
            <div className="space-y-2 mb-4">
              {networks.map((n) => (
                <button key={n.id} disabled={n.status === "disconnected"}
                  onClick={() => setSelectedNetworks((prev) => prev.includes(n.id) ? prev.filter((x) => x !== n.id) : [...prev, n.id])}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                    selectedNetworks.includes(n.id) ? "border-primary/40 bg-primary/5" : n.status === "disconnected" ? "border-zinc-800 bg-zinc-900/30 opacity-50" : "border-zinc-800/60 bg-surface-1 hover:border-zinc-700"
                  }`}>
                  <span className="text-lg">{n.logo}</span>
                  <span className="flex-1 text-sm text-zinc-200">{n.name}</span>
                  {n.status === "disconnected" ? (
                    <span className="text-[10px] text-zinc-500">Not connected</span>
                  ) : selectedNetworks.includes(n.id) ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : null}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} disabled={selectedNetworks.length === 0}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-50">
              Continue → Configure ({selectedNetworks.length})
            </button>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 2 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-100">Cấu hình per-network</h3>
            <div className="space-y-3 mb-4">
              {selectedNetworks.map((nId) => {
                const n = networks.find((x) => x.id === nId)!;
                return (
                  <div key={nId} className="rounded-lg border border-zinc-800/40 bg-surface-1 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span>{n.logo}</span>
                      <span className="text-sm font-medium text-zinc-200">{n.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="mb-1 text-zinc-500">File format</p>
                        <select className="h-7 w-full rounded border border-zinc-700 bg-surface-2 px-2 text-zinc-300 focus:outline-none">
                          <option>MRAID 2.0</option><option>HTML5 Raw</option>
                        </select>
                      </div>
                      <div>
                        <p className="mb-1 text-zinc-500">Max size</p>
                        <select className="h-7 w-full rounded border border-zinc-700 bg-surface-2 px-2 text-zinc-300 focus:outline-none">
                          <option>3 MB</option><option>5 MB</option><option>10 MB</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      <span className="text-[10px] text-success">Validation passed — file meets network requirements</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 rounded-lg border border-zinc-800/60 py-2.5 text-sm text-zinc-400 hover:text-zinc-200">
                ← Back
              </button>
              <button onClick={() => { setStep(3); startDeploy(); }}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark">
                🚀 Deploy Now
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Deploy progress */}
        {step === 3 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-100">Deploying to {selectedNetworks.length} networks</h3>
            <div className="mb-4">
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-zinc-800">
                <motion.div className="h-full bg-primary" animate={{ width: `${((deployStep + 1) / deploySteps.length) * 100}%` }} />
              </div>
              <div className="space-y-2">
                {deploySteps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {i < deployStep ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : i === deployStep && deploying ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-zinc-700" />
                    )}
                    <span className={i <= deployStep ? "text-zinc-200" : "text-zinc-500"}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            {deployStep >= deploySteps.length - 1 && (
              <div className="space-y-2">
                <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-center">
                  <p className="text-sm font-semibold text-success">🎉 Deploy thành công!</p>
                  <p className="text-[11px] text-zinc-400">Creative đã được push đến {selectedNetworks.length} ad networks</p>
                </div>
                <button onClick={onClose} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white">
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
