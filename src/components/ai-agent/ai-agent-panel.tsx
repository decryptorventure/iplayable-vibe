"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Brain, X, Trash2, Send, Sparkles } from "lucide-react";
import { useAgentStore, SUGGESTED_PROMPTS } from "@/store/use-agent-store";
import { AgentMessageComponent } from "@/components/ai-agent/ai-agent-message";

export function AIAgentPanel() {
  const { isOpen, closePanel, messages, isLoading, sendMessage, clearHistory } = useAgentStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleSuggestion = async (text: string) => { setInput(""); await sendMessage(text); };

  const lastMsg = messages[messages.length - 1];
  const followUps = lastMsg?.role === "assistant" ? lastMsg.followUps ?? [] : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden animate-fade-in" onClick={closePanel} />

          {/* Panel */}
          <aside
            className="fixed right-0 top-0 z-50 flex h-screen w-full flex-col border-l border-zinc-800/60 bg-surface-1 shadow-2xl md:w-[440px] lg:w-[480px] animate-slide-in-right"
            style={{ animation: "slideInRight 0.3s ease-out forwards" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light shadow-glow">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-100">iPlayable Assistant</h2>
                  <p className="text-[10px] text-zinc-500">AI Agent · Tra cứu & Phân tích</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {messages.length > 0 && (
                  <button onClick={clearHistory} className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300" title="Xóa lịch sử">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button onClick={closePanel} className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-auto px-4 py-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-4">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary-light/10 ring-1 ring-primary/20">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-zinc-200">Xin chào! Tôi là iPlayable AI 👋</h3>
                  <p className="mb-6 text-center text-xs text-zinc-500">Hỏi tôi bất kỳ điều gì về playable ads performance</p>
                  <div className="grid w-full grid-cols-1 gap-2">
                    {SUGGESTED_PROMPTS.slice(0, 6).map((prompt) => (
                      <button key={prompt} onClick={() => handleSuggestion(prompt)}
                        className="rounded-xl border border-zinc-800/60 bg-surface-2 px-3.5 py-2.5 text-left text-xs text-zinc-400 transition hover:border-primary/30 hover:bg-surface-3 hover:text-zinc-200">
                        <span className="mr-1.5 text-primary">→</span>{prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (<AgentMessageComponent key={msg.id} message={msg} />))}
                  {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-zinc-800/40 bg-surface-3 px-4 py-3">
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:0.2s]" />
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:0.4s]" />
                        </div>
                        <span className="text-xs text-zinc-500">Đang phân tích...</span>
                      </div>
                    </div>
                  )}
                  {!isLoading && followUps.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {followUps.map((f) => (
                        <button key={f} onClick={() => handleSuggestion(f)}
                          className="rounded-full border border-zinc-800/60 bg-surface-2 px-3 py-1.5 text-[11px] text-zinc-400 transition hover:border-primary/30 hover:text-zinc-200">
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-zinc-800/60 p-4">
              <div className="flex items-end gap-2 rounded-xl border border-zinc-800/60 bg-surface-2 px-3 py-2 focus-within:border-primary/40">
                <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="Hỏi về playable ads..." rows={1}
                  className="max-h-24 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none" />
                <button onClick={handleSend} disabled={!input.trim() || isLoading}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-primary-dark disabled:opacity-30">
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-zinc-600">AI Agent · Mock data demo · Enter để gửi</p>
            </div>
          </aside>
        </>
      )}
    </AnimatePresence>
  );
}
