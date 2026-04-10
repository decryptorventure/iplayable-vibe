"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  FileCode,
  FileUp,
  CheckCircle2,
  Loader2,
  Brain,
  Target,
  Rocket,
  Lightbulb,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";

type CreationMode = null | "upload" | "ai-generate";
type GenerateStep = "brief" | "generating" | "results";

interface GeneratedVariant {
  id: string;
  name: string;
  ctr: number;
  cvr: number;
  score: number;
  config: string;
  ctaColor: string;
  ctaText: string;
}

export default function NewStudioPage() {
  const router = useRouter();
  const [mode, setMode] = useState<CreationMode>(null);
  const [uploadFiles, setUploadFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // AI Generate state
  const [genStep, setGenStep] = useState<GenerateStep>("brief");
  const [brief, setBrief] = useState({
    gameName: "",
    genre: "puzzle",
    targetAudience: "casual-women-25-45",
    objective: "installs",
    variants: 50,
    prompt: "",
  });
  const [genProgress, setGenProgress] = useState(0);
  const [genVariants, setGenVariants] = useState<GeneratedVariant[]>([]);

  const simulateUpload = () => {
    setUploading(true);
    setUploadFiles(["B2WL_PAIH_WoolLoop_v1.zip", "B2WL_PAIH_WoolLoop_v2.html"]);
    setTimeout(() => {
      setUploading(false);
      router.push("/playable-ads");
    }, 2000);
  };

  const startGeneration = () => {
    setGenStep("generating");
    let progress = 0;
    const timer = setInterval(() => {
      progress += Math.random() * 8 + 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        setTimeout(() => {
          const names = [
            "Puzzle Orange CTA Easy", "Puzzle Green CTA Medium", "Match3 Orange CTA Easy",
            "Puzzle Blue CTA Hard", "Runner Orange CTA Medium", "Puzzle Red CTA Easy",
            "Match3 Neon Purple", "Puzzle Teal Soft", "Runner Pink CTA Fast",
            "Puzzle Gold Premium", "Match3 Green Natural", "Runner Blue Electric",
            "Puzzle Warm Sunset", "Match3 Red Bold", "Puzzle Mint Fresh",
            "Runner Yellow Energy", "Match3 Coral Bright", "Puzzle Lavender Calm",
            "Runner Amber Glow", "Puzzle Cyan Ice",
          ];
          const colors = ["#F97316", "#22C55E", "#F97316", "#3B82F6", "#F97316", "#EF4444", "#A855F7", "#14B8A6", "#EC4899", "#F59E0B", "#22C55E", "#3B82F6", "#F97316", "#EF4444", "#14B8A6", "#EAB308", "#F97316", "#A855F7", "#F59E0B", "#06B6D4"];
          const texts = ["PLAY NOW", "PLAY FREE", "TRY NOW", "INSTALL →", "DOWNLOAD", "START", "LET'S GO", "TAP HERE", "PLAY NOW", "GET IT", "PLAY FREE", "TRY IT", "PLAY NOW", "START NOW", "GO!", "TAP TO PLAY", "PLAY!", "TRY FREE", "START →", "PLAY NOW"];
          const generated: GeneratedVariant[] = names.map((name, i) => ({
            id: `gv${i + 1}`,
            name,
            ctr: +(5.2 - i * 0.12 + Math.random() * 0.3).toFixed(1),
            cvr: +(2.1 - i * 0.06 + Math.random() * 0.2).toFixed(1),
            score: Math.max(55, 96 - i * 2 + Math.floor(Math.random() * 5)),
            config: `CTA: ${colors[i]}, Mechanic: ${["Puzzle","Match3","Runner"][i%3]}, Difficulty: ${40 + i * 3}`,
            ctaColor: colors[i],
            ctaText: texts[i],
          }));
          setGenVariants(generated);
          setGenStep("results");
        }, 500);
      }
      setGenProgress(Math.min(progress, 100));
    }, 200);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar title="Tạo Playable Ad Mới" subtitle="Studio / Quick Create" />

      <div className="flex-1 overflow-auto">
        {/* Mode Selection */}
        {!mode && (
          <div className="mx-auto max-w-3xl p-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-zinc-100">Bạn muốn tạo playable ad như thế nào?</h2>
              <p className="text-sm text-zinc-400">Chọn phương thức tạo phù hợp với workflow của bạn</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Upload mode */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("upload")}
                className="group rounded-2xl border border-zinc-800/60 bg-surface-2 p-8 text-left transition-all hover:border-primary/30 hover:shadow-glow"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-info/10 transition-colors group-hover:bg-info/20">
                  <FileUp className="h-8 w-8 text-info" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-100">Upload Files</h3>
                <p className="mb-4 text-sm text-zinc-400">
                  Tải lên file HTML5 hoặc ZIP có sẵn. Hỗ trợ drag & drop nhiều file cùng lúc.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[".html", ".zip", "Batch upload", "Drag & drop"].map((tag) => (
                    <span key={tag} className="rounded-md bg-zinc-800/60 px-2 py-0.5 text-[10px] text-zinc-400">{tag}</span>
                  ))}
                </div>
              </motion.button>

              {/* AI Generate mode */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("ai-generate")}
                className="group relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-8 text-left transition-all hover:border-primary/50 hover:shadow-glow-lg"
              >
                <div className="absolute right-4 top-4 rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-bold text-primary">✨ Recommended</div>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-100">AI Generate</h3>
                <p className="mb-4 text-sm text-zinc-400">
                  Mô tả campaign brief, AI sẽ sinh tạo 50 variant configurations tối ưu tự động.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["GPT-4o", "Auto-optimize", "50 variants", "Performance prediction"].map((tag) => (
                    <span key={tag} className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{tag}</span>
                  ))}
                </div>
              </motion.button>
            </div>
          </div>
        )}

        {/* Upload Mode */}
        {mode === "upload" && (
          <div className="mx-auto max-w-2xl p-8">
            <button onClick={() => setMode(null)} className="mb-6 flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-zinc-200">
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </button>
            <h2 className="mb-6 text-xl font-bold text-zinc-100">Upload Playable Ads</h2>

            {/* Drop zone */}
            <div className="mb-6 rounded-2xl border-2 border-dashed border-zinc-700/60 bg-surface-2 p-12 text-center transition hover:border-primary/30">
              <FileUp className="mx-auto mb-3 h-10 w-10 text-zinc-500" />
              <p className="text-sm text-zinc-300">Kéo thả nhiều file HTML hoặc ZIP vào đây</p>
              <p className="mt-1 text-xs text-zinc-500">Tối đa 50MB mỗi file · Hỗ trợ .html, .htm, .zip</p>
              <button className="mt-4 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark">
                📁 Chọn files
              </button>
            </div>

            {/* Upload progress */}
            {(uploadFiles.length > 0 || uploading) && (
              <div className="space-y-2">
                {uploadFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-zinc-800/40 bg-surface-2 p-3">
                    <FileCode className="h-5 w-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-zinc-200">{f}</p>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                        <motion.div animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="h-full bg-primary rounded-full" />
                      </div>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                ))}
              </div>
            )}

            <button onClick={simulateUpload}
              className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-dark">
              + Tạo {uploadFiles.length || 2} playable ads
            </button>
          </div>
        )}

        {/* AI Generate Mode */}
        {mode === "ai-generate" && (
          <div className="mx-auto max-w-3xl p-8">
            <button onClick={() => { setMode(null); setGenStep("brief"); }} className="mb-6 flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-zinc-200">
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </button>

            {/* Step: Brief */}
            {genStep === "brief" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-100">Campaign Brief</h2>
                    <p className="text-xs text-zinc-500">Mô tả mục tiêu, AI sẽ sinh tạo variants tối ưu</p>
                  </div>
                </div>

                <div className="space-y-4 rounded-xl border border-zinc-800/60 bg-surface-2 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Game Name</label>
                      <input value={brief.gameName} onChange={(e) => setBrief({ ...brief, gameName: e.target.value })}
                        placeholder="VD: iG Water Factory"
                        className="h-9 w-full rounded-lg border border-zinc-700 bg-surface-1 px-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-primary/40 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Genre</label>
                      <select value={brief.genre} onChange={(e) => setBrief({ ...brief, genre: e.target.value })}
                        className="h-9 w-full rounded-lg border border-zinc-700 bg-surface-1 px-3 text-sm text-zinc-200 focus:outline-none">
                        <option value="puzzle">Puzzle</option>
                        <option value="match3">Match 3</option>
                        <option value="runner">Runner</option>
                        <option value="merge">Merge</option>
                        <option value="idle">Idle</option>
                        <option value="shooter">Shooter</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Target Audience</label>
                      <select value={brief.targetAudience} onChange={(e) => setBrief({ ...brief, targetAudience: e.target.value })}
                        className="h-9 w-full rounded-lg border border-zinc-700 bg-surface-1 px-3 text-sm text-zinc-200 focus:outline-none">
                        <option value="casual-women-25-45">Casual · Women 25-45</option>
                        <option value="casual-all-18-35">Casual · All 18-35</option>
                        <option value="midcore-men-18-35">Midcore · Men 18-35</option>
                        <option value="hardcore-men-18-30">Hardcore · Men 18-30</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Campaign Objective</label>
                      <select value={brief.objective} onChange={(e) => setBrief({ ...brief, objective: e.target.value })}
                        className="h-9 w-full rounded-lg border border-zinc-700 bg-surface-1 px-3 text-sm text-zinc-200 focus:outline-none">
                        <option value="installs">Maximize Installs</option>
                        <option value="ctr">Maximize CTR</option>
                        <option value="roas">Maximize ROAS</option>
                        <option value="engagement">Maximize Engagement</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Number of Variants</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min={10} max={100} step={10} value={brief.variants}
                        onChange={(e) => setBrief({ ...brief, variants: +e.target.value })}
                        className="flex-1" />
                      <span className="w-12 rounded bg-surface-1 py-1 text-center text-sm font-bold text-primary">{brief.variants}</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Additional Instructions (Optional)</label>
                    <textarea value={brief.prompt} onChange={(e) => setBrief({ ...brief, prompt: e.target.value })}
                      rows={3} placeholder="VD: Focus on warm colors, use 3-step tutorial, avoid complex game mechanics..."
                      className="w-full rounded-lg border border-zinc-700 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-primary/40 focus:outline-none" />
                  </div>
                </div>

                {/* AI context panel */}
                <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-primary">
                    <Lightbulb className="h-4 w-4" /> AI sẽ sử dụng context sau:
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="rounded bg-primary/10 px-2 py-1 text-zinc-300">📊 14,200 historical performance samples</span>
                    <span className="rounded bg-primary/10 px-2 py-1 text-zinc-300">🏆 Top 10 winning patterns</span>
                    <span className="rounded bg-primary/10 px-2 py-1 text-zinc-300">🌐 3 connected ad networks data</span>
                    <span className="rounded bg-primary/10 px-2 py-1 text-zinc-300">🎯 Audience-genre match score</span>
                  </div>
                </div>

                <button onClick={startGeneration}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light py-3 text-sm font-bold text-white shadow-glow transition hover:shadow-glow-lg">
                  <Sparkles className="h-4 w-4" /> Generate {brief.variants} Variants
                </button>
              </motion.div>
            )}

            {/* Step: Generating */}
            {genStep === "generating" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-100">AI đang sinh tạo variants...</h3>
                <p className="mb-6 text-sm text-zinc-400">Đang phân tích historical data và tối ưu configurations</p>

                <div className="mx-auto max-w-md">
                  <div className="mb-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                    <motion.div className="h-full bg-gradient-to-r from-primary to-primary-light" style={{ width: `${genProgress}%` }} />
                  </div>
                  <p className="text-sm font-medium text-primary">{Math.round(genProgress)}%</p>
                </div>

                <div className="mx-auto mt-6 max-w-md space-y-1.5 text-left">
                  {[
                    { text: "Analyzing campaign brief...", done: genProgress > 15 },
                    { text: "Loading historical performance data...", done: genProgress > 30 },
                    { text: "Identifying winning patterns...", done: genProgress > 50 },
                    { text: "Generating variant configurations...", done: genProgress > 70 },
                    { text: "Running performance predictions...", done: genProgress > 85 },
                    { text: "Ranking and filtering results...", done: genProgress > 95 },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {s.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : genProgress > (i * 15) ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <div className="h-4 w-4 rounded-full border border-zinc-700" />}
                      <span className={s.done ? "text-zinc-200" : "text-zinc-500"}>{s.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step: Results — Visual Gallery with 20 mini previews */}
            {genStep === "results" && (
              <ResultsGallery variants={genVariants} brief={brief} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Visual Results Gallery ─── */

const mechanicTypes = ["Puzzle", "Match3", "Runner", "Puzzle", "Match3"];
const iconSets: Record<string, string[]> = {
  Puzzle: ["🧩", "🔷", "🔶", "🟣", "🟠", "🔵"],
  Match3: ["🍎", "🍊", "🍋", "🫐", "🍇", "🍉"],
  Runner: ["🏃", "⚡", "🔥", "💨", "🚀", "⭐"],
};

function MiniAdPreview({ variant, index }: { variant: GeneratedVariant; index: number }) {
  const mechanic = mechanicTypes[index % mechanicTypes.length];
  const icons = iconSets[mechanic] || iconSets.Puzzle;
  const hue = (index * 47 + 120) % 360;
  const gridCount = mechanic === "Match3" ? 9 : mechanic === "Puzzle" ? 6 : 4;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-black" style={{ height: 170 }}>
      {/* Rank badge */}
      {index < 3 && (
        <div className={`absolute left-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
          index === 0 ? "bg-amber-400 text-black" : index === 1 ? "bg-zinc-300 text-black" : "bg-amber-700 text-white"
        }`}>
          {index + 1}
        </div>
      )}

      {/* Game area */}
      <div
        className="flex flex-1 flex-col items-center justify-center gap-1 p-2"
        style={{ background: `linear-gradient(135deg, hsl(${hue}, 55%, 12%) 0%, hsl(${(hue + 40) % 360}, 45%, 8%) 100%)` }}
      >
        <div className="absolute right-1.5 top-1.5 text-[8px] opacity-50">
          {mechanic === "Puzzle" ? "🧩" : mechanic === "Match3" ? "💎" : "🏃"}
        </div>

        {mechanic === "Runner" ? (
          <div className="flex w-full flex-1 items-end justify-center gap-1 pb-2">
            {[...Array(5)].map((_, i) => {
              const h = 14 + ((i * 11 + hue) % 36);
              return (
                <motion.div key={i} initial={{ height: 0 }} animate={{ height: h }}
                  transition={{ delay: i * 0.04 + index * 0.02, duration: 0.3 }}
                  className="w-3 rounded-t" style={{ background: `hsl(${(hue + i * 55) % 360}, 65%, 50%)` }} />
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(gridCount)].map((_, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.02 + index * 0.01, duration: 0.2 }}
                className="flex h-5 w-5 items-center justify-center rounded text-[9px]"
                style={{ background: `hsl(${(hue + i * 40) % 360}, 55%, 25%)`, border: `1px solid hsl(${(hue + i * 40) % 360}, 35%, 35%)` }}>
                {icons[i % icons.length]}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="flex items-center justify-center px-2 py-1.5" style={{ background: `${variant.ctaColor}12` }}>
        <div className="w-full rounded px-2 py-1 text-center text-[7px] font-bold text-white" style={{ background: variant.ctaColor }}>
          {variant.ctaText}
        </div>
      </div>
    </div>
  );
}

function ResultsGallery({ variants }: { variants: GeneratedVariant[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterMech, setFilterMech] = useState("all");
  const router = useRouter();

  const toggle = (id: string) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const selectTop = (n: number) => { const ids = variants.slice(0, n).map((v) => v.id); setSelectedIds(ids); };

  const filtered = filterMech === "all" ? variants : variants.filter((_, i) => mechanicTypes[i % mechanicTypes.length] === filterMech);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Generation Complete! 🎉</h2>
          <p className="text-sm text-zinc-400">{variants.length} variants ranked by AI predicted performance</p>
        </div>
        <button onClick={() => router.push("/studio/pa-1")} disabled={selectedIds.length === 0}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-40">
          <Sparkles className="h-4 w-4" /> Open Editor ({selectedIds.length}) →
        </button>
      </div>

      {/* Quick actions */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={() => selectTop(5)} className="flex items-center gap-1 rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-400 transition hover:bg-amber-500/25">
          🏆 Select Top 5
        </button>
        <button onClick={() => setSelectedIds(variants.map((v) => v.id))} className="rounded-lg bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-400 transition hover:text-zinc-200">
          Select All
        </button>
        <button onClick={() => setSelectedIds([])} className="rounded-lg bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-400 transition hover:text-zinc-200">
          Clear All
        </button>
        <div className="mx-2 h-4 border-l border-zinc-800" />
        {["all", "Puzzle", "Match3", "Runner"].map((t) => (
          <button key={t} onClick={() => setFilterMech(t)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${filterMech === t ? "bg-primary/20 text-primary" : "text-zinc-500 hover:text-zinc-300"}`}>
            {t === "all" ? "All types" : t}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-zinc-500">✨ Selected: {selectedIds.length}/{variants.length}</span>
      </div>

      {/* Visual Grid */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((v, i) => {
          const sel = selectedIds.includes(v.id);
          const globalIndex = variants.indexOf(v);
          return (
            <motion.div key={v.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.02, 0.4), duration: 0.2 }}
              onClick={() => toggle(v.id)}
              className={`group relative cursor-pointer rounded-xl border p-1.5 transition-all duration-150 ${
                sel ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20" : "border-zinc-800/60 bg-surface-2 hover:border-zinc-700"
              }`}
            >
              {/* Checkbox */}
              <div className={`absolute right-2.5 top-2.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                sel ? "border-primary bg-primary text-white" : "border-zinc-600 bg-black/60 text-transparent group-hover:border-zinc-400"
              }`}>
                <CheckCircle2 className="h-3 w-3" />
              </div>

              {/* Mini preview */}
              <MiniAdPreview variant={v} index={globalIndex} />

              {/* Name + CTR */}
              <div className="mt-1.5 flex items-center justify-between px-0.5">
                <p className="truncate text-[10px] font-medium text-zinc-300">{v.name}</p>
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold ${
                  v.ctr >= 4.0 ? "bg-emerald-500/15 text-emerald-400" : "bg-orange-500/15 text-orange-300"
                }`}>
                  {v.ctr.toFixed(1)}%
                </span>
              </div>

              {/* Stats */}
              <div className="mt-1 grid grid-cols-3 gap-1">
                <div className="rounded bg-zinc-900/80 px-1 py-0.5 text-center">
                  <p className="text-[6px] text-zinc-500">CTR</p>
                  <p className="text-[9px] font-bold text-orange-300">{v.ctr.toFixed(1)}%</p>
                </div>
                <div className="rounded bg-zinc-900/80 px-1 py-0.5 text-center">
                  <p className="text-[6px] text-zinc-500">CVR</p>
                  <p className="text-[9px] font-bold text-zinc-300">{v.cvr.toFixed(1)}%</p>
                </div>
                <div className="rounded bg-zinc-900/80 px-1 py-0.5 text-center">
                  <p className="text-[6px] text-zinc-500">Score</p>
                  <p className={`text-[9px] font-bold ${v.score >= 85 ? "text-emerald-400" : "text-zinc-300"}`}>{v.score}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Recommendation */}
      <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 text-xs text-primary">
          <Target className="h-4 w-4" />
          <span className="font-medium">AI Recommendation:</span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-400">
          Top 5 variants dự đoán CTR trung bình {(variants.slice(0, 5).reduce((s, v) => s + v.ctr, 0) / 5).toFixed(1)}% (cao hơn benchmark 28%). Đề xuất A/B test 3 variants đầu trên AppLovin, sau đó scale winner sang Unity + Mintegral.
        </p>
        <div className="mt-2 flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white">
            <Rocket className="h-3.5 w-3.5" /> Auto A/B Test Top 3 →
          </button>
          <Link href="/analytics" className="flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-1.5 text-xs text-primary">
            View Analytics →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
