import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface VoiceState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
}

export function useVoice(onEmergencyCommand?: () => void) {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    transcript: ''
  });
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const startListening = useCallback(() => {
    if (!voiceState.isSupported) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive"
      });
      return;
    }

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setVoiceState(prev => ({ ...prev, isListening: true }));
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        setVoiceState(prev => ({ ...prev, transcript }));
        
        if (transcript.includes('help me') || transcript.includes('emergency')) {
          onEmergencyCommand?.();
          stopListening();
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setVoiceState(prev => ({ ...prev, isListening: false }));
        
        if (event.error !== 'aborted') {
          toast({
            title: "Voice Recognition Error",
            description: "There was an error with voice recognition",
            variant: "destructive"
          });
        }
      };

      recognition.onend = () => {
        setVoiceState(prev => ({ ...prev, isListening: false }));
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      toast({
        title: "Voice Recognition Failed",
        description: "Could not start voice recognition",
        variant: "destructive"
      });
    }
  }, [voiceState.isSupported, onEmergencyCommand, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setVoiceState(prev => ({ ...prev, isListening: false }));
  }, []);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const testVoice = useCallback(() => {
    speak('Emergency alert activated. Help is on the way.');
  }, [speak]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    voiceState,
    startListening,
    stopListening,
    speak,
    testVoice
  };
}
