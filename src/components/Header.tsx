import { Brain } from "lucide-react";

export function Header() {
  return (
    <header className="text-center py-6 px-4">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Brain className="w-8 h-8 text-primary animate-pulse-soft" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gradient header-glow">
          MINDMATE AI
        </h1>
      </div>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Your intelligent companion for mental wellness
      </p>
      <p className="text-xs text-muted-foreground/60 mt-1">
        Made by Harsh Dubey • Powered by TV
      </p>
    </header>
  );
}