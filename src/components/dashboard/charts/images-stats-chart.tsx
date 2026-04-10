"use client";

import { useEffect, useRef } from "react";

const stats = [
  { label: "PNG", value: 186, color: "#F97316" },
  { label: "JPG", value: 124, color: "#FB923C" },
  { label: "SVG", value: 42, color: "#FBBF24" },
  { label: "GIF", value: 18, color: "#22C55E" },
];

export function ImagesStatsChart() {
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
    const h = rect.height;
    const padding = { top: 10, right: 20, bottom: 30, left: 40 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const maxVal = Math.max(...stats.map((s) => s.value)) * 1.15;
    const barW = Math.min(chartW / stats.length - 16, 48);

    // Grid
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      const val = Math.round(maxVal - (maxVal / gridLines) * i);
      ctx.strokeStyle = "rgba(63, 63, 70, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = "#71717A";
      ctx.font = "10px Inter, system-ui";
      ctx.textAlign = "right";
      ctx.fillText(val.toString(), padding.left - 8, y + 3);
    }

    // Bars
    stats.forEach((stat, i) => {
      const groupW = chartW / stats.length;
      const x = padding.left + groupW * i + (groupW - barW) / 2;
      const barH = (stat.value / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      // Bar with gradient
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, stat.color);
      grad.addColorStop(1, stat.color + "44");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Value on top
      ctx.fillStyle = "#FAFAFA";
      ctx.font = "bold 11px Inter, system-ui";
      ctx.textAlign = "center";
      ctx.fillText(stat.value.toString(), x + barW / 2, y - 6);

      // Label
      ctx.fillStyle = "#71717A";
      ctx.font = "10px Inter, system-ui";
      ctx.fillText(stat.label, x + barW / 2, h - padding.bottom + 16);
    });
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm">🖼️</span>
        <h3 className="text-sm font-semibold text-zinc-200">Images / playable</h3>
      </div>
      <canvas
        ref={canvasRef}
        className="h-52 w-full"
        style={{ width: "100%", height: 208 }}
      />
    </div>
  );
}
