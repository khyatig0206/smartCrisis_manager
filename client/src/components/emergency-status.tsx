import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Mic, Volume2, Keyboard } from 'lucide-react';
import { useLocation } from '@/hooks/use-location';
import { useVoice } from '@/hooks/use-voice';
import { useEmergency } from '@/hooks/use-emergency';

export function EmergencyStatus() {
  const { location, formatLocation } = useLocation();
  const { emergencyState } = useEmergency();
  const { voiceState, startListening, stopListening, testVoice } = useVoice();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* System Status */}
      <Card className="crisis-surface border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">System Status</h3>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-2xl font-bold text-green-500 mb-2">
            {emergencyState.status === 'safe' ? 'Online' : 
             emergencyState.status === 'alert' ? 'Alert' : 'Sending'}
          </p>
          <p className="text-sm text-slate-400">
            {emergencyState.status === 'safe' ? 'All systems operational' : 
             emergencyState.status === 'alert' ? 'Emergency triggered' : 'Sending emergency alert'}
          </p>
        </CardContent>
      </Card>

      {/* Location Status */}
      <Card className="crisis-surface border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Location</h3>
            <MapPin className="w-5 h-5 text-[hsl(74,100%,40%)]" />
          </div>
          <p className="text-lg font-bold mb-2 text-white">
            {formatLocation()}
          </p>
          <p className="text-sm text-slate-400">
            {location.loading ? 'Getting location...' : 
             location.error ? 'Location unavailable' : 'Location ready'}
          </p>
        </CardContent>
      </Card>

      {/* Voice Commands */}
      <Card className="crisis-surface border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Voice Commands</h3>
            <Mic className="w-5 h-5 text-[hsl(74,100%,40%)]" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Listening</span>
              <Badge variant={voiceState.isListening ? "default" : "secondary"}>
                {voiceState.isListening ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={voiceState.isListening ? "destructive" : "default"}
                onClick={voiceState.isListening ? stopListening : startListening}
                disabled={!voiceState.isSupported}
                className="flex-1"
              >
                <Mic className="w-4 h-4 mr-1" />
                {voiceState.isListening ? 'Stop' : 'Listen'}
              </Button>
              <Button size="sm" variant="outline" onClick={testVoice} className="flex-1">
                <Volume2 className="w-4 h-4 mr-1" />
                Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Trigger */}
      <Card className="crisis-surface border lg:col-span-3">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Keyboard className="w-6 h-6 text-[hsl(74,100%,40%)]" />
              <div>
                <h3 className="font-semibold text-white">Keyboard Trigger</h3>
                <p className="text-sm text-slate-400">Double-press 'V' key detection</p>
              </div>
            </div>
            <Badge className="bg-green-900/30 text-green-400 border-green-700">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
