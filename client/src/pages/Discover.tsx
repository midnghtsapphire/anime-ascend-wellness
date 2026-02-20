import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Compass, ArrowLeft, HeartPulse, Brain, Wind, Star, Target, BookOpen, Sparkles } from "lucide-react";

const activities = [
  { id: 'heart-check', name: 'Heart Health Check', desc: 'Monitor your heart rate and detect irregularities', icon: HeartPulse, color: '#d4556b', path: '/health', category: 'health' },
  { id: 'stress-relief', name: 'Stress Relief Session', desc: 'Guided breathing to lower your stress levels', icon: Brain, color: '#e8a849', path: '/companion', category: 'health' },
  { id: 'box-breathing', name: 'Box Breathing', desc: '4-4-4-4 breathing technique for instant calm', icon: Wind, color: '#7ab8c4', path: '/companion', category: 'breathing' },
  { id: 'gratitude', name: 'Gratitude Journal', desc: 'Write about what you are grateful for today', icon: BookOpen, color: '#7ab87a', path: '/journal', category: 'mindfulness' },
  { id: 'goal-setting', name: 'Set a New Goal', desc: 'Define what you want to achieve this month', icon: Target, color: '#e8729a', path: '/goals', category: 'growth' },
  { id: 'meditation', name: 'Morning Meditation', desc: 'Start your day with 5 minutes of calm', icon: Star, color: '#e8a849', path: '/meditation', category: 'mindfulness' },
  { id: 'body-scan', name: 'Body Scan', desc: 'Connect with your body and release tension', icon: Sparkles, color: '#7ab8c4', path: '/meditation', category: 'mindfulness' },
  { id: 'habit-review', name: 'Habit Review', desc: 'Check your streaks and log today\'s habits', icon: Target, color: '#7ab87a', path: '/habits', category: 'growth' },
];

const moods = [
  { id: 'stressed', label: 'Stressed', emoji: '😰' },
  { id: 'anxious', label: 'Anxious', emoji: '💭' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'energized', label: 'Energized', emoji: '✨' },
  { id: 'calm', label: 'Calm', emoji: '🌸' },
];

export default function Discover() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-[#f5a3c0] border-t-[#e8729a] animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f5a3c0]/20">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/dashboard"><Button variant="ghost" size="sm" className="text-[#8a7075]"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#e8729a]" />
              <span className="font-bold text-[#3d2b2e]">Discover</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6 max-w-2xl mx-auto">
        <h3 className="font-bold text-[#3d2b2e] mb-3">How are you feeling?</h3>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {moods.map(mood => (
            <button key={mood.id} className="px-4 py-2 rounded-full bg-[#fdf2f4] text-[#3d2b2e] text-sm font-medium hover:bg-[#f5a3c0]/20 transition-all whitespace-nowrap">
              {mood.emoji} {mood.label}
            </button>
          ))}
        </div>

        <h3 className="font-bold text-[#3d2b2e] mb-3">Wellness Activities</h3>
        <div className="space-y-3">
          {activities.map(activity => (
            <Link key={activity.id} href={isAuthenticated ? activity.path : '#'}>
              <Card className="p-4 bg-white border-[#f5a3c0]/20 hover:border-[#f5a3c0]/40 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${activity.color}15` }}>
                    <activity.icon className="w-6 h-6" style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#3d2b2e]">{activity.name}</h4>
                    <p className="text-sm text-[#8a7075]">{activity.desc}</p>
                    <span className="text-xs bg-[#fdf2f4] text-[#c4507a] px-2 py-0.5 rounded-full mt-1 inline-block capitalize">{activity.category}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {!isAuthenticated && (
          <Card className="p-6 bg-white border-[#f5a3c0]/20 mt-6 text-center">
            <p className="text-[#8a7075] mb-4">Sign in to access all wellness activities</p>
            <a href={getLoginUrl()}><Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-8">Sign In</Button></a>
          </Card>
        )}
      </div>
    </div>
  );
}
