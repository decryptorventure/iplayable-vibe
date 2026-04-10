"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChatMessage } from "@/components/studio/chat-message";
import { VariantList } from "@/components/studio/variant-list";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { STUDIO_PRESETS } from "@/lib/studio-presets";
import { useStudioStore } from "@/store/use-studio-store";

export function AICopilotPane() {
  const [prompt, setPrompt] = useState("Generate 50 hard-level variants with neon themes for Christmas.");
  const {
    chatMessages,
    variants,
    selectedVariant,
    selectedVariantIds,
    workflowStep,
    isGenerating,
    generationProgress,
    generatedCount,
    addUserMessage,
    generateVariants,
    selectVariant,
    toggleVariantSelection,
    loadPreset,
    goToEditStep
  } = useStudioStore();

  const canSubmit = useMemo(() => prompt.trim().length > 0 && !isGenerating, [prompt, isGenerating]);

  const onGenerate = async () => {
    if (!canSubmit) return;
    addUserMessage(prompt);
    await generateVariants(prompt, 20);
  };

  const onGeneratePreset = async (presetPrompt: string) => {
    addUserMessage(presetPrompt);
    await generateVariants(presetPrompt, 20);
  };

  return (
    <section className="flex h-full flex-col gap-4 border-r border-zinc-800 bg-zinc-950/60 p-3">
      <div>
        <h2 className="text-sm font-semibold text-zinc-100">AI Copilot</h2>
        <p className="text-xs text-zinc-500">Agentic batch generation for playable variants.</p>
      </div>

      <div className="flex-1 space-y-2 overflow-auto rounded-md border border-zinc-800 bg-zinc-950 p-2">
        {chatMessages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-400"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:0.4s]" />
            AI is thinking...
          </motion.div>
        )}
      </div>

      <div className="space-y-2">
        <div className="space-y-2 rounded-md border border-zinc-800 bg-zinc-900/40 p-2">
          <p className="text-xs font-medium text-zinc-300">Quick Presets</p>
          <div className="space-y-2">
            {STUDIO_PRESETS.map((preset) => (
              <div key={preset.id} className="rounded-md border border-zinc-800 bg-zinc-950/80 p-2">
                <p className="text-xs font-medium text-zinc-100">{preset.name}</p>
                <p className="mb-2 mt-1 text-[11px] text-zinc-500">{preset.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      loadPreset(preset.id);
                      setPrompt(preset.prompt);
                    }}
                  >
                    Load Preset
                  </Button>
                  <Button size="sm" onClick={() => onGeneratePreset(preset.prompt)} disabled={isGenerating}>
                    Generate 50
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Describe your batch generation goal..."
          onKeyDown={async (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              await onGenerate();
            }
          }}
        />
        <Button className="w-full animate-pulseGlow" onClick={onGenerate} disabled={!canSubmit}>
          <Sparkles className="h-4 w-4" />
          Magic Generate 20 Variants
        </Button>
        {(isGenerating || generatedCount > 0) && (
          <div className="space-y-1 rounded-md border border-zinc-800 bg-zinc-900/50 p-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>Generation progress</span>
              <span>
                {generatedCount}/20 ({generationProgress}%)
              </span>
            </div>
            <Progress value={generationProgress} />
          </div>
        )}
      </div>

      <div className="space-y-2 rounded-md border border-zinc-800 bg-zinc-950 p-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-300">Generated JSON Configs</p>
          <p className="text-[11px] text-zinc-500">Selected: {selectedVariantIds.length}</p>
        </div>
        <VariantList
          variants={variants}
          selectedVariant={selectedVariant}
          selectedVariantIds={selectedVariantIds}
          onSelect={selectVariant}
          onToggleSelect={toggleVariantSelection}
        />
        {workflowStep === "selection" && variants.length > 0 && (
          <Button
            variant="secondary"
            className="mt-2 w-full"
            onClick={goToEditStep}
            disabled={selectedVariantIds.length === 0}
          >
            Continue to Detailed Edit
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </section>
  );
}
