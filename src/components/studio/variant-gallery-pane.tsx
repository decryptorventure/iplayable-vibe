"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, WandSparkles, Eye, LayoutGrid, LayoutList, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/use-studio-store";
import type { VariantConfig } from "@/types";

/* ── Deterministic color generator for visual variety ─── */
const hueFromSeed = (seed: string, offset: number) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffff;
  return ((h + offset * 137) % 360);
};

const iconSets: Record<string, string[]> = {
  Puzzle: ["🧩", "🔷", "🔶", "🟣", "🟠", "🔵"],
  Match3: ["🍎", "🍊", "🍋", "🫐", "🍇", "🍉"],
  Runner: ["🏃", "⚡", "🔥", "💨", "🚀", "⭐"],
};

/* ── Mini phone preview that renders variant config visually ─── */
function MiniPreview({ config, seed, rank }: { config: VariantConfig; seed: string; rank: number }) {
  const hue1 = hueFromSeed(seed, 0);
  const hue2 = hueFromSeed(seed, 3);
  const icons = iconSets[config.mechanic.type] || iconSets.Puzzle;
  const gridSize = config.mechanic.type === "Match3" ? 9 : config.mechanic.type === "Puzzle" ? 6 : 4;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-black" style={{ height: 180 }}>
      {/* Rank badge */}
      {rank <= 3 && (
        <div className={cn(
          "absolute left-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold",
          rank === 1 ? "bg-amber-400 text-black" : rank === 2 ? "bg-zinc-300 text-black" : "bg-amber-700 text-white"
        )}>
          {rank}
        </div>
      )}

      {/* Background gradient + game area */}
      <div
        className="flex flex-1 flex-col items-center justify-center gap-1.5 p-2"
        style={{
          background: `linear-gradient(135deg, hsl(${hue1}, 60%, 12%) 0%, hsl(${hue2}, 50%, 8%) 100%)`,
        }}
      >
        {/* Star decoration */}
        <div className="absolute right-1.5 top-1.5 text-[8px] opacity-60">
          {config.mechanic.type === "Puzzle" ? "🧩" : config.mechanic.type === "Match3" ? "💎" : "🏃"}
        </div>

        {/* Game grid - Match3/Puzzle tiles or Runner track */}
        {config.mechanic.type === "Runner" ? (
          <div className="flex w-full flex-1 items-end justify-center gap-1 pb-2">
            {[...Array(5)].map((_, i) => {
              const h = 16 + ((i * 11 + hue1) % 40);
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <div className="w-3 h-full rounded-t" style={{ background: `hsl(${(hue1 + i * 60) % 360}, 70%, 55%)` }} />
                </motion.div>
              );
            })}
            <div className="absolute bottom-10 text-lg">
              {icons[(hue1 + gridSize) % icons.length]}
            </div>
          </div>
        ) : (
          <div className={cn(
            "grid gap-0.5",
            config.mechanic.type === "Match3" ? "grid-cols-3" : "grid-cols-3"
          )}>
            {[...Array(gridSize)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.02, duration: 0.2 }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded text-[10px]"
                  style={{
                    background: `hsl(${(hue1 + i * 40) % 360}, 60%, ${25 + (i % 3) * 10}%)`,
                    border: `1px solid hsl(${(hue1 + i * 40) % 360}, 40%, 35%)`,
                  }}>
                  {icons[i % icons.length]}
                  </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Difficulty indicator */}
        <div className="mt-1 flex items-center gap-1">
          <div className="h-1 w-12 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${config.mechanic.difficulty}%`,
                background: config.mechanic.difficulty > 70 ? "#EF4444" : config.mechanic.difficulty > 40 ? "#F59E0B" : "#22C55E",
              }}
            />
          </div>
          <span className="text-[7px] text-zinc-500">LV{config.mechanic.difficulty}</span>
        </div>
      </div>

      {/* CTA button at configured position */}
      <div
        className={cn(
          "flex items-center justify-center px-2 py-1.5",
          config.cta.position === "top" ? "order-first" : ""
        )}
        style={{ background: `${config.cta.color}15` }}
      >
        <div
          className="w-full rounded px-2 py-1 text-center text-[8px] font-bold text-white"
          style={{ background: config.cta.color }}
        >
          {config.cta.text}
        </div>
      </div>

      {/* Sound indicator */}
      {config.sound.enabled && (
        <div className="absolute bottom-7 right-1.5 text-[7px] opacity-50">
          🔊{config.sound.volume}
        </div>
      )}

      {/* Tutorial badge */}
      {config.tutorial.autoStart && (
        <div className="absolute right-1 top-7 rounded bg-zinc-800/80 px-1 py-0.5 text-[6px] text-zinc-400">
          {config.tutorial.steps}步
        </div>
      )}
    </div>
  );
}

/* ── Stats bar for each variant ─── */
function VariantStats({ config, ctr }: { config: VariantConfig; ctr: number }) {
  return (
    <div className="mt-1.5 grid grid-cols-3 gap-1">
      <div className="rounded bg-zinc-900/80 px-1.5 py-0.5 text-center">
        <p className="text-[7px] text-zinc-500">CTR</p>
        <p className="text-[9px] font-bold text-orange-300">{ctr.toFixed(1)}%</p>
      </div>
      <div className="rounded bg-zinc-900/80 px-1.5 py-0.5 text-center">
        <p className="text-[7px] text-zinc-500">Type</p>
        <p className="text-[9px] font-bold text-zinc-300">{config.mechanic.type}</p>
      </div>
      <div className="rounded bg-zinc-900/80 px-1.5 py-0.5 text-center">
        <p className="text-[7px] text-zinc-500">Diff</p>
        <p className={cn("text-[9px] font-bold", config.mechanic.difficulty > 70 ? "text-red-400" : config.mechanic.difficulty > 40 ? "text-amber-400" : "text-emerald-400")}>
          {config.mechanic.difficulty}
        </p>
      </div>
    </div>
  );
}

/* ── Main Gallery ─── */
export function VariantGalleryPane() {
  const {
    variants,
    isGenerating,
    generationProgress,
    generatedCount,
    selectedVariant,
    selectedVariantIds,
    selectVariant,
    toggleVariantSelection,
    goToEditStep
  } = useStudioStore();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = filterType === "all" ? variants : variants.filter((v) => v.config.mechanic.type === filterType);
  const selectedCount = selectedVariantIds.length;
  const topCTR = variants.length > 0 ? variants[0]?.predictedCTR.toFixed(1) : "—";

  return (
    <section className="flex h-full flex-col bg-zinc-950/30">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              AI Preview Gallery
              {variants.length > 0 && (
                <span className="ml-2 text-xs font-normal text-zinc-500">
                  {filtered.length} variant{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </h3>
            <p className="text-[11px] text-zinc-500">
              {variants.length === 0 ? "Nhập prompt bên trái → AI tạo batch variants với preview" : `Top CTR: ${topCTR}% · Đã chọn: ${selectedCount}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter pills */}
          {variants.length > 0 && (
            <div className="hidden items-center gap-1 sm:flex">
              {["all", "Puzzle", "Match3", "Runner"].map((t) => (
                <button key={t} onClick={() => setFilterType(t)}
                  className={cn(
                    "rounded-md px-2 py-1 text-[10px] font-medium transition",
                    filterType === t ? "bg-primary/20 text-primary" : "text-zinc-500 hover:text-zinc-300"
                  )}>
                  {t === "all" ? "All" : t}
                </button>
              ))}
            </div>
          )}

          {/* View toggle */}
          <div className="flex rounded-lg border border-zinc-800 bg-zinc-900/60">
            <button onClick={() => setViewMode("grid")} className={cn("rounded-l-lg p-1.5 transition", viewMode === "grid" ? "bg-zinc-700 text-zinc-100" : "text-zinc-500")}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setViewMode("list")} className={cn("rounded-r-lg p-1.5 transition", viewMode === "list" ? "bg-zinc-700 text-zinc-100" : "text-zinc-500")}>
              <LayoutList className="h-3.5 w-3.5" />
            </button>
          </div>

          <Button size="sm" onClick={goToEditStep} disabled={selectedCount === 0 || isGenerating}>
            Edit Selected ({selectedCount}) <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Quick actions bar */}
      {variants.length > 0 && !isGenerating && (
        <div className="flex items-center gap-2 border-b border-zinc-800/30 bg-zinc-950/50 px-4 py-2">
          <button
            onClick={() => {
              // Select top N variants
              const top = variants.slice(0, Math.min(5, variants.length)).map((v) => v.id);
              top.forEach((id) => {
                if (!selectedVariantIds.includes(id)) toggleVariantSelection(id);
              });
            }}
            className="flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary transition hover:bg-primary/20"
          >
            <Trophy className="h-3 w-3" /> Select Top 5
          </button>
          <button
            onClick={() => {
              // Select all
              variants.forEach((v) => {
                if (!selectedVariantIds.includes(v.id)) toggleVariantSelection(v.id);
              });
            }}
            className="rounded-md bg-zinc-800/60 px-2.5 py-1 text-[10px] font-medium text-zinc-400 transition hover:text-zinc-200"
          >
            Select All
          </button>
          <button
            onClick={() => {
              selectedVariantIds.forEach((id) => toggleVariantSelection(id));
            }}
            className="rounded-md bg-zinc-800/60 px-2.5 py-1 text-[10px] font-medium text-zinc-400 transition hover:text-zinc-200"
          >
            Clear selection
          </button>
          <div className="ml-auto flex items-center gap-1.5 text-[10px] text-zinc-500">
            <Sparkles className="h-3 w-3 text-primary" />
            AI đề xuất: Top 5 variants có predicted CTR cao nhất
          </div>
        </div>
      )}

      {/* Generation progress */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div className="overflow-hidden border-b border-zinc-800/30">
            <div className="bg-zinc-900/50 px-4 py-3">
              <div className="mb-2 flex items-center justify-between text-xs text-zinc-300">
                <span className="inline-flex items-center gap-1.5">
                  <WandSparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
                  AI đang tạo {generatedCount > 0 ? `${generatedCount}/` : ""}variants...
                </span>
                <span className="font-mono text-primary">{generationProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  style={{ width: `${generationProgress}%` }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light" style={{ height: '100%' }} />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Empty state */}
      {variants.length === 0 && !isGenerating && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40">
              <Eye className="h-8 w-8 text-zinc-600" />
            </div>
            <p className="text-sm font-medium text-zinc-400">Chưa có variant nào</p>
            <p className="mt-1 text-xs text-zinc-600">Nhập prompt ở AI Copilot bên trái &rarr; Bấm &quot;Magic Generate&quot;</p>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === "grid" && variants.length > 0 && (
        <div className="grid flex-1 grid-cols-2 gap-2.5 overflow-auto p-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.map((variant, index) => {
            const selected = selectedVariantIds.includes(variant.id);
            const focused = selectedVariant === variant.id;
            return (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.015, 0.3) }}
              >
                <div
                  onClick={() => selectVariant(variant.id)}
                  className={cn(
                    "group relative cursor-pointer rounded-xl border p-1.5 transition-all duration-150",
                    focused
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : selected
                      ? "border-primary/40 bg-orange-500/5"
                      : "border-zinc-800/60 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60"
                  )}
                >
                {/* Selection checkbox overlay */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleVariantSelection(variant.id); }}
                  className={cn(
                    "absolute right-2.5 top-2.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 transition",
                    selected
                      ? "border-primary bg-primary text-white"
                      : "border-zinc-600 bg-zinc-900/80 text-transparent hover:border-zinc-400"
                  )}
                >
                  <CheckCircle2 className="h-3 w-3" />
                </button>

                {/* Mini phone preview */}
                <MiniPreview config={variant.config} seed={variant.id} rank={index + 1} />

                {/* Name + CTR */}
                <div className="mt-1.5 flex items-center justify-between px-0.5">
                  <p className="truncate text-[10px] font-medium text-zinc-200">{variant.name}</p>
                  <span className={cn(
                    "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold",
                    variant.predictedCTR >= 4.0 ? "bg-emerald-500/15 text-emerald-400" : "bg-orange-500/15 text-orange-300"
                  )}>
                    {variant.predictedCTR.toFixed(1)}%
                  </span>
                </div>

                {/* Stats */}
                <VariantStats config={variant.config} ctr={variant.predictedCTR} />
              </div>
            </motion.div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && variants.length > 0 && (
        <div className="flex-1 space-y-1.5 overflow-auto p-3">
          {filtered.map((variant, index) => {
            const selected = selectedVariantIds.includes(variant.id);
            const focused = selectedVariant === variant.id;
            return (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: Math.min(index * 0.01, 0.2) }}
              >
                <div
                  onClick={() => selectVariant(variant.id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition",
                    focused ? "border-primary bg-primary/5" : selected ? "border-primary/30 bg-orange-500/5" : "border-zinc-800/40 bg-zinc-900/30 hover:border-zinc-700"
                  )}
                >
                {/* Checkbox */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleVariantSelection(variant.id); }}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                    selected ? "border-primary bg-primary text-white" : "border-zinc-600 text-transparent hover:border-zinc-400"
                  )}
                >
                  <CheckCircle2 className="h-3 w-3" />
                </button>

                {/* Rank */}
                <span className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  index === 0 ? "bg-amber-400/20 text-amber-400" : index < 3 ? "bg-zinc-800 text-zinc-300" : "bg-zinc-800/40 text-zinc-500"
                )}>
                  {index + 1}
                </span>

                {/* Mini CTA color swatch */}
                <div className="h-8 w-14 shrink-0 overflow-hidden rounded border border-zinc-800 bg-black">
                  <div className="flex h-full items-end">
                    <div className="w-full px-0.5 py-0.5">
                      <div className="rounded-sm py-0.5 text-center text-[5px] font-bold text-white" style={{ background: variant.config.cta.color }}>
                        {variant.config.cta.text.slice(0, 8)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-zinc-200">{variant.name}</p>
                  <p className="text-[10px] text-zinc-500">{variant.config.mechanic.type} · Diff {variant.config.mechanic.difficulty} · {variant.config.tutorial.steps} steps</p>
                </div>

                {/* CTR */}
                <span className={cn(
                  "shrink-0 rounded px-2 py-1 text-xs font-bold",
                  variant.predictedCTR >= 4.0 ? "bg-emerald-500/15 text-emerald-400" : "bg-orange-500/15 text-orange-300"
                )}>
                  {variant.predictedCTR.toFixed(1)}%
                </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
