import { cn } from "@/lib/utils";

interface AgentAvatarProps {
  type: "empathetic" | "rational";
  size?: "sm" | "md" | "lg";
  isTyping?: boolean;
}

export function AgentAvatar({ type, size = "md", isTyping = false }: AgentAvatarProps) {
  const sizeClasses = {
    sm: "h-9 w-9 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base",
  };

  const isEmpathetic = type === "empathetic";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full border font-display font-semibold uppercase tracking-[0.24em] transition-all duration-300",
        sizeClasses[size],
        isEmpathetic
          ? "border-agent-empathetic/25 bg-[radial-gradient(circle_at_top,hsl(15_80%_75%_/_0.36),transparent_45%),linear-gradient(135deg,hsl(15_80%_65%_/_0.24),hsl(228_20%_14%_/_0.94))] text-white"
          : "border-agent-rational/25 bg-[radial-gradient(circle_at_top,hsl(190_90%_75%_/_0.34),transparent_45%),linear-gradient(135deg,hsl(190_80%_55%_/_0.24),hsl(228_20%_14%_/_0.94))] text-white",
        isTyping && "avatar-pulse"
      )}
      style={{
        boxShadow: isTyping
          ? `0 0 25px ${isEmpathetic ? "hsl(15 80% 65% / 0.4)" : "hsl(190 80% 55% / 0.4)"}`
          : `0 0 15px ${isEmpathetic ? "hsl(15 80% 65% / 0.2)" : "hsl(190 80% 55% / 0.2)"}`,
      }}
    >
      <div
        className={cn(
          "absolute inset-[3px] rounded-full border opacity-60",
          isEmpathetic
            ? "border-agent-empathetic/20"
            : "border-agent-rational/20"
        )}
      />

      <span className="relative z-10">
        {isEmpathetic ? "SG" : "AT"}
      </span>
    </div>
  );
}
