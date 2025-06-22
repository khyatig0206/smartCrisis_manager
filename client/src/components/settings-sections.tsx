import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function AISettingsSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: settings } = useQuery({
    queryKey: ['/api/user-settings'],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      const response = await apiRequest('PUT', '/api/user-settings', newSettings);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Settings updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/user-settings'] });
    },
  });

  const handleSettingChange = (key: string, value: any) => {
    updateSettingsMutation.mutate({ [key]: value });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">AI Settings</h2>
        <p className="text-slate-400">Configure AI response behavior and tone for emergency situations</p>
      </div>

      <Card className="crisis-surface border">
        <CardHeader>
          <CardTitle className="text-white">Response Tone</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={settings?.aiTone || 'calm'}
            onValueChange={(value) => handleSettingChange('aiTone', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="calm" id="calm" />
              <Label htmlFor="calm" className="text-white">Calm & Reassuring</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="urgent" id="urgent" />
              <Label htmlFor="urgent" className="text-white">Direct & Urgent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="professional" id="professional" />
              <Label htmlFor="professional" className="text-white">Professional & Clinical</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="crisis-surface border">
        <CardHeader>
          <CardTitle className="text-white">AI Behavior Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Auto-escalation</Label>
              <p className="text-sm text-slate-400">Automatically escalate based on severity</p>
            </div>
            <Switch
              checked={settings?.autoEscalation ?? true}
              onCheckedChange={(checked) => handleSettingChange('autoEscalation', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Context awareness</Label>
              <p className="text-sm text-slate-400">Consider user history and patterns</p>
            </div>
            <Switch
              checked={settings?.contextAwareness ?? true}
              onCheckedChange={(checked) => handleSettingChange('contextAwareness', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function GestureSettingsSection() {
  const [gestures, setGestures] = useState([
    { gesture: 'Triple Tap', action: 'Emergency SOS' },
    { gesture: 'Double Tap', action: 'Volume Control' },
  ]);

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Gesture Settings</h2>
        <p className="text-slate-400">Configure gesture controls for emergency actions</p>
      </div>

      <Card className="crisis-surface border">
        <CardHeader>
          <CardTitle className="text-white">Gesture Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {gestures.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Select defaultValue={item.gesture}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Triple Tap">Triple Tap</SelectItem>
                  <SelectItem value="Double Tap">Double Tap</SelectItem>
                  <SelectItem value="Long Press">Long Press</SelectItem>
                  <SelectItem value="Shake">Shake</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-slate-400">→</span>
              <Input defaultValue={item.action} className="flex-1" />
              <Button className="crisis-accent">Save</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function AutomationRulesSection() {
  const rules = [
    {
      name: 'Chest Pain Alert',
      condition: 'If symptom = chest pain → notify emergency contacts',
      status: 'Active'
    },
    {
      name: 'Location-based Alert',
      condition: 'If location = high-risk area → increase monitoring',
      status: 'Active'
    }
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Automation Rules</h2>
        <p className="text-slate-400">Define triggers and automated responses</p>
      </div>

      <Card className="crisis-surface border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Active Rules</CardTitle>
          <Button className="crisis-accent">Add Rule</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{rule.name}</p>
                  <p className="text-sm text-slate-400">{rule.condition}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-900/30 text-green-400 border-green-700">
                    {rule.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ChatHistorySection() {
  const { data: alertLogs, isLoading } = useQuery({
    queryKey: ['/api/alert-logs'],
  });

  const exportHistory = () => {
    const data = JSON.stringify(alertLogs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crisis-manager-history.json';
    a.click();
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Chat History</h2>
        <p className="text-slate-400">View and export past conversations</p>
      </div>

      <Card className="crisis-surface border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <Button variant="outline" onClick={exportHistory}>
            Export History
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(74,100%,40%)] mx-auto"></div>
            </div>
          ) : alertLogs?.length > 0 ? (
            <div className="space-y-3">
              {alertLogs.map((log: any) => (
                <div key={log.id} className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                    <Badge 
                      className={`${
                        log.status === 'sent' ? 'bg-green-900/30 text-green-400 border-green-700' :
                        log.status === 'failed' ? 'bg-red-900/30 text-red-400 border-red-700' :
                        'bg-blue-900/30 text-blue-400 border-blue-700'
                      }`}
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300">
                    {log.message || `${log.alertType} alert ${log.status}`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              No activity yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function ThemeAppearanceSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: settings } = useQuery({
    queryKey: ['/api/user-settings'],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      const response = await apiRequest('PUT', '/api/user-settings', newSettings);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Theme updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/user-settings'] });
    },
  });

  const accentColors = [
    '#99CC00', '#3B82F6', '#8B5CF6', '#EF4444', '#F97316'
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Theme & Appearance</h2>
        <p className="text-slate-400">Customize the visual appearance of your crisis manager</p>
      </div>

      <Card className="crisis-surface border">
        <CardHeader>
          <CardTitle className="text-white">Theme Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <button className="bg-slate-800 border-2 border-[hsl(74,100%,40%)] rounded-lg p-4 flex-1 text-center">
              <div className="text-2xl mb-2">🌙</div>
              <p className="font-medium text-white">Dark Mode</p>
            </button>
            <button className="bg-slate-800 border-2 border-slate-600 rounded-lg p-4 flex-1 text-center opacity-50">
              <div className="text-2xl mb-2">☀️</div>
              <p className="font-medium text-white">Light Mode</p>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="crisis-surface border">
        <CardHeader>
          <CardTitle className="text-white">Accent Color</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            {accentColors.map((color) => (
              <button
                key={color}
                onClick={() => updateSettingsMutation.mutate({ accentColor: color })}
                className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                  settings?.accentColor === color ? 'border-white' : 'border-transparent hover:border-white'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LanguageVoiceSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: settings } = useQuery({
    queryKey: ['/api/user-settings'],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      const response = await apiRequest('PUT', '/api/user-settings', newSettings);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Language settings updated" });
      queryClient.invalidateQueries({ queryKey: ['/api/user-settings'] });
    },
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Language / Voice Input</h2>
        <p className="text-slate-400">Configure language preferences and voice input settings</p>
      </div>

      <Card className="crisis-surface border">
        <CardHeader>
          <CardTitle className="text-white">Language Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={settings?.language || 'en'} 
            onValueChange={(value) => updateSettingsMutation.mutate({ language: value })}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English (US)</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="crisis-surface border">
        <CardHeader>
          <CardTitle className="text-white">Voice Input Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={settings?.voiceMode || 'always'}
            onValueChange={(value) => updateSettingsMutation.mutate({ voiceMode: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="always" id="always" />
              <Label htmlFor="always" className="text-white">Always listening</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="push" id="push" />
              <Label htmlFor="push" className="text-white">Push to talk</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="keyword" id="keyword" />
              <Label htmlFor="keyword" className="text-white">Wake word activation</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}

export function NotificationSettingsSection() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Notification Settings</h2>
        <p className="text-slate-400">Configure when and how you receive notifications</p>
      </div>

      <Card className="crisis-surface border">
        <CardHeader>
          <CardTitle className="text-white">Alert Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Emergency alerts</Label>
              <p className="text-sm text-slate-400">Critical emergency notifications</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">System updates</Label>
              <p className="text-sm text-slate-400">Software and security updates</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Weekly reports</Label>
              <p className="text-sm text-slate-400">Summary of your safety status</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PrivacyPermissionsSection() {
  const permissions = [
    { name: 'Microphone', description: 'For voice commands', status: 'Granted', icon: '🎤' },
    { name: 'Location', description: 'For emergency location sharing', status: 'Granted', icon: '📍' },
    { name: 'SMS', description: 'For emergency messaging', status: 'Pending', icon: '💬' },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Privacy & Permissions</h2>
        <p className="text-slate-400">Manage app permissions and privacy settings</p>
      </div>

      <Card className="crisis-surface border">
        <CardHeader>
          <CardTitle className="text-white">App Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {permissions.map((permission) => (
              <div key={permission.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{permission.icon}</span>
                  <div>
                    <Label className="text-white font-medium">{permission.name}</Label>
                    <p className="text-sm text-slate-400">{permission.description}</p>
                  </div>
                </div>
                <Badge 
                  className={`${
                    permission.status === 'Granted' ? 'bg-green-900/30 text-green-400 border-green-700' :
                    'bg-yellow-900/30 text-yellow-400 border-yellow-700'
                  }`}
                >
                  {permission.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DeviceIntegrationSection() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Device Integration</h2>
        <p className="text-slate-400">Connect gestures to device functions</p>
      </div>

      <Card className="crisis-surface border">
        <CardHeader>
          <CardTitle className="text-white">Device Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">🔊</span>
                <h4 className="font-medium text-white">Volume Control</h4>
              </div>
              <p className="text-sm text-slate-400 mb-3">Triple tap to adjust volume</p>
              <Switch defaultChecked />
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">🔦</span>
                <h4 className="font-medium text-white">Flashlight</h4>
              </div>
              <p className="text-sm text-slate-400 mb-3">Shake to toggle flashlight</p>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function HelpSupportSection() {
  const faqs = [
    {
      question: 'How do I set up emergency contacts?',
      answer: 'You can add emergency contacts in the main dashboard by clicking on the "Emergency Contacts" card and following the setup wizard.'
    },
    {
      question: 'What triggers an emergency alert?',
      answer: 'Emergency alerts can be triggered by double-pressing the "V" key, using voice commands, or through configured gesture controls.'
    },
    {
      question: 'How is my location shared?',
      answer: 'Your location is only shared during emergency alerts and is sent directly to your configured emergency contacts.'
    }
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Help & Support</h2>
        <p className="text-slate-400">Get help and support for your crisis manager</p>
      </div>

      <Card className="crisis-surface border">
        <CardHeader>
          <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-slate-800 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-white">
                  {faq.question}
                </summary>
                <div className="p-4 pt-0 text-sm text-slate-400">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="crisis-surface border">
        <CardHeader>
          <CardTitle className="text-white">Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="crisis-accent">
              📧 Email Support
            </Button>
            <Button variant="outline">
              📞 Call Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
