"use client";

import { useEffect, useRef } from "react";

const mechanics = [
  { label: "Puzzle", value: 48, color: "#F97316" },
  { label: "Match 3", value: 35, color: "#FB923C" },
  { label: "Runner", value: 28, color: "#FBBF24" },
  { label: "Merge", value: 22, color: "#22C55E" },
  { label: "Idle", value: 15, color: "#06B6D4" },
  { label: "Shooter", value: 14, color: "#A855F7" },
];

export function TopMechanicsChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const padding = { top: 10, right: 30, bottom: 10, left: 80 };
    const chartW = w - padding.left - padding.right;
    const maxVal = Math.max(...mechanics.map((m) => m.value));
    const barH = 22;
    const gap = 12;

    mechanics.forEach((mech, i) => {
      const y = padding.top + i * (barH + gap);
      const barW = (mech.value / maxVal) * chartW;

      // Label
      ctx.fillStyle = "#A1A1AA";
      ctx.font = "12px Inter, system-ui";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(mech.label, padding.left - 12, y + barH / 2);

      // Bar bg
      ctx.fillStyle = "rgba(63, 63, 70, 0.2)";
      ctx.beginPath();
      ctx.roundRect(padding.left, y, chartW, barH, 4);
      ctx.fill();

      // Bar fill with gradient
      const grad = ctx.createLinearGradient(padding.left, 0, padding.left + barW, 0);
      grad.addColorStop(0, mech.color);
      grad.addColorStop(1, mech.color + "88");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(padding.left, y, barW, barH, 4);
      ctx.fill();

      // Value
      ctx.fillStyle = "#FAFAFA";
      ctx.font = "bold 11px Inter, system-ui";
      ctx.textAlign = "left";
      ctx.fillText(mech.value.toString(), padding.left + barW + 8, y + barH / 2);
    });
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm">🎮</span>
        <h3 className="text-sm font-semibold text-zinc-200">Top mechanics</h3>
      </div>
      <canvas
        ref={canvasRef}
        className="h-52 w-full"
        style={{ width: "100%", height: 208 }}
      />
    </div>
  );
}
