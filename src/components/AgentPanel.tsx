import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/openrouter";
import { AgentAvatar } from "./AgentAvatar";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface AgentPanelProps {
  type: "empathetic" | "rational";
  messages: Message[];
  isTyping: boolean;
}

export function AgentPanel({ type, messages, isTyping }: AgentPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEmpathetic = type === "empathetic";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const agentName = isEmpathetic ? "Sage" : "Atlas";
  const agentTitle = isEmpathetic ? "Empathetic Companion" : "Cognitive Coach";

  return (
    <div
      className={cn(
        "glass-panel surface-noise aurora-shell flex h-full flex-col overflow-hidden rounded-[32px] border transition-all duration-500 shadow-panel",
        isEmpathetic ? "border-agent-empathetic/20" : "border-agent-rational/20"
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-4">
          <AgentAvatar type={type} size="md" isTyping={isTyping} />
          <div>
            <h3
              className={cn(
                "font-display text-lg font-semibold",
                isEmpathetic ? "text-agent-empathetic" : "text-agent-rational"
              )}
            >
              {agentName}
            </h3>
            <p className="text-xs uppercase tracking-[0.24em] text-white/35">{agentTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/45">
          <span
            className={cn(
              "h-2 w-2 rounded-full animate-presence-ping",
              isEmpathetic ? "bg-agent-empathetic" : "bg-agent-rational"
            )}
          />
          {isTyping ? "Responding..." : "Present"}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 custom-scrollbar md:px-5"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <AgentAvatar type={type} size="lg" />
            <p className="mt-5 max-w-md font-display text-2xl text-white">
              {isEmpathetic ? "Take a breath and start anywhere." : "Bring the problem in plain words."}
            </p>
            <p className="mt-3 max-w-[420px] text-sm leading-7 text-white/58">
              {isEmpathetic
                ? "Sage listens first, reflects what matters, and helps you feel less alone in the moment."
                : "Atlas helps you untangle what happened, spot patterns, and turn the next step into something manageable."}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-white/28">
              {isEmpathetic ? "Softly attentive" : "Quietly alert"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                message={msg}
                showAvatar={msg.role === "assistant"}
              />
            ))}
          </div>
        )}
        
        {isTyping && (
          <div className="flex gap-3 items-start mt-2">
            <AgentAvatar type={type} size="sm" isTyping />
            <div className={cn(
              "rounded-2xl rounded-tl-md border border-white/10 bg-white/6 px-2 backdrop-blur-2xl",
              isEmpathetic ? "shadow-[0_0_50px_hsl(15_80%_65%_/_0.12)]" : "shadow-[0_0_50px_hsl(190_80%_55%_/_0.12)]"
            )}>
              <TypingIndicator agentType={type} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
