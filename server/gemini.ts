import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
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

  // Gemini expects an array of "contents"
  const prompt = [
    { role: "user", parts: [{ text: systemPrompt }] },
    ...messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }))
  ];

  const body = {
    contents: prompt,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500
    }
  };

  try {
    const response = await axios.post(GEMINI_API_URL, body, {
      headers: { 'Content-Type': 'application/json' }
    });
    const message = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    return {
      message,
      timestamp: new Date()
    };
  } catch (error) {
    console.error("Gemini API error:", error?.response?.data || error.message);
    throw new Error("Failed to generate Gemini AI response");
  }
}


export async function analyzeEmergencyPrompt(prompt: string): Promise<{
  isEmergency: boolean;
  severity: 'low' | 'medium' | 'high';
  suggestedActions: string[];
}> {
  const systemPrompt = `Analyze the following message for emergency indicators. Respond ONLY with JSON in this format:
{
  "isEmergency": boolean,
  "severity": "low" | "medium" | "high",
  "suggestedActions": ["action1", "action2"]
}`;

  const body = {
    contents: [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "user", parts: [{ text: prompt }] }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 200
    }
  };

  try {
    const response = await axios.post(GEMINI_API_URL, body, {
      headers: { 'Content-Type': 'application/json' }
    });
    // Try to extract and parse JSON from the response
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    return {
      isEmergency: result.isEmergency || false,
      severity: result.severity || 'low',
      suggestedActions: result.suggestedActions || []
    };
  } catch (error) {
    console.error("Gemini Emergency analysis error:", error?.response?.data || error.message);
    return {
      isEmergency: false,
      severity: 'low',
      suggestedActions: []
    };
  }
}

