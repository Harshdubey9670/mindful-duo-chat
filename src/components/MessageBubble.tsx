import { cn } from "@/lib/utils";
import type { Message } from "@/lib/openrouter";
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
      <div className="mb-4 flex justify-end animate-fade-in">
        <div className="max-w-[88%] rounded-[24px] rounded-br-md border border-cyan-300/20 bg-[linear-gradient(135deg,hsl(196_68%_54%_/_0.18),hsl(230_28%_14%_/_0.92))] px-5 py-4 text-foreground shadow-[0_16px_60px_hsl(196_68%_54%_/_0.14)]">
          <p className="text-sm leading-7 whitespace-pre-wrap text-white/90">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-bubble mb-4 flex gap-3">
      {showAvatar && (
        <div className="flex-shrink-0 pt-1">
          <AgentAvatar type={message.agentType || "empathetic"} size="sm" />
        </div>
      )}
      <div
        className={cn(
          "flex-1 rounded-[24px] rounded-tl-md border px-5 py-4 backdrop-blur-2xl",
          isEmpathetic
            ? "border-agent-empathetic/18 bg-[linear-gradient(135deg,hsl(15_80%_65%_/_0.10),hsl(228_24%_11%_/_0.88))]"
            : "border-agent-rational/18 bg-[linear-gradient(135deg,hsl(190_80%_55%_/_0.10),hsl(228_24%_11%_/_0.88))]"
        )}
      >
        <p className="text-sm leading-7 whitespace-pre-wrap text-white/82">
          {message.content}
        </p>
      </div>
    </div>
  );
}
