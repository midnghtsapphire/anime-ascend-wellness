import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Zap, Target, BookOpen, Wind, Star, TrendingUp, Calendar } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in to continue</h2>
          <Button className="bg-teal-500 hover:bg-teal-600">Sign In</Button>
        </Card>
      </div>
    );
  }

  const moods = [
    { id: "energized", label: "Energized", emoji: "⚡" },
    { id: "calm", label: "Calm", emoji: "🌊" },
    { id: "focused", label: "Focused", emoji: "🎯" },
    { id: "creative", label: "Creative", emoji: "✨" },
    { id: "grateful", label: "Grateful", emoji: "🙏" },
    { id: "anxious", label: "Anxious", emoji: "😰" },
  ];

  const habits = [
    { id: 1, name: "Morning Meditation", streak: 12, target: 30, completed: true },
    { id: 2, name: "Exercise", streak: 8, target: 30, completed: false },
    { id: 3, name: "Read", streak: 15, target: 30, completed: true },
    { id: 4, name: "Journal", streak: 5, target: 30, completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name || "Friend"}!</h1>
            <p className="text-slate-400">Here's your wellness overview</p>
          </div>
          <div className="flex gap-2">
            <Link href="/settings">
              <Button variant="ghost" className="text-slate-300">Settings</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Current Streak</p>
                <p className="text-3xl font-bold text-teal-400">12 days</p>
              </div>
              <TrendingUp className="w-8 h-8 text-teal-400/50" />
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Habits Today</p>
                <p className="text-3xl font-bold text-pink-400">2 of 4</p>
              </div>
              <Target className="w-8 h-8 text-pink-400/50" />
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">AI Messages</p>
                <p className="text-3xl font-bold text-amber-400">47 / 50</p>
              </div>
              <Zap className="w-8 h-8 text-amber-400/50" />
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Mood Average</p>
                <p className="text-3xl font-bold text-green-400">8.2 / 10</p>
              </div>
              <Heart className="w-8 h-8 text-green-400/50" />
            </div>
          </Card>
        </div>

        {/* Mood Check-in */}
        <Card className="bg-slate-800/50 border-slate-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">How are you feeling today?</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  selectedMood === mood.id
                    ? "border-teal-500 bg-teal-500/20"
                    : "border-slate-700 hover:border-slate-600 bg-slate-900/50"
                }`}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <p className="text-xs text-slate-300">{mood.label}</p>
              </button>
            ))}
          </div>
          {selectedMood && (
            <Button className="mt-6 bg-teal-500 hover:bg-teal-600 w-full">
              Log Mood
            </Button>
          )}
        </Card>

        {/* Habits Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Today's Habits</h2>
            <div className="space-y-4">
              {habits.map((habit) => (
                <Card key={habit.id} className="bg-slate-800/50 border-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2">{habit.name}</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-slate-400">Streak:</span>
                          <span className="font-bold text-teal-400">{habit.streak} days</span>
                        </div>
                        <div className="flex-1 bg-slate-900 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-teal-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${(habit.streak / habit.target) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={habit.completed ? "default" : "outline"}
                      className={`ml-4 ${
                        habit.completed
                          ? "bg-teal-500 hover:bg-teal-600"
                          : "border-slate-600"
                      }`}
                    >
                      {habit.completed ? "✓ Done" : "Log"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/meditation">
                <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 p-6 cursor-pointer hover:border-cyan-500/50 transition-all">
                  <Wind className="w-8 h-8 text-cyan-400 mb-3" />
                  <h3 className="font-semibold text-white">Meditate</h3>
                  <p className="text-xs text-slate-400">5 min session</p>
                </Card>
              </Link>
              <Link href="/journal">
                <Card className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-500/30 p-6 cursor-pointer hover:border-pink-500/50 transition-all">
                  <BookOpen className="w-8 h-8 text-pink-400 mb-3" />
                  <h3 className="font-semibold text-white">Journal</h3>
                  <p className="text-xs text-slate-400">Reflect today</p>
                </Card>
              </Link>
              <Link href="/goals">
                <Card className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-500/30 p-6 cursor-pointer hover:border-amber-500/50 transition-all">
                  <Star className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="font-semibold text-white">Goals</h3>
                  <p className="text-xs text-slate-400">Track progress</p>
                </Card>
              </Link>
              <Link href="/ai-coach">
                <Card className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/30 p-6 cursor-pointer hover:border-purple-500/50 transition-all">
                  <Zap className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="font-semibold text-white">AI Coach</h3>
                  <p className="text-xs text-slate-400">Get advice</p>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-bold text-white">This Week</h2>
          </div>
          <p className="text-slate-400">You're on track! Keep up the great work. 🎉</p>
        </Card>
      </div>
    </div>
  );
}
