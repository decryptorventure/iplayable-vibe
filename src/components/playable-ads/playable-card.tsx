"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CircleDot,
  Gamepad2,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlayableAd } from "@/lib/mock-data";

function statusColor(status: PlayableAd["status"]) {
  if (status === "active") return "bg-success";
  if (status === "inactive") return "bg-zinc-500";
  return "bg-warning";
}

function statusText(status: PlayableAd["status"]) {
  if (status === "active") return "Active";
  if (status === "inactive") return "Inactive";
  return "Draft";
}

export function PlayableCard({
  ad,
  index = 0,
  viewMode = "grid",
}: {
  ad: PlayableAd;
  index?: number;
  viewMode?: "grid" | "list";
}) {
  if (viewMode === "list") {
    return (
      <Link href={`/playable-ads/${ad.id}`}>
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
          className="group flex items-center gap-4 rounded-xl border border-zinc-800/60 bg-surface-2 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-surface-3"
        >
          {/* Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Gamepad2 className="h-5 w-5 text-primary" />
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-zinc-100">
                {ad.name}
              </h3>
              <span className={`h-2 w-2 rounded-full ${statusColor(ad.status)}`} />
            </div>
            <p className="text-xs text-zinc-500">{ad.code}</p>
          </div>

          {/* Metrics */}
          <div className="hidden items-center gap-6 text-xs md:flex">
            <div>
              <p className="text-zinc-500">Variants</p>
              <p className="font-semibold text-zinc-200">{ad.variantCount}</p>
            </div>
            {ad.ctr && (
              <div>
                <p className="text-zinc-500">CTR</p>
                <p className="font-semibold text-zinc-200">{ad.ctr}%</p>
              </div>
            )}
            <div>
              <p className="text-zinc-500">Size</p>
              <p className="font-semibold text-zinc-200">{(ad.fileSize / 1000).toFixed(1)}MB</p>
            </div>
          </div>

          {/* Networks */}
          <div className="hidden items-center gap-1 lg:flex">
            {ad.networks.map((n) => (
              <span
                key={n}
                className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-400"
              >
                {n}
              </span>
            ))}
          </div>

          <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-primary" />
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/playable-ads/${ad.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
        className="group relative h-full overflow-hidden rounded-xl border border-zinc-800/60 bg-surface-2 transition-all duration-200 hover:border-primary/30 hover:shadow-glow"
      >
        {/* Status dot */}
        <div className={`absolute right-3 top-3 z-10 h-2.5 w-2.5 rounded-full ${statusColor(ad.status)} ring-2 ring-surface-2`} />

        {/* Card content */}
        <div className="p-4">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-zinc-100 transition-colors group-hover:text-primary-light">
                {ad.name}
              </h3>
              <p className="text-xs text-zinc-500">{ad.code}</p>
            </div>
          </div>

          {/* Meta info */}
          <div className="mb-3 flex items-center gap-3 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1 truncate">
              📧 {ad.createdBy.split("@")[0]}...
            </span>
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3" /> {ad.variantCount}
            </span>
          </div>

          {/* Network badges */}
          <div className="flex flex-wrap gap-1">
            {ad.networks.map((n) => (
              <span
                key={n}
                className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400"
              >
                {n}
              </span>
            ))}
            {ad.networks.length === 0 && (
              <span className="text-[10px] text-zinc-600">No networks</span>
            )}
          </div>

          {/* Arrow */}
          <div className="mt-3 flex justify-end">
            <ArrowRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
