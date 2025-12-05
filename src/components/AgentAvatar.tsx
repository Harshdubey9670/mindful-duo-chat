import { cn } from "@/lib/utils";

interface AgentAvatarProps {
  type: "empathetic" | "rational";
  size?: "sm" | "md" | "lg";
  isTyping?: boolean;
}

export function AgentAvatar({ type, size = "md", isTyping = false }: AgentAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-2xl",
  };

  const isEmpathetic = type === "empathetic";

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center font-display font-semibold transition-all duration-300",
        sizeClasses[size],
        isEmpathetic
          ? "bg-gradient-to-br from-agent-empathetic/30 to-agent-empathetic/10 text-agent-empathetic"
          : "bg-gradient-to-br from-agent-rational/30 to-agent-rational/10 text-agent-rational",
        isTyping && "avatar-pulse"
      )}
      style={{
        boxShadow: isTyping
          ? `0 0 25px ${isEmpathetic ? "hsl(15 80% 65% / 0.4)" : "hsl(190 80% 55% / 0.4)"}`
          : `0 0 15px ${isEmpathetic ? "hsl(15 80% 65% / 0.2)" : "hsl(190 80% 55% / 0.2)"}`,
      }}
    >
      {/* Inner glow ring */}
      <div
        className={cn(
          "absolute inset-0.5 rounded-full opacity-50",
          isEmpathetic
            ? "bg-gradient-to-br from-agent-empathetic/20 to-transparent"
            : "bg-gradient-to-br from-agent-rational/20 to-transparent"
        )}
      />
      
      {/* Avatar icon */}
      <span className="relative z-10">
        {isEmpathetic ? "🌸" : "💎"}
      </span>
    </div>
  );
}
