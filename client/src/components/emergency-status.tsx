import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Mic, Volume2, Keyboard, Shield, Activity } from 'lucide-react';
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
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-[hsl(74,100%,40%)]/50 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-semibold text-white">System Status</h3>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-2xl font-bold text-green-400 mb-2">
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
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-[hsl(74,100%,40%)]/50 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[hsl(74,100%,40%)]/20 rounded-lg">
                <MapPin className="w-5 h-5 text-[hsl(74,100%,40%)]" />
              </div>
              <h3 className="font-semibold text-white">Location</h3>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              location.loading ? 'bg-yellow-500 animate-pulse' : 
              location.error ? 'bg-red-500' : 'bg-green-500'
            }`}></div>
          </div>
          <p className="text-lg font-bold mb-2 text-white truncate">
            {formatLocation()}
          </p>
          <p className="text-sm text-slate-400">
            {location.loading ? 'Getting location...' : 
             location.error ? 'Location unavailable' : 'Location ready'}
          </p>
        </CardContent>
      </Card>

      {/* Voice Commands */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-[hsl(74,100%,40%)]/50 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Mic className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">Voice Commands</h3>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              voiceState.isListening ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
            }`}></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Status</span>
              <Badge variant={voiceState.isListening ? "default" : "secondary"} 
                     className={voiceState.isListening ? "bg-green-600 text-white" : ""}>
                {voiceState.isListening ? 'Listening' : 'Inactive'}
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
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 hover:border-[hsl(74,100%,40%)]/50 transition-all duration-300 lg:col-span-3">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[hsl(74,100%,40%)]/20 rounded-lg">
                <Keyboard className="w-6 h-6 text-[hsl(74,100%,40%)]" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Keyboard Emergency Trigger</h3>
                <p className="text-sm text-slate-400">Double-press 'V' key for instant emergency alert</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-green-400 animate-pulse" />
              <Badge className="bg-green-900/30 text-green-400 border-green-700 px-3 py-1">
                Active & Monitoring
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
