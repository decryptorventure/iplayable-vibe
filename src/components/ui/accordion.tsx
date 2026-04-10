"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  value: string | null;
  setValue: (value: string | null) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

export function Accordion({
  children,
  defaultValue
}: {
  children: React.ReactNode;
  defaultValue?: string;
}) {
  const [value, setValue] = React.useState<string | null>(defaultValue ?? null);
  return <AccordionContext.Provider value={{ value, setValue }}>{children}</AccordionContext.Provider>;
}

export function AccordionItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <div data-value={value} className="border-b border-zinc-800 last:border-b-0">{children}</div>;
}

export function AccordionTrigger({
  value,
  children
}: {
  value: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(AccordionContext);
  if (!context) return null;
  const open = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.setValue(open ? null : value)}
      className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-zinc-100"
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
    </button>
  );
}

export function AccordionContent({
  value,
  className,
  children
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(AccordionContext);
  if (!context) return null;
  const open = context.value === value;
  if (!open) return null;
  return <div className={cn("pb-4", className)}>{children}</div>;
}
