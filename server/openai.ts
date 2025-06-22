import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  message: string;
  timestamp: Date;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  userSettings?: any
): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are a Crisis Manager AI Assistant, designed to help users in emergency and crisis situations. Your role is to:

1. Provide calm, professional guidance during emergencies
2. Help users understand and use the Crisis Manager system
3. Offer practical advice for emergency preparedness
4. Assist with emergency contact management
5. Provide information about emergency procedures

Tone: ${userSettings?.aiTone || 'calm'} and reassuring
Context awareness: ${userSettings?.contextAwareness ? 'Consider user history and patterns' : 'Focus on immediate needs'}
Auto-escalation: ${userSettings?.autoEscalation ? 'Escalate serious situations automatically' : 'Wait for user direction'}

Always prioritize user safety and provide actionable advice. If you detect a real emergency, guide the user to use the emergency alert features or contact emergency services directly.`;

    const openaiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: openaiMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return {
      message: response.choices[0].message.content || "I'm sorry, I couldn't generate a response.",
      timestamp: new Date()
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function analyzeEmergencyPrompt(prompt: string): Promise<{
  isEmergency: boolean;
  severity: 'low' | 'medium' | 'high';
  suggestedActions: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze the following message for emergency indicators. Respond with JSON in this format:
          {
            "isEmergency": boolean,
            "severity": "low" | "medium" | "high",
            "suggestedActions": ["action1", "action2"]
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 200,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      isEmergency: result.isEmergency || false,
      severity: result.severity || 'low',
      suggestedActions: result.suggestedActions || []
    };
  } catch (error) {
    console.error("Emergency analysis error:", error);
    return {
      isEmergency: false,
      severity: 'low',
      suggestedActions: []
    };
  }
}