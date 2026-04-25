import { useState, useCallback, useRef } from "react";
import { Header } from "@/components/Header";
import { AgentPanel } from "@/components/AgentPanel";
import { AgentSelector } from "@/components/AgentSelector";
import { ChatInput } from "@/components/ChatInput";
import { getAgentResponse, type Message } from "@/lib/openrouter";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<"empathetic" | "rational">("empathetic");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const debounceRef = useRef<boolean>(false);

  const handleSendMessage = useCallback(async (userMessage: string) => {
    if (debounceRef.current || isLoading) return;
    debounceRef.current = true;
    setTimeout(() => { debounceRef.current = false; }, 500);

    const timestamp = new Date();
    const userMsg: Message = {
      role: "user",
      content: userMessage,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await getAgentResponse(userMessage, selectedAgent, messages);

      const agentResponse: Message = {
        role: "assistant",
        content: response,
        agentType: selectedAgent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentResponse]);
    } catch (error) {
      console.error("Error getting response:", error);
      toast({
        title: "Connection Issue",
        description: "Unable to connect to MindMate. Please try again.",
        variant: "destructive",
      });
      
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [messages, selectedAgent, isLoading, toast]);

  const handleAgentChange = (agent: "empathetic" | "rational") => {
    if (agent !== selectedAgent) {
      setSelectedAgent(agent);
      setMessages([]);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-animate">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(196_100%_72%_/_0.16),transparent_30%),radial-gradient(circle_at_bottom_right,hsl(192_68%_58%_/_0.12),transparent_25%),linear-gradient(180deg,hsl(224_41%_8%),hsl(228_45%_5%))]" />
        <div className="absolute left-[10%] top-16 h-72 w-72 rounded-full border border-white/10 bg-white/5 blur-3xl animate-drift-slow" />
        <div className={`absolute right-[8%] top-[18%] h-96 w-96 rounded-full blur-3xl transition-all duration-700 animate-breathe ${
          selectedAgent === "empathetic" ? "bg-agent-empathetic/12" : "bg-agent-rational/12"
        }`} />
        <div className="absolute bottom-[-10%] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl animate-drift-reverse" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(hsl(0_0%_100%_/_0.05)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%_/_0.05)_1px,transparent_1px)] [background-size:100px_100px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-6 pt-4 md:px-6 lg:px-8">
        <Header
          selectedAgent={selectedAgent}
          isLoading={isLoading}
          hasMessages={messages.length > 0}
        />

        <section className="grid flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="glass-panel surface-noise aurora-shell order-2 rounded-[28px] border border-white/12 p-4 shadow-panel lg:order-1">
            <AgentSelector selectedAgent={selectedAgent} onSelect={handleAgentChange} />

            <div className="mt-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Current mode</p>
              <h2 className="mt-3 font-display text-2xl text-white">
                {selectedAgent === "empathetic" ? "Sage helps you slow down." : "Atlas helps you think clearly."}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/65">
                {selectedAgent === "empathetic"
                  ? "A softer conversational mode for emotional check-ins, validation, and calmer reflection."
                  : "A sharper coaching mode for structure, reframing, and practical next steps."}
              </p>
              <p className="mt-3 text-sm text-white/44">
                {isLoading
                  ? "You can feel the interface shift when a response is forming."
                  : messages.length > 0
                    ? "The atmosphere adapts as the conversation deepens."
                    : "Everything is intentionally quiet until you begin."}
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Response tone</p>
                <p className="mt-2 text-sm text-white/75">
                  {selectedAgent === "empathetic" ? "Reflective and warm" : "Focused and analytical"}
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Best for</p>
                <p className="mt-2 text-sm text-white/75">
                  {selectedAgent === "empathetic" ? "Emotional support" : "Clarity and reframing"}
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Input hint</p>
                <p className="mt-2 text-sm text-white/75">Press Enter to send, Shift + Enter for a new line.</p>
              </div>
            </div>
          </div>

          <div className="order-1 flex min-h-[540px] flex-col gap-4 lg:order-2">
            <AgentPanel
              type={selectedAgent}
              messages={messages}
              isTyping={isLoading}
            />

            <div className="mx-auto w-full max-w-4xl">
              <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        </section>

        <footer className="px-2 pb-2 pt-5 text-center text-sm text-white/42">
          Made by Harsh Dubey
        </footer>
      </div>
    </div>
  );
};

export default Index;
