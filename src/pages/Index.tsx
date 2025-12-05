import { useState, useCallback, useRef } from "react";
import { Header } from "@/components/Header";
import { AgentPanel } from "@/components/AgentPanel";
import { AgentSelector } from "@/components/AgentSelector";
import { ChatInput } from "@/components/ChatInput";
import { getAgentResponse, type Message } from "@/lib/gemini";
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
        description: "Unable to connect to MINDMATE AI. Please try again.",
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
    <div className="min-h-screen flex flex-col bg-animate">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-700 ${
          selectedAgent === "empathetic" ? "bg-agent-empathetic/8" : "bg-agent-rational/8"
        }`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-700 ${
          selectedAgent === "empathetic" ? "bg-agent-empathetic/5" : "bg-agent-rational/5"
        }`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 max-w-3xl mx-auto w-full px-4 pb-4">
        <Header />
        
        {/* Agent Selector */}
        <AgentSelector selectedAgent={selectedAgent} onSelect={handleAgentChange} />

        {/* Single Agent Panel */}
        <div className="flex-1 min-h-[400px] my-4">
          <AgentPanel
            type={selectedAgent}
            messages={messages}
            isTyping={isLoading}
          />
        </div>

        {/* Chat Input */}
        <div className="max-w-2xl mx-auto w-full">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;