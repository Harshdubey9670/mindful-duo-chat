import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/gemini";
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
        "flex flex-col h-full rounded-2xl overflow-hidden",
        isEmpathetic ? "glass-empathetic glow-empathetic" : "glass-rational glow-rational"
      )}
    >
      {/* Agent Header */}
      <div className="flex items-center gap-4 p-5 border-b border-border/30">
        <AgentAvatar type={type} size="md" isTyping={isTyping} />
        <div>
          <h3
            className={cn(
              "font-display font-semibold text-lg",
              isEmpathetic ? "text-agent-empathetic" : "text-agent-rational"
            )}
          >
            {agentName}
          </h3>
          <p className="text-xs text-muted-foreground">{agentTitle}</p>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <AgentAvatar type={type} size="lg" />
            <p className="mt-4 text-sm text-muted-foreground max-w-[200px]">
              {isEmpathetic
                ? "I'm here to listen and support you with warmth and understanding."
                : "I'm here to help you find clarity through practical strategies."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
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
          <div className="flex gap-3 items-start">
            <AgentAvatar type={type} size="sm" isTyping />
            <div className={cn(
              "rounded-2xl rounded-tl-md glass-card px-2",
              isEmpathetic ? "glass-empathetic" : "glass-rational"
            )}>
              <TypingIndicator agentType={type} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
