import { useState, useCallback, useRef } from "react";
import { Header } from "@/components/Header";
import { AgentPanel } from "@/components/AgentPanel";
import { ChatInput } from "@/components/ChatInput";
import { getAgentResponses, type Message, type ConversationHistory } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory>({
    empathetic: [],
    rational: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const debounceRef = useRef<boolean>(false);

  const handleSendMessage = useCallback(async (userMessage: string) => {
    // Debounce protection
    if (debounceRef.current || isLoading) return;
    debounceRef.current = true;
    setTimeout(() => { debounceRef.current = false; }, 500);

    const timestamp = new Date();
    const userMsg: Message = {
      role: "user",
      content: userMessage,
      timestamp,
    };

    // Add user message to both agent histories
    setConversationHistory((prev) => ({
      empathetic: [...prev.empathetic, userMsg],
      rational: [...prev.rational, userMsg],
    }));

    setIsLoading(true);

    try {
      const responses = await getAgentResponses(userMessage, conversationHistory);

      const empatheticResponse: Message = {
        role: "assistant",
        content: responses.empathetic,
        agentType: "empathetic",
        timestamp: new Date(),
      };

      const rationalResponse: Message = {
        role: "assistant",
        content: responses.rational,
        agentType: "rational",
        timestamp: new Date(),
      };

      setConversationHistory((prev) => ({
        empathetic: [...prev.empathetic, empatheticResponse],
        rational: [...prev.rational, rationalResponse],
      }));
    } catch (error) {
      console.error("Error getting responses:", error);
      toast({
        title: "Connection Issue",
        description: "Unable to connect to the AI. Please try again in a moment.",
        variant: "destructive",
      });
      
      // Remove the user message on error
      setConversationHistory((prev) => ({
        empathetic: prev.empathetic.slice(0, -1),
        rational: prev.rational.slice(0, -1),
      }));
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory, isLoading, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-animate">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-agent-empathetic/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-agent-rational/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 pb-4">
        <Header />

        {/* Agent Panels */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 min-h-0">
          <div className="min-h-[400px] lg:min-h-0">
            <AgentPanel
              type="empathetic"
              messages={conversationHistory.empathetic}
              isTyping={isLoading}
            />
          </div>
          <div className="min-h-[400px] lg:min-h-0">
            <AgentPanel
              type="rational"
              messages={conversationHistory.rational}
              isTyping={isLoading}
            />
          </div>
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
