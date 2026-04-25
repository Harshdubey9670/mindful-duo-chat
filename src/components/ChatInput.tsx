import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="floating-input surface-noise rounded-[28px] border border-white/12 px-3 py-3 shadow-panel">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Talk about what happened, how it feels, or what you need help untangling..."
            disabled={isLoading}
            rows={1}
            className={cn(
              "flex-1 resize-none border-none bg-transparent px-3 py-3 text-sm leading-7 text-white/88 outline-none",
              "placeholder:text-white/34 focus:ring-0 focus:outline-none disabled:opacity-50"
            )}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl",
              "border border-cyan-300/30 bg-[linear-gradient(135deg,hsl(196_78%_58%),hsl(190_72%_54%))] text-slate-950",
              "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_hsl(196_78%_58%_/_0.35)]",
              "disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
          >
            <ArrowUp className={cn("h-5 w-5", isLoading && "animate-pulse-soft")} />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between px-3 pb-1">
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/28">Private-feel interface</p>
          <p className="text-xs text-white/36">{isLoading ? "Generating response..." : "Ready"}</p>
        </div>
      </div>
    </form>
  );
}
