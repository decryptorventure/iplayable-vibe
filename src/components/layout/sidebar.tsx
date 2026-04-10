"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  ChevronLeft,
  FileText,
  FolderOpen,
  Gamepad2,
  Network,
  Plus,
  Settings,
  Sparkles,
  FlaskConical,
  Users,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Projects", icon: FolderOpen },
  { href: "/playable-ads", label: "Playable Ads", icon: Gamepad2 },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/analytics/reports", label: "Reports", icon: FileText },
  { href: "/networks", label: "Networks", icon: Network },
  { href: "/ai-lab", label: "AI Lab", icon: FlaskConical },
  { href: "/settings/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex h-screen flex-col border-r border-zinc-800/60 bg-surface-1 px-2 py-4"
    >
      {/* Logo */}
      <div className="mb-2 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light shadow-glow">
          <Sparkles className="h-4.5 w-4.5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <span className="text-sm font-bold tracking-wide text-zinc-100">
                iPlayable
              </span>
              <span className="text-[10px] font-medium text-zinc-500">
                AI Studio
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Create */}
      <div className="mb-4 px-1">
        <Link href="/studio/new">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-3 py-2.5 text-sm font-semibold text-white shadow-glow transition-shadow hover:shadow-glow-lg",
              collapsed && "px-0"
            )}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Quick Create</span>}
          </motion.div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={`${item.label}-${item.href}`} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
                  active
                    ? "bg-zinc-800/80 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1.5 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-primary to-primary-light"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="space-y-2 px-1">
        {/* Theme toggle */}
        <button
          onClick={() => setIsDark((v) => !v)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800/40 hover:text-zinc-200"
        >
          {isDark ? (
            <Moon className="h-[18px] w-[18px] shrink-0" />
          ) : (
            <Sun className="h-[18px] w-[18px] shrink-0" />
          )}
          {!collapsed && <span>Theme</span>}
        </button>

        {/* Collapse toggle */}
        <button
          className="flex w-full items-center justify-center rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-2 text-zinc-400 transition hover:bg-zinc-800/80 hover:text-zinc-200"
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Toggle sidebar"
        >
          <motion.span animate={{ rotate: collapsed ? 180 : 0 }}>
            <ChevronLeft className="h-4 w-4" />
          </motion.span>
        </button>

        {/* User Profile */}
        <div className={cn("flex items-center gap-3 rounded-lg border border-zinc-800/40 bg-zinc-900/40 p-2", collapsed && "justify-center")}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary-light/80 text-xs font-bold text-white">
            DV
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-zinc-200">
                Dung Nguyen Viet
              </p>
              <p className="truncate text-[10px] text-zinc-500">
                dungxv@ikameglobal.com
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
