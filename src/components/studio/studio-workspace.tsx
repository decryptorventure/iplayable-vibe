"use client";

import { Group, Panel, Separator } from "react-resizable-panels";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { AICopilotPane } from "@/components/studio/ai-copilot-pane";
import { PreviewPane } from "@/components/studio/preview-pane";
import { SettingsPane } from "@/components/studio/settings-pane";
import { VariantGalleryPane } from "@/components/studio/variant-gallery-pane";
import { Button } from "@/components/ui/button";
import { useStudioStore } from "@/store/use-studio-store";

export function StudioWorkspace() {
  const { workflowStep, middlePaneCollapsed, setMiddlePaneCollapsed, backToSelectionStep } = useStudioStore();

  return (
    <div className="h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-4 py-2 text-xs">
        <div className="inline-flex items-center gap-2 text-zinc-400">
          <span className={workflowStep === "selection" ? "text-orange-300" : ""}>1. Generate & Select</span>
          <span>/</span>
          <span className={workflowStep === "edit" ? "text-orange-300" : ""}>2. Detailed Edit & Publish</span>
        </div>
        {workflowStep === "edit" && (
          <Button variant="outline" size="sm" onClick={backToSelectionStep}>
            Back to Selection
          </Button>
        )}
      </div>
      <Group orientation="horizontal">
        <Panel defaultSize={25} minSize={20}>
          <AICopilotPane />
        </Panel>

        <Separator className="w-px bg-zinc-800" />

        {workflowStep === "selection" ? (
          <Panel defaultSize={75} minSize={40}>
            <VariantGalleryPane />
          </Panel>
        ) : (
          <>
            {!middlePaneCollapsed && (
              <>
                <Panel defaultSize={35} minSize={24}>
                  <SettingsPane />
                </Panel>
                <Separator className="w-px bg-zinc-800" />
              </>
            )}

            <Panel defaultSize={middlePaneCollapsed ? 75 : 40} minSize={30}>
              <div className="relative h-full">
                <div className="absolute left-2 top-2 z-20">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setMiddlePaneCollapsed(!middlePaneCollapsed)}
                  >
                    {middlePaneCollapsed ? (
                      <ChevronLeft className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <motion.div layout>
                  <div className="h-full">
                    <PreviewPane />
                  </div>
                </motion.div>
              </div>
            </Panel>
          </>
        )}
      </Group>
    </div>
  );
}
