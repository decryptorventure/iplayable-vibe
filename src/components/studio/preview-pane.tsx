"use client";

import { useState } from "react";
import { CloudUpload, Rocket, Save } from "lucide-react";
import { toast } from "sonner";
import { BatchDeployModal } from "@/components/deploy/batch-deploy-modal";
import { MobileMockup } from "@/components/studio/mobile-mockup";
import { PerformanceBadge } from "@/components/studio/performance-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudioStore } from "@/store/use-studio-store";

export function PreviewPane() {
  const [deployOpen, setDeployOpen] = useState(false);
  const { isGenerating, predictedCTR, predictionReason, selectedVariantIds } = useStudioStore();

  return (
    <section className="flex h-full flex-col bg-zinc-950/20 p-3">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <PerformanceBadge ctr={predictedCTR} reason={predictionReason} />
          <p className="text-[11px] text-zinc-500">Publishing queue: {selectedVariantIds.length} selected variants</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => toast.success("Saved current config")}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Exported to Google Cloud bucket")}>
            <CloudUpload className="h-4 w-4" />
            Export to Google Cloud
          </Button>
          <Button size="sm" onClick={() => setDeployOpen(true)}>
            <Rocket className="h-4 w-4" />
            Deploy to AppLovin
          </Button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40">
        {isGenerating ? (
          <div className="space-y-3">
            <Skeleton className="h-[520px] w-[290px] rounded-[28px]" />
            <Skeleton className="mx-auto h-4 w-40" />
          </div>
        ) : (
          <MobileMockup loading={false} />
        )}
      </div>

      <BatchDeployModal open={deployOpen} onOpenChange={setDeployOpen} />
    </section>
  );
}
