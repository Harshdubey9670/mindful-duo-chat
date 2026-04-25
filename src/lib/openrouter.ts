const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";
const OPENROUTER_API_KEY = "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";

export interface Message {
  role: "user" | "assistant";
  content: string;
  agentType?: "empathetic" | "rational";
  timestamp: Date;
}

const EMPATHETIC_SYSTEM_PROMPT = `You are Sage, a premium mental wellness companion inside MindMate.

Your style:
- Warm, emotionally intelligent, and calming
- Validate the user's feelings before suggestions
- Ask thoughtful, gentle follow-up questions when useful
- Keep responses conversational, grounded, and human
- Avoid sounding clinical, robotic, or preachy
- Keep most replies to 2 short paragraphs
- End with a supportive question, reflection, or next step`;

const RATIONAL_SYSTEM_PROMPT = `You are Atlas, a clear-headed cognitive coach inside MindMate.

Your style:
- Calm, practical, and highly structured
- Use CBT-oriented thinking when it helps
- Identify patterns, distortions, and actionable next steps
- Be concise, direct, and supportive
- Avoid sounding cold or overly academic
- Keep most replies to 2 short paragraphs
- End with one concrete suggestion the user can try now`;

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function buildConversationContext(
  history: Message[],
  systemPrompt: string,
  userMessage: string
): OpenRouterMessage[] {
  return [
    { role: "system", content: systemPrompt },
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];
}

async function callOpenRouter(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "MindMate",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: buildConversationContext(conversationHistory, systemPrompt, userMessage),
      temperature: 0.8,
      top_p: 0.9,
      max_tokens: 900,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API error:", errorText);
    throw new Error(`OpenRouter request failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Invalid response structure from OpenRouter");
  }

  return content.trim();
}

export async function getAgentResponse(
  userMessage: string,
  agentType: "empathetic" | "rational",
  conversationHistory: Message[]
): Promise<string> {
  const systemPrompt = agentType === "empathetic" ? EMPATHETIC_SYSTEM_PROMPT : RATIONAL_SYSTEM_PROMPT;
  return callOpenRouter(systemPrompt, userMessage, conversationHistory);
}
