import { cn } from "@/lib/utils";
import { Heart, Brain } from "lucide-react";

interface AgentSelectorProps {
  selectedAgent: "empathetic" | "rational";
  onSelect: (agent: "empathetic" | "rational") => void;
}

export function AgentSelector({ selectedAgent, onSelect }: AgentSelectorProps) {
  return (
    <div className="flex justify-center gap-2 p-2">
      <button
        onClick={() => onSelect("empathetic")}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm",
          selectedAgent === "empathetic"
            ? "bg-agent-empathetic/20 text-agent-empathetic border border-agent-empathetic/40 shadow-lg shadow-agent-empathetic/20"
            : "glass-card text-muted-foreground hover:text-agent-empathetic hover:bg-agent-empathetic/10"
        )}
      >
        <Heart className="w-4 h-4" />
        <span>Sage</span>
        <span className="hidden sm:inline text-xs opacity-70">• Empathetic</span>
      </button>
      
      <button
        onClick={() => onSelect("rational")}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm",
          selectedAgent === "rational"
            ? "bg-agent-rational/20 text-agent-rational border border-agent-rational/40 shadow-lg shadow-agent-rational/20"
            : "glass-card text-muted-foreground hover:text-agent-rational hover:bg-agent-rational/10"
        )}
      >
        <Brain className="w-4 h-4" />
        <span>Atlas</span>
        <span className="hidden sm:inline text-xs opacity-70">• Cognitive</span>
      </button>
    </div>
  );
}