import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="text-center py-6 px-4">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Sparkles className="w-6 h-6 text-primary animate-pulse-soft" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gradient header-glow">
          AI Mental Wellness Chat Bot
        </h1>
        <Sparkles className="w-6 h-6 text-primary animate-pulse-soft" />
      </div>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Two AI companions ready to support you — one with warmth and empathy, 
        the other with practical cognitive strategies.
      </p>
    </header>
  );
}
