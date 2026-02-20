import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Settings as SettingsIcon, ArrowLeft, User, Accessibility, CreditCard, Bell, Eye, Leaf, Brain, Type, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type AccessibilityMode = 'wcag-aaa' | 'eco-code' | 'neuro-code' | 'dyslexic' | 'no-blue-light';

export default function Settings() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [modes, setModes] = useState<Set<AccessibilityMode>>(new Set());

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => logout(),
  });

  useEffect(() => {
    const saved = localStorage.getItem('accessibility-modes');
    if (saved) {
      const parsed: AccessibilityMode[] = JSON.parse(saved);
      setModes(new Set(parsed));
      parsed.forEach(m => document.documentElement.classList.add(m));
    }
  }, []);

  const toggleMode = (mode: AccessibilityMode) => {
    const next = new Set(modes);
    if (next.has(mode)) {
      next.delete(mode);
      document.documentElement.classList.remove(mode);
    } else {
      next.add(mode);
      document.documentElement.classList.add(mode);
    }
    setModes(next);
    localStorage.setItem('accessibility-modes', JSON.stringify(Array.from(next)));
    toast.success(`${mode.replace(/-/g, ' ').toUpperCase()} ${next.has(mode) ? 'enabled' : 'disabled'}`);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-[#f5a3c0] border-t-[#e8729a] animate-spin" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white border-[#f5a3c0]/20">
          <SettingsIcon className="w-16 h-16 text-[#8a7075] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#3d2b2e] mb-2">Settings</h2>
          <p className="text-[#8a7075] mb-6">Sign in to manage your settings.</p>
          <a href={getLoginUrl()}><Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-8">Sign In</Button></a>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const accessibilityModes = [
    { id: 'wcag-aaa' as AccessibilityMode, name: 'WCAG AAA', desc: 'Maximum contrast, large text, visible focus indicators', icon: Eye, color: '#3d2b2e' },
    { id: 'eco-code' as AccessibilityMode, name: 'ECO CODE', desc: 'Low energy — dark backgrounds, reduced animations, minimal data', icon: Leaf, color: '#7ab87a' },
    { id: 'neuro-code' as AccessibilityMode, name: 'NEURO CODE', desc: 'ADHD-friendly — reduced clutter, focus mode, simplified nav', icon: Brain, color: '#7ab8c4' },
    { id: 'dyslexic' as AccessibilityMode, name: 'DYSLEXIC MODE', desc: 'OpenDyslexic font, increased letter spacing, high contrast', icon: Type, color: '#e8a849' },
    { id: 'no-blue-light' as AccessibilityMode, name: 'NO BLUE LIGHT', desc: 'Warm color filter — removes blue wavelengths for eye comfort', icon: Eye, color: '#d4556b' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f5a3c0]/20">
        <div className="container flex items-center h-14">
          <Link href="/dashboard"><Button variant="ghost" size="sm" className="text-[#8a7075]"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link>
          <span className="font-bold text-[#3d2b2e] ml-3">Settings</span>
        </div>
      </header>

      <div className="container py-6 max-w-3xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-[#e8729a] text-white shadow-md' : 'bg-[#fdf2f4] text-[#3d2b2e] hover:bg-[#f5a3c0]/20'
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Account */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            <Card className="p-5 bg-white border-[#f5a3c0]/20">
              <h3 className="font-bold text-[#3d2b2e] mb-4">Profile</h3>
              <div className="space-y-3">
                <div><label className="text-xs text-[#8a7075]">Name</label><p className="text-[#3d2b2e] font-medium">{user?.name || 'Not set'}</p></div>
                <div><label className="text-xs text-[#8a7075]">Email</label><p className="text-[#3d2b2e] font-medium">{user?.email || 'Not set'}</p></div>
                <div><label className="text-xs text-[#8a7075]">Member since</label><p className="text-[#3d2b2e] font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p></div>
              </div>
            </Card>
            <Card className="p-5 bg-white border-[#d4556b]/20">
              <h3 className="font-bold text-[#d4556b] mb-2">Danger Zone</h3>
              <p className="text-sm text-[#8a7075] mb-3">Sign out of your account</p>
              <Button onClick={() => logoutMutation.mutate()} variant="outline" className="border-[#d4556b] text-[#d4556b] rounded-xl">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </Card>
          </div>
        )}

        {/* Accessibility */}
        {activeTab === 'accessibility' && (
          <div className="space-y-3">
            <Card className="p-4 bg-gradient-to-r from-[#fdf2f4] to-white border-[#f5a3c0]/20 mb-4">
              <p className="text-sm text-[#3d2b2e]">Anime Ascend is designed to be accessible to everyone. Enable any combination of modes below.</p>
            </Card>
            {accessibilityModes.map(mode => (
              <Card key={mode.id} className={`p-4 bg-white transition-all ${modes.has(mode.id) ? 'border-[#e8729a] border-2' : 'border-[#f5a3c0]/20'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${mode.color}15` }}>
                      <mode.icon className="w-5 h-5" style={{ color: mode.color }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#3d2b2e] text-sm">{mode.name}</h4>
                      <p className="text-xs text-[#8a7075]">{mode.desc}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleMode(mode.id)}
                    className={`w-12 h-6 rounded-full transition-all relative ${modes.has(mode.id) ? 'bg-[#e8729a]' : 'bg-[#f5a3c0]/30'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${modes.has(mode.id) ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Billing */}
        {activeTab === 'billing' && (
          <div className="space-y-4">
            <Card className="p-5 bg-white border-[#f5a3c0]/20">
              <h3 className="font-bold text-[#3d2b2e] mb-3">Current Plan</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-[#e8729a]">Blossom (Free)</p>
                  <p className="text-sm text-[#8a7075]">Basic health monitoring</p>
                </div>
                <Link href="/pricing"><Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-xl">Upgrade</Button></Link>
              </div>
            </Card>
            <Card className="p-5 bg-white border-[#f5a3c0]/20">
              <h3 className="font-bold text-[#3d2b2e] mb-3">Token Balance</h3>
              <p className="text-3xl font-bold text-[#e8729a]">5 <span className="text-sm text-[#8a7075] font-normal">tokens remaining</span></p>
              <p className="text-xs text-[#8a7075] mt-1">Tokens are used for AI coach sessions. Upgrade for more.</p>
            </Card>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-3">
            {[
              { name: 'Health Alerts', desc: 'Heart rate anomalies and stress spikes', on: true },
              { name: 'Fall Detection', desc: 'Alert emergency contacts on fall', on: true },
              { name: 'Habit Reminders', desc: 'Daily reminders to log habits', on: true },
              { name: 'Meditation Reminders', desc: 'Gentle mindfulness reminders', on: false },
              { name: 'Weekly Summary', desc: 'Weekly wellness report', on: true },
              { name: 'Marketing', desc: 'New features and updates', on: false },
            ].map((notif, i) => (
              <Card key={i} className="p-4 bg-white border-[#f5a3c0]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#3d2b2e] text-sm">{notif.name}</h4>
                    <p className="text-xs text-[#8a7075]">{notif.desc}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-all relative ${notif.on ? 'bg-[#e8729a]' : 'bg-[#f5a3c0]/30'}`}
                    onClick={() => toast.success("Notification preference updated")}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notif.on ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
