"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const steps = [
  "Packaging 50 HTML5 variants...",
  "Minifying JS...",
  "Pushing to Cloud...",
  "Registering with AppLovin...",
  "Complete!"
];

export function BatchDeployModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((value) => {
        if (value >= steps.length - 1) {
          clearInterval(interval);
          return value;
        }
        return value + 1;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [open]);

  const progress = useMemo(() => ((stepIndex + 1) / steps.length) * 100, [stepIndex]);
  const done = stepIndex >= steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div>
          <DialogTitle>Deploying 50 Variants</DialogTitle>
          <DialogDescription>Batch deploy pipeline is running across packaging and cloud export.</DialogDescription>
        </div>
        <DialogClose onClick={() => onOpenChange(false)} />
      </DialogHeader>

      <Progress value={progress} className="mb-4" />

      <div className="mb-5 space-y-2">
        {steps.map((step, index) => {
          const isDone = index < stepIndex || (done && index === stepIndex);
          const isRunning = index === stepIndex && !done;
          return (
            <div key={step} className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2">
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : isRunning ? (
                <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <span className="h-4 w-4 rounded-full border border-zinc-700" />
              )}
              <span className={cn("text-sm", isDone ? "text-zinc-100" : "text-zinc-400")}>{step}</span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2">
        {!done ? (
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        ) : (
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        )}
      </div>
    </Dialog>
  );
}
