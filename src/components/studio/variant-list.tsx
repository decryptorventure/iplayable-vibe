import { Clock3, FileJson } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VariantItem {
  id: string;
  name: string;
  createdAt: number;
  predictedCTR?: number;
}

export function VariantList({
  variants,
  selectedVariant,
  selectedVariantIds,
  onSelect,
  onToggleSelect
}: {
  variants: VariantItem[];
  selectedVariant: string | null;
  selectedVariantIds?: string[];
  onSelect: (id: string) => void;
  onToggleSelect?: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {variants.map((variant) => (
        <div
          key={variant.id}
          className={cn(
            "w-full rounded-md border p-2 text-left transition",
            selectedVariant === variant.id
              ? "border-primary bg-orange-500/10"
              : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
          )}
        >
          <div className="mb-1 flex items-center justify-between">
            <button onClick={() => onSelect(variant.id)} className="text-xs font-medium text-zinc-100">
              {variant.name}
            </button>
            <div className="flex items-center gap-1.5">
              {typeof variant.predictedCTR === "number" && (
                <Badge variant="warning" className="text-[10px]">
                  CTR {variant.predictedCTR.toFixed(1)}%
                </Badge>
              )}
              <Badge variant="secondary" className="gap-1">
                <FileJson className="h-3 w-3" />
                JSON
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Clock3 className="h-3 w-3" />
              {new Date(variant.createdAt).toLocaleTimeString()}
            </p>
            {onToggleSelect && (
              <button
                onClick={() => onToggleSelect(variant.id)}
                className={cn(
                  "rounded border px-2 py-0.5 text-[10px]",
                  selectedVariantIds?.includes(variant.id)
                    ? "border-primary bg-primary/20 text-orange-200"
                    : "border-zinc-700 text-zinc-400"
                )}
              >
                {selectedVariantIds?.includes(variant.id) ? "Selected" : "Pick"}
              </button>
            )}
          </div>
        </div>
      ))}
      {variants.length === 0 && <p className="text-xs text-zinc-500">Chua co variant nao duoc tao.</p>}
    </div>
  );
}
