import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Brain, 
  Hand, 
  Settings, 
  History, 
  Palette, 
  Globe, 
  Bell, 
  Lock, 
  Smartphone, 
  HelpCircle,
  Menu,
  Shield,
  X,
  Users,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmergency } from '@/hooks/use-emergency';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onEmergencyTrigger: () => void;
  isEmergencyTriggering: boolean;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Shield },
  { id: 'ai-chat', label: 'AI Assistant', icon: MessageCircle },
  { id: 'emergency-contacts', label: 'Emergency Contacts', icon: Users },
  { id: 'ai-settings', label: 'AI Settings', icon: Brain },
  { id: 'gesture-settings', label: 'Gesture Settings', icon: Hand },
  { id: 'automation-rules', label: 'Automation Rules', icon: Settings },
  { id: 'chat-history', label: 'Chat History', icon: History },
  { id: 'theme-appearance', label: 'Theme & Appearance', icon: Palette },
  { id: 'language-voice', label: 'Language / Voice Input', icon: Globe },
  { id: 'notification-settings', label: 'Notification Settings', icon: Bell },
  { id: 'privacy-permissions', label: 'Privacy & Permissions', icon: Lock },
  { id: 'device-integration', label: 'Device Integration', icon: Smartphone },
  { id: 'help-support', label: 'Help & Support', icon: HelpCircle },
];

export function Sidebar({ activeSection, onSectionChange, onEmergencyTrigger, isEmergencyTriggering }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { emergencyState } = useEmergency();
const statusConfig = {
    safe: {
      label: 'Safe',
      color: 'green',
      icon: <Shield className="w-4 h-4 text-green-400" />,
      ring: 'bg-green-500',
      message: 'All systems operational',
    },
    alert: {
      label: 'Alert',
      color: 'yellow',
      icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
      ring: 'bg-yellow-400',
      message: 'Emergency triggered',
    },
    sending: {
      label: 'Sending',
      color: 'blue',
      icon: <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />,
      ring: 'bg-blue-500',
      message: 'Sending emergency alert',
    },
  };

   const { label, color, icon, ring, message } = statusConfig[emergencyState.status];
  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full bg-[hsl(215,28%,17%)] border-r border-[hsl(217,32%,26%)]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[hsl(217,32%,26%)]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[hsl(74,100%,40%)] rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-[hsl(220,39%,11%)]" />
          </div>
          <h1 className="text-xl font-bold text-white">Crisis Manager</h1>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Emergency Status */}
       <div className="p-6 border-b border-[hsl(217,32%,26%)]">
      <div className={`bg-${color}-900/30 border border-${color}-700 rounded-lg p-4`}>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 ${ring} rounded-full animate-pulse`}></div>
          <div className="flex items-center space-x-2">
            {icon}
            <span className={`text-${color}-400 font-medium`}>{label}</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Last updated: {emergencyState.lastAlert ? emergencyState.lastAlert.toLocaleTimeString() : 'Just now'}
        </p>
      </div>
    </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  onClose?.();
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200",
                  isActive 
                    ? "bg-[hsl(74,100%,40%)]/20 text-[hsl(74,100%,40%)]" 
                    : "hover:bg-slate-700 text-white"
                )}
              >
                <Icon className="w-5 h-5 text-[hsl(74,100%,40%)]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Emergency Trigger */}
      <div className="p-6 border-t border-[hsl(217,32%,26%)]">
        <Button
          onClick={onEmergencyTrigger}
          disabled={isEmergencyTriggering}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200"
        >
          {isEmergencyTriggering ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Sending Alert...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Emergency Alert
            </>
          )}
        </Button>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Or double-press 'V' key
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-80">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent onClose={() => setIsMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
