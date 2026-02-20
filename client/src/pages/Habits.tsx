import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, TrendingUp, Target } from "lucide-react";
import { useState } from "react";

export default function Habits() {
  const { isAuthenticated } = useAuth();
  const [habits, setHabits] = useState([
    { id: 1, name: "Morning Meditation", category: "mindfulness", streak: 12, emoji: "🧘" },
    { id: 2, name: "Exercise", category: "health", streak: 8, emoji: "💪" },
    { id: 3, name: "Read", category: "learning", streak: 15, emoji: "📚" },
    { id: 4, name: "Journal", category: "mindfulness", streak: 5, emoji: "✍️" },
  ]);

  const categories = [
    { id: "all", label: "All Habits", count: habits.length },
    { id: "health", label: "Health & Fitness", count: habits.filter(h => h.category === "health").length },
    { id: "mindfulness", label: "Mindfulness", count: habits.filter(h => h.category === "mindfulness").length },
    { id: "learning", label: "Learning", count: habits.filter(h => h.category === "learning").length },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Habits</h1>
            <p className="text-slate-400">Build streaks and transform your life</p>
          </div>
          <Button className="bg-teal-500 hover:bg-teal-600">
            <Plus className="w-5 h-5 mr-2" />
            New Habit
          </Button>
        </div>
      </div>

      <div className="container py-8">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={cat.id === "all" ? "default" : "outline"}
              className={cat.id === "all" ? "bg-teal-500 hover:bg-teal-600" : "border-slate-600"}
            >
              {cat.label} <span className="ml-2 text-xs opacity-70">({cat.count})</span>
            </Button>
          ))}
        </div>

        {/* Habits Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {habits.map((habit) => (
            <Card key={habit.id} className="bg-slate-800/50 border-slate-700 p-6 hover:border-teal-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{habit.emoji}</div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{habit.name}</h3>
                    <p className="text-sm text-slate-400 capitalize">{habit.category}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Streak Info */}
              <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-400" />
                    <span className="text-white font-bold">{habit.streak} day streak</span>
                  </div>
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-8 rounded ${
                        i < 5 ? "bg-teal-500" : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">Last 7 days</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-teal-500 hover:bg-teal-600">
                  <Target className="w-4 h-4 mr-2" />
                  Log Today
                </Button>
                <Button variant="outline" className="flex-1 border-slate-600">
                  View History
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {habits.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No habits yet</h3>
            <p className="text-slate-400 mb-6">Create your first habit to start building streaks</p>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <Plus className="w-5 h-5 mr-2" />
              Create Habit
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
