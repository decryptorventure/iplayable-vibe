"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Grid3X3,
  List,
  RotateCcw,
  CheckSquare,
  ChevronRight,
  Pencil,
  Copy,
  Trash2,
  Eye,
  Clock,
  User,
  FileCode,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { mockPlayableAds } from "@/lib/mock-data";

// Mock variants for a playable ad
const mockVariants = [
  { id: "v1", name: "260402 B2WL PAIH WoolLoop", desc: "Không có mô tả", author: "chungqt@ikameglobal.com", lastModified: "08/04/26 18:21", status: "deployed", ctr: 4.5, pinned: true },
  { id: "v2", name: "260402 B2WL PAIH WoolLoop", desc: "Không có mô tả", author: "chungqt@ikameglobal.com", lastModified: "08/04/26 18:25", status: "deployed", ctr: 4.2, pinned: false },
  { id: "v3", name: "B2WL PAIH WoolLoop lv22", desc: "Auto-uploaded for B2 Wool Loop", author: "binhht@ikameglobal.com", lastModified: "01/04/26 22:37", status: "ready", ctr: 3.8, pinned: false },
  { id: "v4", name: "B2WL_PAIH_WoolLoop (4)", desc: "Không có mô tả", author: "chungqt@ikameglobal.com", lastModified: "03/04/26 11:19", status: "ready", ctr: 3.5, pinned: false },
  { id: "v5", name: "B2WL_PAIH_WoolLoop (3)", desc: "Auto-uploaded for iG Wool Loop", author: "thannv@ikameglobal.com", lastModified: "01/04/26 13:51", status: "draft", ctr: null },
  { id: "v6", name: "B2WL_PAIH_WoolLoop (2)", desc: "Auto-uploaded for iG Wool Loop", author: "thannv@ikameglobal.com", lastModified: "01/04/26 11:57", status: "draft", ctr: null },
  { id: "v7", name: "B2WL_PAIH_WoolLoop (1)", desc: "Auto-uploaded for iG Wool Loop", author: "thannv@ikameglobal.com", lastModified: "01/04/26 11:40", status: "draft", ctr: null },
  { id: "v8", name: "B2WL_PAIH_WoolLoop", desc: "Không có mô tả", author: "chungqt@ikameglobal.com", lastModified: "01/04/26 11:19", status: "draft", ctr: null },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    deployed: { bg: "bg-success/10", text: "text-success", label: "Deployed" },
    ready: { bg: "bg-primary/10", text: "text-primary", label: "Ready" },
    draft: { bg: "bg-zinc-800", text: "text-zinc-400", label: "Draft" },
  };
  const c = map[status] ?? map.draft;
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
}

export default function PlayableAdDetailPage({ params }: { params: { adId: string } }) {
  const ad = mockPlayableAds.find((a) => a.id === params.adId) ?? mockPlayableAds[0];
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectMode, setSelectMode] = useState(false);

  const filtered = mockVariants.filter((v) =>
    search ? v.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar title={ad.name} subtitle={`Projects > ${ad.name} > Playable Ads`} />

      <div className="flex-1 overflow-auto p-6">
        {/* Breadcrumb + actions */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link href="/playable-ads" className="flex items-center gap-1 transition hover:text-zinc-200">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <ChevronRight className="h-3 w-3 text-zinc-600" />
            <span className="text-zinc-200">{ad.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectMode(!selectMode)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                selectMode ? "border-primary/40 bg-primary/10 text-primary" : "border-zinc-800/60 bg-surface-3 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5" /> Chọn nhiều
            </button>
          </div>
        </div>

        {/* Header card */}
        <div className="mb-5 rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
              <FileCode className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-zinc-100">{ad.name}</h2>
              <p className="text-xs text-zinc-500">Playable Ads trong dự án · {mockVariants.length} variants</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="rounded-lg bg-surface-1 px-3 py-2 text-center">
                <p className="text-zinc-500">CTR</p>
                <p className="text-sm font-bold text-primary">{ad.ctr ?? "—"}%</p>
              </div>
              <div className="rounded-lg bg-surface-1 px-3 py-2 text-center">
                <p className="text-zinc-500">Variants</p>
                <p className="text-sm font-bold text-zinc-200">{ad.variantCount}</p>
              </div>
              <div className="rounded-lg bg-surface-1 px-3 py-2 text-center">
                <p className="text-zinc-500">Networks</p>
                <p className="text-sm font-bold text-zinc-200">{ad.networks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & actions */}
        <div className="mb-5 rounded-xl border border-zinc-800/60 bg-surface-2 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Tìm kiếm</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nhập nội dung tìm kiếm"
                  className="h-9 w-full rounded-lg border border-zinc-800/60 bg-surface-1 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-primary/40 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Sắp xếp</label>
              <select className="h-9 rounded-lg border border-zinc-800/60 bg-surface-1 px-3 text-sm text-zinc-200 focus:border-primary/40 focus:outline-none">
                <option>Ngày tạo (mới nhất)</option>
                <option>Tên A-Z</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Chế độ xem</label>
              <div className="flex">
                <button onClick={() => setViewMode("grid")} className={`rounded-l-lg border border-zinc-800/60 p-2 transition ${viewMode === "grid" ? "bg-primary text-white" : "bg-surface-3 text-zinc-400"}`}>
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode("list")} className={`rounded-r-lg border border-l-0 border-zinc-800/60 p-2 transition ${viewMode === "list" ? "bg-primary text-white" : "bg-surface-3 text-zinc-400"}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-transparent">.</label>
              <button className="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-800/60 bg-surface-3 px-3 text-xs text-zinc-400 transition hover:text-zinc-200">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Variants Grid */}
        <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-2"}>
          {filtered.map((variant, i) => (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className="group relative"
            >
              <Link href={`/studio/${ad.id}?variant=${variant.id}`}>
                <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-4 transition-all hover:border-primary/30 hover:shadow-glow">
                  {/* Thumbnail placeholder */}
                  <div className="relative mb-3 flex h-32 items-center justify-center rounded-lg border border-zinc-800/40 bg-surface-1">
                    <div className="text-center">
                      <FileCode className="mx-auto mb-1 h-6 w-6 text-zinc-600" />
                      <p className="text-[10px] text-zinc-500">Playable Ad</p>
                    </div>
                    {variant.pinned && (
                      <span className="absolute right-2 top-2 rounded bg-info/20 px-1.5 py-0.5 text-[9px] font-medium text-info">📌 Pinned</span>
                    )}
                    {/* Quick actions */}
                    <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={(e) => { e.preventDefault(); }} className="rounded bg-zinc-800/90 p-1 text-zinc-400 hover:text-zinc-200">
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button onClick={(e) => { e.preventDefault(); }} className="rounded bg-zinc-800/90 p-1 text-zinc-400 hover:text-zinc-200">
                        <Copy className="h-3 w-3" />
                      </button>
                      <button onClick={(e) => { e.preventDefault(); }} className="rounded bg-zinc-800/90 p-1 text-zinc-400 hover:text-danger">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-zinc-100">{variant.name}</h4>
                      <p className="truncate text-[11px] text-zinc-500">{variant.desc}</p>
                    </div>
                    <StatusBadge status={variant.status} />
                  </div>

                  <div className="space-y-1 text-[11px] text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3" /> Người sửa đổi: <span className="text-zinc-300">{variant.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Sửa đổi lần cuối: <span className="text-primary">{variant.lastModified}</span>
                    </div>
                    {variant.ctr && (
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-3 w-3" /> CTR: <span className="font-medium text-success">{variant.ctr}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
