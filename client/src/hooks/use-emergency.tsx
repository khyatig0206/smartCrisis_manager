import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface EmergencyState {
  status: 'safe' | 'alert' | 'sending';
  lastAlert?: Date;
}

interface TriggerAlertParams {
  alertType: 'keyboard' | 'voice' | 'manual';
  location?: string;
  message?: string;
}

export function useEmergency() {
  const [emergencyState, setEmergencyState] = useState<EmergencyState>({
    status: 'safe'
  });
  const [keyPressCount, setKeyPressCount] = useState(0);
  const [keyPressTimer, setKeyPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const triggerAlertMutation = useMutation({
    mutationFn: async (params: TriggerAlertParams) => {
      const response = await apiRequest('POST', '/api/trigger-alert', params);
      return response.json();
    },
    onSuccess: (data) => {
      setEmergencyState({
        status: 'safe',
        lastAlert: new Date()
      });
      toast({
        title: "Emergency Alert Sent",
        description: `Alert sent to ${data.contactsNotified} emergency contacts`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/alert-logs'] });
    },
    onError: (error) => {
      setEmergencyState({ status: 'safe' });
      toast({
        title: "Alert Failed",
        description: "Failed to send emergency alert. Please try again.",
        variant: "destructive",
      });
    }
  });

  const triggerAlert = useCallback(async (params: TriggerAlertParams) => {
    setEmergencyState({ status: 'alert' });
    
    // Get current location
    if (navigator.geolocation && !params.location) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            enableHighAccuracy: true
          });
        });
        
        params.location = JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      } catch (error) {
        console.warn('Could not get location:', error);
      }
    }
    
    setEmergencyState({ status: 'sending' });
    triggerAlertMutation.mutate(params);
  }, [triggerAlertMutation]);

  // Double-press V key detection
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key && event.key.toLowerCase() === 'v') {
        setKeyPressCount(prev => prev + 1);
        
        if (keyPressTimer) {
          clearTimeout(keyPressTimer);
        }
        
        const timer = setTimeout(() => {
          setKeyPressCount(0);
        }, 500);
        setKeyPressTimer(timer);
        
        // Check if this is the second press
        if (keyPressCount === 1) {
          triggerAlert({
            alertType: 'keyboard',
            message: 'Emergency alert triggered via keyboard shortcut'
          });
          setKeyPressCount(0);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (keyPressTimer) {
        clearTimeout(keyPressTimer);
      }
    };
  }, [keyPressCount, keyPressTimer, triggerAlert]);

  return {
    emergencyState,
    triggerAlert,
    isTriggering: triggerAlertMutation.isPending
  };
}
