import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
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
      <div className="floating-input rounded-2xl p-2 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share what's on your mind..."
          disabled={isLoading}
          rows={1}
          className={cn(
            "flex-1 bg-transparent border-none outline-none resize-none",
            "text-foreground placeholder:text-muted-foreground",
            "px-4 py-3 text-sm leading-relaxed",
            "focus:ring-0 focus:outline-none",
            "disabled:opacity-50"
          )}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={cn(
            "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center",
            "bg-primary text-primary-foreground",
            "transition-all duration-200",
            "hover:scale-105 hover:shadow-lg hover:shadow-primary/30",
            "disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none",
            "focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
        >
          <Send className={cn("w-5 h-5", isLoading && "animate-pulse-soft")} />
        </button>
      </div>
    </form>
  );
}
