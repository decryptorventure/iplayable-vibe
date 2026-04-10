import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PerformanceBadge({ ctr, reason }: { ctr: number; reason: string }) {
  return (
    <Badge variant="warning" className="gap-1.5 border-orange-600/40 bg-orange-900/20 px-3 py-1 text-xs">
      <Sparkles className="h-3.5 w-3.5" />
      Predicted CTR: {ctr}% ({reason})
    </Badge>
  );
}
