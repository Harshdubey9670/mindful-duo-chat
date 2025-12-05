import { cn } from "@/lib/utils";
import type { Message } from "@/lib/gemini";
import { AgentAvatar } from "./AgentAvatar";

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
}

export function MessageBubble({ message, showAvatar = true }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isEmpathetic = message.agentType === "empathetic";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-fade-in">
        <div className="max-w-[85%] px-5 py-3 rounded-2xl rounded-br-md bg-primary/20 border border-primary/30 text-foreground">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-4 message-bubble">
      {showAvatar && (
        <div className="flex-shrink-0 pt-1">
          <AgentAvatar type={message.agentType || "empathetic"} size="sm" />
        </div>
      )}
      <div
        className={cn(
          "flex-1 px-5 py-4 rounded-2xl rounded-tl-md glass-card",
          isEmpathetic ? "glass-empathetic" : "glass-rational"
        )}
      >
        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </div>
  );
}
