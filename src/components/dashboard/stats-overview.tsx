"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Sparkles,
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { Project } from "@/types";


function AnimatedCounter({ target, decimals = 0, prefix = "", suffix = "" }: {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment + Math.random() * increment * 0.3, target);
      if (step >= steps) {
        current = target;
        clearInterval(timer);
      }
      setValue(current);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {prefix}
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}
      {suffix}
    </span>
  );
}

const gradientClasses = [
  "stat-card-gradient-1",
  "stat-card-gradient-2",
  "stat-card-gradient-3",
  "stat-card-gradient-4",
];

const iconColors = [
  "text-primary",
  "text-success",
  "text-info",
  "text-purple-400",
];

const dotColors = [
  "bg-primary",
  "bg-success",
  "bg-info",
  "bg-purple-400",
];

export function StatsOverview({ projects }: { projects: Project[] }) {
  const totalProjects = projects.length;
  const totalVariants = projects.reduce((sum, p) => sum + p.totalVariants, 0);
  const avgCTR = projects.reduce((sum, p) => sum + p.avgCTR, 0) / Math.max(projects.length, 1);
  const totalSpend = projects.reduce((sum, p) => sum + p.totalSpend, 0);

  const items = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: FolderKanban,
      trend: 12,
      prefix: "",
      suffix: "",
      decimals: 0,
    },
    {
      label: "Active Variants",
      value: totalVariants,
      icon: Sparkles,
      trend: 8,
      prefix: "",
      suffix: "",
      decimals: 0,
    },
    {
      label: "Average CTR",
      value: avgCTR,
      icon: BarChart3,
      trend: -2.1,
      prefix: "",
      suffix: "%",
      decimals: 2,
    },
    {
      label: "Total Spend",
      value: totalSpend,
      icon: DollarSign,
      trend: 15.3,
      prefix: "$",
      suffix: "",
      decimals: 0,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
        >
          <div
            className={`group relative overflow-hidden rounded-xl border border-zinc-800/60 bg-surface-2 p-5 transition-all duration-300 hover:border-zinc-700/60 hover:shadow-lg ${gradientClasses[index]}`}
          >
            {/* Accent dot */}
            <div className={`absolute right-4 top-4 h-2 w-2 rounded-full ${dotColors[index]}`} />

            <div className="mb-4 flex items-center gap-3">
              <div className={`rounded-lg bg-zinc-800/60 p-2 ${iconColors[index]}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-zinc-400">{item.label}</p>
            </div>

            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-zinc-100 animate-count-up">
                <AnimatedCounter
                  target={item.value}
                  decimals={item.decimals}
                  prefix={item.prefix}
                  suffix={item.suffix}
                />
              </p>
              <div
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  item.trend >= 0
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                }`}
              >
                {item.trend >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(item.trend)}%
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
