import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const user = message.role === "user";
  return (
    <div className={cn("flex", user ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-xs",
          user ? "bg-primary text-white" : "border border-zinc-800 bg-zinc-900 text-zinc-200"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
