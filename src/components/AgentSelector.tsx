import { cn } from "@/lib/utils";

interface AgentSelectorProps {
  selectedAgent: "empathetic" | "rational";
  onSelect: (agent: "empathetic" | "rational") => void;
}

export function AgentSelector({ selectedAgent, onSelect }: AgentSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Choose agent</p>
      <button
        onClick={() => onSelect("empathetic")}
        className={cn(
          "group w-full rounded-[24px] border px-4 py-4 text-left transition-all duration-300",
          selectedAgent === "empathetic"
            ? "border-agent-empathetic/40 bg-agent-empathetic/14 text-white shadow-[0_20px_80px_hsl(15_80%_65%_/_0.18)]"
            : "border-white/10 bg-white/5 text-white/70 hover:border-agent-empathetic/30 hover:bg-agent-empathetic/8"
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-medium">Sage</p>
            <p className="mt-1 text-sm text-white/55">Empathetic companion for emotional grounding.</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sm text-white/80">
            SG
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelect("rational")}
        className={cn(
          "group w-full rounded-[24px] border px-4 py-4 text-left transition-all duration-300",
          selectedAgent === "rational"
            ? "border-agent-rational/40 bg-agent-rational/14 text-white shadow-[0_20px_80px_hsl(190_80%_55%_/_0.18)]"
            : "border-white/10 bg-white/5 text-white/70 hover:border-agent-rational/30 hover:bg-agent-rational/8"
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-medium">Atlas</p>
            <p className="mt-1 text-sm text-white/55">Cognitive coach for structure and action.</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sm text-white/80">
            AT
          </div>
        </div>
      </button>
    </div>
  );
}
