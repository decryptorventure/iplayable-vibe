"use client";

import { useEffect, useRef } from "react";

interface DataPoint {
  label: string;
  value: number;
}

const mockData: DataPoint[] = [
  { label: "27/02", value: 8 },
  { label: "28/03", value: 12 },
  { label: "29/03", value: 6 },
  { label: "21/03", value: 22 },
  { label: "01/04", value: 28 },
  { label: "02/04", value: 18 },
  { label: "03/04", value: 15 },
  { label: "04/04", value: 25 },
  { label: "05/04", value: 32 },
  { label: "06/04", value: 20 },
  { label: "07/04", value: 24 },
  { label: "08/04", value: 30 },
];

export function ActivityChart() {
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
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxVal = Math.max(...mockData.map((d) => d.value)) * 1.15;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      const val = Math.round(maxVal - (maxVal / gridLines) * i);
      ctx.strokeStyle = "rgba(63, 63, 70, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = "#71717A";
      ctx.font = "11px Inter, system-ui";
      ctx.textAlign = "right";
      ctx.fillText(val.toString(), padding.left - 8, y + 4);
    }

    // Calculate points
    const points = mockData.map((d, i) => ({
      x: padding.left + (chartW / (mockData.length - 1)) * i,
      y: padding.top + chartH - (d.value / maxVal) * chartH,
    }));

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
    gradient.addColorStop(0, "rgba(249, 115, 22, 0.15)");
    gradient.addColorStop(1, "rgba(249, 115, 22, 0)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i - 1].x + points[i].x) / 2;
      const yc = (points[i - 1].y + points[i].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.quadraticCurveTo(
      points[points.length - 1].x,
      points[points.length - 1].y,
      points[points.length - 1].x,
      points[points.length - 1].y
    );
    ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
    ctx.lineTo(points[0].x, h - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i - 1].x + points[i].x) / 2;
      const yc = (points[i - 1].y + points[i].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.quadraticCurveTo(
      points[points.length - 1].x,
      points[points.length - 1].y,
      points[points.length - 1].x,
      points[points.length - 1].y
    );
    ctx.strokeStyle = "#F97316";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Data points
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#F97316";
      ctx.fill();
      ctx.strokeStyle = "#09090B";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // X labels
    mockData.forEach((d, i) => {
      const x = padding.left + (chartW / (mockData.length - 1)) * i;
      ctx.fillStyle = "#71717A";
      ctx.font = "10px Inter, system-ui";
      ctx.textAlign = "center";
      ctx.fillText(d.label, x, h - padding.bottom + 20);
    });
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm">📈</span>
        <h3 className="text-sm font-semibold text-zinc-200">Tạo mới theo ngày</h3>
      </div>
      <canvas
        ref={canvasRef}
        className="h-52 w-full"
        style={{ width: "100%", height: 208 }}
      />
    </div>
  );
}
