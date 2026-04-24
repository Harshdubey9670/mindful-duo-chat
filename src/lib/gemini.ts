const GEMINI_API_KEY = "AIzaSyDhbEa58awINxMAmHyEjlu8P6Er6jY79hs";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface Message {
  role: "user" | "assistant";
  content: string;
  agentType?: "empathetic" | "rational";
  timestamp: Date;
}

const EMPATHETIC_SYSTEM_PROMPT = `You are a warm, empathetic mental wellness companion named "Sage" from MINDMATE AI. Your approach is:
- Deeply compassionate and emotionally attuned
- You validate feelings before offering any suggestions
- You use warm, nurturing language
- You reflect back what you hear to show understanding
- You ask gentle, open-ended questions to help explore emotions
- You never minimize or dismiss feelings
- You create a safe, non-judgmental space
- You acknowledge the courage it takes to share
- Keep responses conversational and around 2-3 paragraphs
- Use occasional gentle affirmations like "I hear you" or "That sounds really difficult"
- End with an inviting question or gentle reflection

Remember: You're having a conversation, not giving a lecture. Be present with the person.`;

const RATIONAL_SYSTEM_PROMPT = `You are a supportive cognitive behavioral coach named "Atlas" from MINDMATE AI. Your approach is:
- Grounded in CBT (Cognitive Behavioral Therapy) principles
- You help identify thought patterns and cognitive distortions
- You offer practical, actionable strategies
- You use clear, structured communication
- You gently challenge unhelpful thinking patterns
- You provide evidence-based coping techniques
- You help reframe situations constructively
- You encourage small, achievable steps
- Keep responses focused and around 2-3 paragraphs
- Use phrases like "Let's look at this together" or "One thing that might help..."
- End with a concrete suggestion or technique to try

Remember: Balance logic with warmth. Guide without being preachy. Empower, don't lecture.`;

function buildConversationContext(history: Message[]): Array<{ role: string; parts: Array<{ text: string }> }> {
  return history.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));
}

async function callGemini(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> {
  const contents = [
    {
      role: "user",
      parts: [{ text: systemPrompt }],
    },
    {
      role: "model",
      parts: [{ text: "I understand my role and will respond accordingly. I'm here to help." }],
    },
    ...buildConversationContext(conversationHistory),
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API error:", errorText);
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error("Invalid response structure from Gemini");
  }

  return data.candidates[0].content.parts[0].text;
}

export async function getAgentResponse(
  userMessage: string,
  agentType: "empathetic" | "rational",
  conversationHistory: Message[]
): Promise<string> {
  const systemPrompt = agentType === "empathetic" ? EMPATHETIC_SYSTEM_PROMPT : RATIONAL_SYSTEM_PROMPT;
  return callGemini(systemPrompt, userMessage, conversationHistory);
}
