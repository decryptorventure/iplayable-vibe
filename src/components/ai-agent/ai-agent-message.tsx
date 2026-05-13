"use client";

import { memo, useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { AgentMessage } from "@/types/agent";

function formatMarkdown(text: string): string {
  let html = text;
  // Tables
  const tableRegex = /\|(.+)\|\n\|[-|: ]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match) => {
    const rows = match.trim().split("\n").filter((r) => !r.match(/^\|[-|: ]+\|$/));
    if (rows.length < 1) return match;
    const headerCells = rows[0].split("|").filter(Boolean).map((c) => c.trim());
    let table = '<div class="overflow-x-auto my-2"><table class="w-full text-xs"><thead><tr>';
    headerCells.forEach((c) => { table += `<th class="border-b border-zinc-700 px-2 py-1.5 text-left font-semibold text-zinc-300">${c}</th>`; });
    table += "</tr></thead><tbody>";
    rows.slice(1).forEach((row) => {
      const cells = row.split("|").filter(Boolean).map((c) => c.trim());
      table += "<tr>";
      cells.forEach((c) => { table += `<td class="border-b border-zinc-800/40 px-2 py-1.5 text-zinc-400">${c}</td>`; });
      table += "</tr>";
    });
    table += "</tbody></table></div>";
    return table;
  });
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-zinc-100 font-semibold">$1</strong>');
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<div class="border-l-2 border-primary/40 pl-3 text-zinc-500 text-[11px] italic my-1">$1</div>');
  // Bullet points
  html = html.replace(/^- (.+)$/gm, '<div class="flex gap-1.5 my-0.5"><span class="text-primary mt-0.5">•</span><span>$1</span></div>');
  // Numbered lists
  html = html.replace(/^(\d+)\. (.+)$/gm, '<div class="flex gap-1.5 my-0.5"><span class="text-primary font-bold">$1.</span><span>$2</span></div>');
  // Line breaks
  html = html.replace(/\n\n/g, '<div class="h-2"></div>');
  html = html.replace(/\n/g, "<br/>");
  return html;
}

function AgentMessageBubble({ message }: { message: AgentMessage }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex animate-slide-up ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`group relative max-w-[90%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
          isUser
            ? "bg-primary/15 text-zinc-200 rounded-br-md"
            : "bg-surface-3 text-zinc-300 rounded-bl-md border border-zinc-800/40"
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <>
            <div
              className="agent-markdown space-y-1 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
            />
            {/* Citations */}
            {message.citations && message.citations.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-zinc-800/40 pt-2">
                {message.citations.map((c, i) => (
                  <Link
                    key={i}
                    href={c.href}
                    className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-zinc-400 transition hover:text-primary"
                  >
                    <ExternalLink className="h-2.5 w-2.5" />
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="absolute right-2 top-2 rounded-md p-1 text-zinc-600 opacity-0 transition group-hover:opacity-100 hover:text-zinc-300"
              title="Copy"
            >
              {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export const AgentMessageComponent = memo(AgentMessageBubble);
