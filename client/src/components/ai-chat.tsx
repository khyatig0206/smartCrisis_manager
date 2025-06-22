import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  Shield,
  MessageCircle,
  Loader2
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emergencyDetected?: boolean;
  severity?: 'low' | 'medium' | 'high';
  suggestedActions?: string[];
}

export function AIChatSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Crisis Manager AI Assistant. I\'m here to help you with emergency guidance, system questions, and crisis management advice. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', {
        message,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        }))
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(data.timestamp),
        emergencyDetected: data.emergencyDetected,
        severity: data.severity,
        suggestedActions: data.suggestedActions
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.emergencyDetected) {
        toast({
          title: "Emergency Detected",
          description: `The AI detected a potential ${data.severity} severity emergency. Consider using the emergency alert system.`,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Chat Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getMessageIcon = (role: string) => {
    return role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />;
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-900/30 text-red-400 border-red-700';
      case 'medium':
        return 'bg-orange-900/30 text-orange-400 border-orange-700';
      case 'low':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      default:
        return 'bg-slate-900/30 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">AI Assistant</h2>
        <p className="text-slate-400">Chat with your intelligent crisis management assistant</p>
      </div>

      {/* Chat Interface */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-white">
            <MessageCircle className="w-5 h-5 text-[hsl(74,100%,40%)]" />
            <span>Crisis Manager AI</span>
            <Badge className="bg-green-900/30 text-green-400 border-green-700">Online</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea 
            ref={scrollAreaRef}
            className="flex-1 px-6 pb-4"
          >
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="space-y-2">
                  <div className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    {message.role === 'assistant' && (
                      <div className="p-2 bg-[hsl(74,100%,40%)]/20 rounded-full">
                        {getMessageIcon(message.role)}
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${
                      message.role === 'user' ? 'order-first' : ''
                    }`}>
                      <div className={`p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-[hsl(74,100%,40%)] text-black ml-auto' 
                          : 'bg-slate-700 text-white'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      
                      <p className="text-xs text-slate-400 mt-1 px-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="p-2 bg-slate-600 rounded-full">
                        {getMessageIcon(message.role)}
                      </div>
                    )}
                  </div>

                  {/* Emergency Detection Alert */}
                  {message.emergencyDetected && (
                    <Alert className="bg-red-900/20 border-red-700 mx-6">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-300">
                        <div className="flex items-center justify-between">
                          <span>Emergency detected in your message</span>
                          <Badge className={getSeverityColor(message.severity)}>
                            {message.severity} severity
                          </Badge>
                        </div>
                        {message.suggestedActions && message.suggestedActions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-red-400 mb-1">Suggested actions:</p>
                            <ul className="text-xs space-y-1">
                              {message.suggestedActions.map((action, idx) => (
                                <li key={idx} className="flex items-center space-x-1">
                                  <Shield className="w-3 h-3" />
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
              
              {/* Loading indicator */}
              {chatMutation.isPending && (
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-[hsl(74,100%,40%)]/20 rounded-full">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-700 text-white p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about crisis management, emergencies, or how to use this system..."
                className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                disabled={chatMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || chatMutation.isPending}
                className="bg-[hsl(74,100%,40%)] hover:bg-[hsl(74,100%,35%)] text-black"
              >
                {chatMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("How do I add emergency contacts?")}
                className="text-xs border-slate-600 text-gray-700 hover:bg-slate-500"
              >
                How to add contacts?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("What should I do in a medical emergency?")}
                className="text-xs border-slate-600 text-gray-700 hover:bg-slate-500"
              >
                Medical emergency help
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("How does the keyboard trigger work?")}
                className="text-xs border-slate-600 text-gray-700 hover:bg-slate-500"
              >
                Keyboard triggers
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}