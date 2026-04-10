"use client";

import { useEffect, useRef } from "react";

export function StatusPieChart() {
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
    const cx = w / 2;
    const cy = h / 2 - 10;
    const outerR = Math.min(cx, cy) - 10;
    const innerR = outerR * 0.55;

    const data = [
      { label: "Active", value: 162, color: "#F97316" },
      { label: "Inactive", value: 12, color: "#22C55E" },
    ];

    const total = data.reduce((s, d) => s + d.value, 0);
    let startAngle = -Math.PI / 2;

    // Draw segments
    data.forEach((segment) => {
      const sliceAngle = (segment.value / total) * Math.PI * 2;

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = "#FAFAFA";
    ctx.font = "bold 22px Inter, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total.toString(), cx, cy - 4);
    ctx.fillStyle = "#71717A";
    ctx.font = "11px Inter, system-ui";
    ctx.fillText("Tổng", cx, cy + 16);

    // Legend
    const legendY = h - 20;
    data.forEach((segment, i) => {
      const lx = cx - 60 + i * 120;
      // Color circle
      ctx.beginPath();
      ctx.arc(lx, legendY, 5, 0, Math.PI * 2);
      ctx.fillStyle = segment.color;
      ctx.fill();

      ctx.fillStyle = "#A1A1AA";
      ctx.font = "11px Inter, system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`${segment.label}`, lx + 12, legendY + 4);
    });
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm">🔄</span>
        <h3 className="text-sm font-semibold text-zinc-200">Trạng thái</h3>
      </div>
      <canvas
        ref={canvasRef}
        className="mx-auto h-52 w-full"
        style={{ width: "100%", height: 208 }}
      />
    </div>
  );
}
