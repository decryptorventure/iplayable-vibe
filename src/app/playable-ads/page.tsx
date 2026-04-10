"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid3X3,
  List,
  RotateCcw,
  CheckSquare,
  Wand2,
  ChevronLeft,
  ChevronRight,
  X,
  FileUp,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { PlayableCard } from "@/components/playable-ads/playable-card";
import { mockPlayableAds } from "@/lib/mock-data";

const ITEMS_PER_PAGE = 12;

type SortOption = "newest" | "name" | "ctr" | "variants";

export default function PlayableAdsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [selectMode, setSelectMode] = useState(false);


  const filtered = useMemo(() => {
    let result = [...mockPlayableAds];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (ad) =>
          ad.name.toLowerCase().includes(q) ||
          ad.code.toLowerCase().includes(q) ||
          ad.createdBy.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "ctr":
        result.sort((a, b) => (b.ctr ?? 0) - (a.ctr ?? 0));
        break;
      case "variants":
        result.sort((a, b) => b.variantCount - a.variantCount);
        break;
      case "newest":
      default:
        break;
    }

    return result;
  }, [search, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar title="Playable Ads" subtitle="Quản lý danh sách Playable Ads" />

      <div className="flex-1 overflow-auto p-6">
        {/* Quick actions row */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectMode(!selectMode)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                selectMode
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-zinc-800/60 bg-surface-3 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5" />
              Chọn nhiều
            </button>
            <button
              onClick={() => {}}
              className="flex items-center gap-2 rounded-lg border border-zinc-800/60 bg-surface-3 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:text-zinc-200"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Mixed Creative
            </button>
          </div>
        </div>

        {/* Search & Filters bar */}
        <div className="mb-5 rounded-xl border border-zinc-800/60 bg-surface-2 p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Nhập nội dung tìm kiếm"
                  className="h-9 w-full rounded-lg border border-zinc-800/60 bg-surface-1 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-primary/40 focus:outline-none"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="w-48">
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Sắp xếp
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-9 w-full rounded-lg border border-zinc-800/60 bg-surface-1 px-3 text-sm text-zinc-200 focus:border-primary/40 focus:outline-none"
              >
                <option value="newest">Ngày tạo (mới nhất)</option>
                <option value="name">Tên A-Z</option>
                <option value="ctr">CTR cao nhất</option>
                <option value="variants">Nhiều variants</option>
              </select>
            </div>

            {/* View mode */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Chế độ xem
              </label>
              <div className="flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-l-lg border border-zinc-800/60 p-2 transition ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "bg-surface-3 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-r-lg border border-l-0 border-zinc-800/60 p-2 transition ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "bg-surface-3 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Reset */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-transparent">.</label>
              <button
                onClick={() => {
                  setSearch("");
                  setSortBy("newest");
                  setCurrentPage(1);
                }}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-800/60 bg-surface-3 px-3 text-xs font-medium text-zinc-400 transition hover:text-zinc-200"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Grid / List */}
        <div
          className={
            viewMode === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "space-y-2"
          }
        >
          {paged.map((ad, i) => (
            <PlayableCard
              key={ad.id}
              ad={ad}
              index={i}
              viewMode={viewMode}
            />
          ))}
        </div>

        {paged.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="mb-3 h-10 w-10 text-zinc-600" />
            <p className="text-sm text-zinc-400">
              Không tìm thấy kết quả
            </p>
            <p className="text-xs text-zinc-600">
              Thử thay đổi từ khóa tìm kiếm
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} trong
              tổng số {filtered.length} kết quả
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-zinc-800/60 bg-surface-3 p-2 text-xs text-zinc-400 transition hover:text-zinc-200 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-9 w-9 rounded-lg border text-xs font-medium transition ${
                      currentPage === pageNum
                        ? "border-primary bg-primary text-white"
                        : "border-zinc-800/60 bg-surface-3 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <span className="px-1 text-xs text-zinc-500">...</span>
              )}

              {totalPages > 5 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`h-9 w-9 rounded-lg border text-xs font-medium transition ${
                    currentPage === totalPages
                      ? "border-primary bg-primary text-white"
                      : "border-zinc-800/60 bg-surface-3 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {totalPages}
                </button>
              )}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-zinc-800/60 bg-surface-3 p-2 text-xs text-zinc-400 transition hover:text-zinc-200 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Create Modal */}
      <AnimatePresence>
        {showQuickCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowQuickCreate(false)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
              >
                <div className="mx-4 w-full max-w-lg rounded-2xl border border-zinc-800/60 bg-surface-2 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">
                        Tạo nhanh Playable Ads
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Tải lên nhiều file và tạo nhanh nhiều playable ads cùng lúc
                      </p>
                    </div>
                    <button
                      onClick={() => setShowQuickCreate(false)}
                      className="rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="mb-2 text-xs font-medium text-zinc-300">
                    File Playable Ad
                  </p>

                  {/* Drop zone */}
                  <div className="mb-4 rounded-xl border-2 border-dashed border-zinc-700/60 bg-surface-1 p-10 text-center transition hover:border-primary/30">
                    <FileUp className="mx-auto mb-3 h-8 w-8 text-zinc-500" />
                    <p className="text-sm text-zinc-300">
                      Kéo thả nhiều file HTML hoặc ZIP vào đây
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      hoặc click để chọn nhiều file. Tối đa 50MB mỗi file
                    </p>
                    <button className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-dark">
                      📁 Chọn files
                    </button>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowQuickCreate(false)}
                      className="rounded-lg border border-zinc-800/60 px-4 py-2 text-sm text-zinc-400 transition hover:text-zinc-200"
                    >
                      Hủy
                    </button>
                    <button className="rounded-lg bg-zinc-700/60 px-4 py-2 text-sm font-medium text-zinc-300">
                      + Tạo 0 playable ads
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
