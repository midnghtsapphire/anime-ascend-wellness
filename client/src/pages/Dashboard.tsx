import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  HeartPulse, Brain, ShieldAlert, Sparkles,
  Target, BookOpen, Wind, Star,
  Settings, ArrowRight, LayoutGrid
} from "lucide-react";
import { toast } from "sonner";

const moodOptions = [
  { id: 'energized', label: 'Energized', emoji: '✨', color: '#e8a849', score: 8 },
  { id: 'calm', label: 'Calm', emoji: '🌸', color: '#e8729a', score: 7 },
  { id: 'focused', label: 'Focused', emoji: '🎯', color: '#7ab87a', score: 8 },
  { id: 'grateful', label: 'Grateful', emoji: '🙏', color: '#7ab8c4', score: 9 },
  { id: 'anxious', label: 'Anxious', emoji: '💭', color: '#d4556b', score: 4 },
  { id: 'tired', label: 'Tired', emoji: '🌙', color: '#8a7075', score: 3 },
  { id: 'neutral', label: 'Neutral', emoji: '🍃', color: '#a8d4a8', score: 5 },
];

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const logMood = trpc.mood.log.useMutation({
    onSuccess: () => toast.success("Mood logged! 🌸"),
  });

  const handleMoodSelect = (mood: typeof moodOptions[0]) => {
    setSelectedMood(mood.id);
    logMood.mutate({ mood: mood.id, moodScore: mood.score });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#f5a3c0] border-t-[#e8729a] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white border-[#f5a3c0]/20">
          <LayoutGrid className="w-16 h-16 text-[#e8729a] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#3d2b2e] mb-2">Dashboard</h2>
          <p className="text-[#8a7075] mb-6">Sign in to view your wellness dashboard.</p>
          <a href={getLoginUrl()}>
            <Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-8">Sign In</Button>
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f5a3c0]/20">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Link href="/"><HeartPulse className="w-6 h-6 text-[#e8729a] cursor-pointer" /></Link>
            <span className="font-bold text-[#3d2b2e]">Dashboard</span>
          </div>
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="text-[#8a7075]"><Settings className="w-4 h-4" /></Button>
          </Link>
        </div>
      </header>

      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#3d2b2e]">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 🌸</h1>
          <p className="text-[#8a7075]">Here's your wellness overview for today.</p>
        </div>

        {/* Health Status */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link href="/health">
            <Card className="p-4 bg-white border-[#f5a3c0]/20 hover:border-[#d4556b]/30 transition-all cursor-pointer">
              <HeartPulse className="w-6 h-6 text-[#d4556b] mb-2" />
              <p className="text-xs text-[#8a7075]">Heart Rate</p>
              <p className="text-xl font-bold text-[#3d2b2e]">-- <span className="text-xs font-normal">BPM</span></p>
              <p className="text-xs text-[#7ab87a] mt-1">Tap to measure</p>
            </Card>
          </Link>
          <Link href="/health">
            <Card className="p-4 bg-white border-[#f5a3c0]/20 hover:border-[#e8a849]/30 transition-all cursor-pointer">
              <Brain className="w-6 h-6 text-[#e8a849] mb-2" />
              <p className="text-xs text-[#8a7075]">Stress Level</p>
              <p className="text-xl font-bold text-[#3d2b2e]">Low</p>
              <p className="text-xs text-[#7ab87a] mt-1">Feeling good</p>
            </Card>
          </Link>
          <Link href="/emergency">
            <Card className="p-4 bg-white border-[#f5a3c0]/20 hover:border-[#7ab8c4]/30 transition-all cursor-pointer">
              <ShieldAlert className="w-6 h-6 text-[#7ab8c4] mb-2" />
              <p className="text-xs text-[#8a7075]">Safety</p>
              <p className="text-xl font-bold text-[#3d2b2e]">Active</p>
              <p className="text-xs text-[#7ab87a] mt-1">Monitoring</p>
            </Card>
          </Link>
        </div>

        {/* Companion Quick Start */}
        <Link href="/companion">
          <Card className="p-5 bg-gradient-to-r from-[#fdf2f4] to-[#f5a3c0]/10 border-[#f5a3c0]/20 mb-6 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#e8729a]/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-[#e8729a]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#3d2b2e]">Talk to Hana</h3>
                  <p className="text-sm text-[#8a7075]">Your companion is ready for a guided exercise</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#e8729a]" />
            </div>
          </Card>
        </Link>

        {/* Mood Check-in */}
        <Card className="p-5 bg-white border-[#f5a3c0]/20 mb-6">
          <h3 className="font-bold text-[#3d2b2e] mb-3">How are you feeling?</h3>
          <div className="flex flex-wrap gap-2">
            {moodOptions.map(mood => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedMood === mood.id ? 'text-white shadow-md scale-105' : 'bg-[#fdf2f4] text-[#3d2b2e] hover:shadow-sm'
                }`}
                style={selectedMood === mood.id ? { backgroundColor: mood.color } : {}}
              >
                {mood.emoji} {mood.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <h3 className="font-bold text-[#3d2b2e] mb-3">Wellness Toolkit</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            { icon: HeartPulse, label: 'Health Monitor', path: '/health', color: '#d4556b', desc: 'Check vitals' },
            { icon: Sparkles, label: 'Companion', path: '/companion', color: '#e8729a', desc: 'Guided exercises' },
            { icon: Target, label: 'Habits', path: '/habits', color: '#e8729a', desc: 'Track habits' },
            { icon: BookOpen, label: 'Journal', path: '/journal', color: '#7ab87a', desc: 'Write & reflect' },
            { icon: Wind, label: 'Meditation', path: '/meditation', color: '#7ab8c4', desc: 'Breathe & relax' },
            { icon: Star, label: 'Goals', path: '/goals', color: '#e8a849', desc: 'Track progress' },
          ].map(item => (
            <Link key={item.label} href={item.path}>
              <Card className="p-4 bg-white border-[#f5a3c0]/20 hover:border-[#f5a3c0]/40 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl mb-2 flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${item.color}15` }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <p className="font-semibold text-sm text-[#3d2b2e]">{item.label}</p>
                <p className="text-xs text-[#8a7075]">{item.desc}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-[#8a7075] pt-4 border-t border-[#f5a3c0]/10">
          <Link href="/pricing" className="hover:text-[#e8729a]">Pricing</Link>
          <Link href="/discover" className="hover:text-[#e8729a]">Discover</Link>
          <Link href="/support" className="hover:text-[#e8729a]">Support</Link>
          <Link href="/emergency" className="hover:text-[#e8729a]">Emergency</Link>
        </div>
      </div>
    </div>
  );
}
