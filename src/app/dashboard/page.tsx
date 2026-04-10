"use client";

import { ProjectGrid } from "@/components/dashboard/project-grid";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { ActivityChart } from "@/components/dashboard/charts/activity-chart";
import { StatusPieChart } from "@/components/dashboard/charts/status-pie-chart";
import { TopMechanicsChart } from "@/components/dashboard/charts/top-mechanics-chart";
import { ImagesStatsChart } from "@/components/dashboard/charts/images-stats-chart";
import { Topbar } from "@/components/layout/topbar";
import { mockProjects } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar title="Dashboard" subtitle="Workspace / Dashboard" />
      <div className="flex-1 space-y-6 overflow-auto p-6">
        <StatsOverview projects={mockProjects} />

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <StatusPieChart />
          <ActivityChart />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TopMechanicsChart />
          <ImagesStatsChart />
        </div>

        {/* Projects */}
        <div>
          <h2 className="mb-4 text-sm font-semibold text-zinc-200">Recent Projects</h2>
          <ProjectGrid projects={mockProjects} />
        </div>
      </div>
    </div>
  );
}
