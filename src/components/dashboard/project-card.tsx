import Link from "next/link";
import { ArrowUpRight, CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

function statusVariant(status: Project["status"]) {
  if (status === "Active") return "success";
  if (status === "AI Syncing") return "warning";
  return "secondary";
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/studio/${project.id}`} className="group block">
      <div className="relative h-full overflow-hidden rounded-xl border border-zinc-800/60 bg-surface-2 p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-glow">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-100 transition-colors group-hover:text-primary-light">
              {project.name}
            </h3>
            <ArrowUpRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
          </div>

          <Badge variant={statusVariant(project.status)} className="mb-4">
            <CircleDot
              className={cn(
                "mr-1 h-2.5 w-2.5",
                project.status === "AI Syncing" && "animate-pulse text-primary"
              )}
            />
            {project.status}
          </Badge>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-zinc-900/60 p-2.5">
              <p className="text-zinc-500">Variants</p>
              <p className="mt-1 text-sm font-bold text-zinc-200">
                {project.totalVariants}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-900/60 p-2.5">
              <p className="text-zinc-500">Avg CTR</p>
              <p className="mt-1 text-sm font-bold text-zinc-200">
                {project.avgCTR}%
              </p>
            </div>
            <div className="rounded-lg bg-zinc-900/60 p-2.5">
              <p className="text-zinc-500">CVR</p>
              <p className="mt-1 text-sm font-bold text-zinc-200">
                {project.avgCVR}%
              </p>
            </div>
            <div className="rounded-lg bg-zinc-900/60 p-2.5">
              <p className="text-zinc-500">Spend</p>
              <p className="mt-1 text-sm font-bold text-zinc-200">
                ${project.totalSpend.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
