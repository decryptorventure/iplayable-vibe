"use client";

import { create } from "zustand";
import type { AgentMessage } from "@/types/agent";

interface AgentState {
  isOpen: boolean;
  messages: AgentMessage[];
  isLoading: boolean;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
}

const SUGGESTED_PROMPTS = [
  "Top 5 playable có CTR cao nhất?",
  "Có bao nhiêu playable active hiện tại?",
  "Trend CTR portfolio 30 ngày?",
  "So sánh mechanic Match-3 vs Puzzle",
  "Suggest 3 cải thiện cho B2 Word Jam",
  "Playable nào nên pause vì underperform?",
  "Network nào hiệu quả nhất?",
  "Tổng kết portfolio hiện tại",
];

export { SUGGESTED_PROMPTS };

export const useAgentStore = create<AgentState>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,

  togglePanel: () => set((s) => ({ isOpen: !s.isOpen })),
  openPanel: () => set({ isOpen: true }),
  closePanel: () => set({ isOpen: false }),

  sendMessage: async (content: string) => {
    const userMsg: AgentMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    set((s) => ({
      messages: [...s.messages, userMsg],
      isLoading: true,
    }));

    try {
      const res = await fetch("/api/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      const data = await res.json();

      const assistantMsg: AgentMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content ?? "Không thể xử lý câu hỏi.",
        timestamp: Date.now(),
        citations: data.citations,
        followUps: data.followUps,
      };

      set((s) => ({
        messages: [...s.messages, assistantMsg],
        isLoading: false,
      }));
    } catch {
      const errorMsg: AgentMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "⚠️ Có lỗi kết nối. Vui lòng thử lại.",
        timestamp: Date.now(),
      };
      set((s) => ({
        messages: [...s.messages, errorMsg],
        isLoading: false,
      }));
    }
  },

  clearHistory: () => set({ messages: [] }),
}));
