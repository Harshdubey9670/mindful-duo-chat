import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  agentType: "empathetic" | "rational";
}

export function TypingIndicator({ agentType }: TypingIndicatorProps) {
  const isEmpathetic = agentType === "empathetic";

  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div
        className={cn(
          "typing-dot",
          isEmpathetic ? "text-agent-empathetic" : "text-agent-rational"
        )}
      />
      <div
        className={cn(
          "typing-dot",
          isEmpathetic ? "text-agent-empathetic" : "text-agent-rational"
        )}
      />
      <div
        className={cn(
          "typing-dot",
          isEmpathetic ? "text-agent-empathetic" : "text-agent-rational"
        )}
      />
    </div>
  );
}
