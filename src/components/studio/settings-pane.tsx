"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, SlidersHorizontal } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useStudioStore } from "@/store/use-studio-store";

function LabeledRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-zinc-400">{label}</p>
      {children}
    </div>
  );
}

export function SettingsPane() {
  const { config, updateConfig, isGenerating } = useStudioStore();

  if (isGenerating) {
    return (
      <section className="h-full overflow-auto border-r border-zinc-800 bg-zinc-950/40 p-3">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
          <p className="text-sm font-semibold">Manual Controls</p>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </section>
    );
  }

  return (
    <section className="h-full overflow-auto border-r border-zinc-800 bg-zinc-950/40 p-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
          <p className="text-sm font-semibold">Manual Controls</p>
        </div>
        <Badge variant="warning">AI Configured</Badge>
      </div>

      <Accordion defaultValue="cta">
        <AccordionItem value="cta">
          <AccordionTrigger value="cta">CTA</AccordionTrigger>
          <AccordionContent value="cta" className="space-y-3">
            <LabeledRow label="CTA Text">
              <Input
                value={config.cta.text}
                onChange={(event) => updateConfig({ ...config, cta: { ...config.cta, text: event.target.value } })}
              />
            </LabeledRow>
            <div className="grid grid-cols-2 gap-3">
              <LabeledRow label="Color">
                <Input
                  type="color"
                  value={config.cta.color}
                  onChange={(event) => updateConfig({ ...config, cta: { ...config.cta, color: event.target.value } })}
                />
              </LabeledRow>
              <LabeledRow label="Position">
                <Select
                  value={config.cta.position}
                  onChange={(value) =>
                    updateConfig({ ...config, cta: { ...config.cta, position: value as "top" | "bottom" } })
                  }
                  options={[
                    { label: "Top", value: "top" },
                    { label: "Bottom", value: "bottom" }
                  ]}
                />
              </LabeledRow>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="images">
          <AccordionTrigger value="images">Images</AccordionTrigger>
          <AccordionContent value="images" className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-dashed border-zinc-700 bg-zinc-900/50 p-3 text-center text-xs text-zinc-400">
              <ImagePlus className="mx-auto mb-2 h-4 w-4" />
              Sprite Replacements
            </div>
            <div className="rounded-md border border-dashed border-zinc-700 bg-zinc-900/50 p-3 text-center text-xs text-zinc-400">
              <ImagePlus className="mx-auto mb-2 h-4 w-4" />
              Background Upload
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sound">
          <AccordionTrigger value="sound">Sound</AccordionTrigger>
          <AccordionContent value="sound" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Enable Sound</span>
              <Switch
                checked={config.sound.enabled}
                onCheckedChange={(checked) =>
                  updateConfig({ ...config, sound: { ...config.sound, enabled: checked } })
                }
              />
            </div>
            <LabeledRow label={`Volume (${config.sound.volume}%)`}>
              <Slider
                value={config.sound.volume}
                onValueChange={(value) => updateConfig({ ...config, sound: { ...config.sound, volume: value } })}
              />
            </LabeledRow>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tutorial">
          <AccordionTrigger value="tutorial">Tutorial</AccordionTrigger>
          <AccordionContent value="tutorial" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Auto-Start Tutorial</span>
              <Switch
                checked={config.tutorial.autoStart}
                onCheckedChange={(checked) =>
                  updateConfig({ ...config, tutorial: { ...config.tutorial, autoStart: checked } })
                }
              />
            </div>
            <LabeledRow label={`Steps (${config.tutorial.steps})`}>
              <Slider
                value={config.tutorial.steps}
                min={1}
                max={8}
                onValueChange={(value) => updateConfig({ ...config, tutorial: { ...config.tutorial, steps: value } })}
              />
            </LabeledRow>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mechanic">
          <AccordionTrigger value="mechanic">Mechanic</AccordionTrigger>
          <AccordionContent value="mechanic" className="space-y-3">
            <LabeledRow label="Gameplay Type">
              <Select
                value={config.mechanic.type}
                onChange={(value) =>
                  updateConfig({ ...config, mechanic: { ...config.mechanic, type: value as "Puzzle" | "Match3" | "Runner" } })
                }
                options={[
                  { label: "Puzzle", value: "Puzzle" },
                  { label: "Match 3", value: "Match3" },
                  { label: "Runner", value: "Runner" }
                ]}
              />
            </LabeledRow>
            <LabeledRow label={`Difficulty (${config.mechanic.difficulty})`}>
              <Slider
                value={config.mechanic.difficulty}
                onValueChange={(value) =>
                  updateConfig({ ...config, mechanic: { ...config.mechanic, difficulty: value } })
                }
              />
            </LabeledRow>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="level">
          <AccordionTrigger value="level">Level</AccordionTrigger>
          <AccordionContent value="level" className="space-y-3">
            <LabeledRow label="Level Count">
              <Input
                type="number"
                min={1}
                value={config.level.count}
                onChange={(event) =>
                  updateConfig({ ...config, level: { ...config.level, count: Number(event.target.value) || 1 } })
                }
              />
            </LabeledRow>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Progressive Difficulty</span>
              <Switch
                checked={config.level.progressiveDifficulty}
                onCheckedChange={(checked) =>
                  updateConfig({ ...config, level: { ...config.level, progressiveDifficulty: checked } })
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="direct-to-store">
          <AccordionTrigger value="direct-to-store">Direct To Store</AccordionTrigger>
          <AccordionContent value="direct-to-store" className="space-y-3">
            <LabeledRow label="Store URL">
              <Input
                value={config.directToStore.url}
                onChange={(event) =>
                  updateConfig({
                    ...config,
                    directToStore: { ...config.directToStore, url: event.target.value }
                  })
                }
              />
            </LabeledRow>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-2">
                <span className="text-xs text-zinc-400">Deep Link</span>
                <Switch
                  checked={config.directToStore.deepLink}
                  onCheckedChange={(checked) =>
                    updateConfig({
                      ...config,
                      directToStore: { ...config.directToStore, deepLink: checked }
                    })
                  }
                />
              </div>
              <Select
                value={config.directToStore.platform}
                onChange={(value) =>
                  updateConfig({
                    ...config,
                    directToStore: { ...config.directToStore, platform: value as "iOS" | "Android" | "Both" }
                  })
                }
                options={[
                  { label: "Both", value: "Both" },
                  { label: "iOS", value: "iOS" },
                  { label: "Android", value: "Android" }
                ]}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <AnimatePresence>
        <motion.div
          key={JSON.stringify(config)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <p className="mt-4 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] text-primary">
            Configuration auto-updated from AI output.
          </p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
