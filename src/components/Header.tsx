interface HeaderProps {
  selectedAgent: "empathetic" | "rational";
  isLoading: boolean;
  hasMessages: boolean;
}

export function Header({ selectedAgent, isLoading, hasMessages }: HeaderProps) {
  const statusText = isLoading
    ? "MindMate is listening closely."
    : hasMessages
      ? "The room is open and responsive."
      : "MindMate is awake and waiting for you.";

  return (
    <header className="mb-4 px-1 py-4 md:mb-6">
      <div className="glass-panel surface-noise aurora-shell rounded-[28px] border border-white/12 px-5 py-5 shadow-panel">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-white/45">MindMate</p>
            <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
              A living room for thoughts that need warmth, clarity, and motion.
            </h1>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 backdrop-blur-xl">
            <span
              className={`h-2.5 w-2.5 rounded-full ${selectedAgent === "empathetic" ? "bg-agent-empathetic" : "bg-agent-rational"} animate-presence-ping`}
            />
            <span>{statusText}</span>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 md:text-base">
          Switch between a softer emotional presence and a sharper coaching presence inside one immersive interface.
        </p>
      </div>
    </header>
  );
}
