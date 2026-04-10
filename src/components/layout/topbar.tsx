"use client";

import { Bell, Search, Command, X, CheckCircle2, AlertTriangle, Brain, RefreshCw, TrendingDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const mockNotifications = [
  { id: "n1", type: "success" as const, title: "Deploy thành công", desc: "260402 B2WL PAIH WoolLoop → AppLovin MAX", time: "2 phút trước", read: false, link: "/playable-ads/pa-1" },
  { id: "n2", type: "warning" as const, title: "A/B Test Winner Found", desc: "CTA Color Test: Orange wins with 87% confidence", time: "15 phút trước", read: false, link: "/analytics" },
  { id: "n3", type: "ai" as const, title: "AI Training Complete", desc: "CTR Predictor v3.2 — Accuracy 87.4%", time: "1 giờ trước", read: false, link: "/ai-lab" },
  { id: "n4", type: "alert" as const, title: "CTR giảm 30% trên Unity", desc: "iG Color Yarn 3D: CTR 5.0% → 3.5% trong 24h", time: "2 giờ trước", read: true, link: "/analytics" },
  { id: "n5", type: "sync" as const, title: "Mintegral sync complete", desc: "28 creatives synced, 2 cần update", time: "3 giờ trước", read: true, link: "/networks" },
  { id: "n6", type: "success" as const, title: "Batch Generate hoàn tất", desc: "50 variants created for iG Water Factory", time: "5 giờ trước", read: true, link: "/studio/pa-1" },
];

const typeIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  ai: Brain,
  alert: TrendingDown,
  sync: RefreshCw,
};

const typeColors = {
  success: "text-success",
  warning: "text-warning",
  ai: "text-primary",
  alert: "text-red-400",
  sync: "text-info",
};

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    if (showNotifs) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showNotifs]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800/60 bg-surface-1/80 px-6 backdrop-blur-xl">
      <div>
        <p className="text-[11px] font-medium text-zinc-500">{subtitle ?? "iPlayable AI Studio"}</p>
        <h1 className="text-base font-semibold text-zinc-100">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className={`relative hidden w-80 transition-all duration-200 md:block ${searchFocused ? "w-96" : ""}`}>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            ref={inputRef}
            className="h-9 rounded-lg border-zinc-800/60 bg-zinc-900/60 pl-9 pr-20 text-sm placeholder:text-zinc-600 focus:border-primary/40 focus:bg-zinc-900"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <div className="pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
            <kbd className="flex h-5 items-center rounded border border-zinc-700 bg-zinc-800 px-1.5 text-[10px] font-medium text-zinc-400">
              <Command className="mr-0.5 h-2.5 w-2.5" />K
            </kbd>
          </div>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <div className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-zinc-800/60 bg-surface-1 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800/40 px-4 py-3">
                  <h3 className="text-sm font-semibold text-zinc-100">🔔 Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[10px] text-primary hover:underline">
                        Mark all read
                      </button>
                    )}
                    <button onClick={() => setShowNotifs(false)} className="rounded p-0.5 text-zinc-500 hover:text-zinc-300">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="max-h-80 overflow-auto">
                  {notifications.map((notif) => {
                    const Icon = typeIcons[notif.type];
                    const color = typeColors[notif.type];
                    return (
                      <Link
                        key={notif.id}
                        href={notif.link}
                        onClick={() => {
                          setNotifications((prev) =>
                            prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                          );
                          setShowNotifs(false);
                        }}
                        className={`flex gap-3 border-b border-zinc-800/30 px-4 py-3 transition hover:bg-surface-2 ${
                          !notif.read ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          !notif.read ? "bg-primary/10" : "bg-zinc-800/60"
                        }`}>
                          <Icon className={`h-3.5 w-3.5 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium ${!notif.read ? "text-zinc-100" : "text-zinc-300"}`}>
                            {notif.title}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-zinc-500">{notif.desc}</p>
                          <p className="mt-1 text-[10px] text-zinc-600">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="border-t border-zinc-800/40 px-4 py-2.5 text-center">
                  <Link href="/settings" onClick={() => setShowNotifs(false)}
                    className="text-[11px] text-zinc-500 transition hover:text-primary">
                    Notification Settings →
                  </Link>
                </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary-light/80 text-xs font-bold text-white ring-2 ring-primary/20">
          DV
        </div>
      </div>
    </header>
  );
}
