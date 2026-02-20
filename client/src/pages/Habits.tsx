import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, TrendingUp, Target, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const defaultHabits = [
  { id: 1, name: "Morning Meditation", category: "mindfulness", streak: 0, emoji: "🧘" },
  { id: 2, name: "Exercise", category: "health", streak: 0, emoji: "💪" },
  { id: 3, name: "Read", category: "learning", streak: 0, emoji: "📚" },
  { id: 4, name: "Journal", category: "mindfulness", streak: 0, emoji: "✍️" },
  { id: 5, name: "Hydrate", category: "health", streak: 0, emoji: "💧" },
  { id: 6, name: "Gratitude", category: "mindfulness", streak: 0, emoji: "🙏" },
];

export default function Habits() {
  const { isAuthenticated, loading } = useAuth();
  const [habits] = useState(defaultHabits);
  const [loggedToday, setLoggedToday] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState("all");

  const logHabit = trpc.habitLogs.log.useMutation({
    onSuccess: () => toast.success("Habit logged! 🌸"),
  });

  const handleLog = (habitId: number) => {
    setLoggedToday(prev => new Set(prev).add(habitId));
    logHabit.mutate({ habitId });
  };

  const filtered = activeCategory === "all" ? habits : habits.filter(h => h.category === activeCategory);
  const categories = [
    { id: "all", label: "All" },
    { id: "health", label: "Health" },
    { id: "mindfulness", label: "Mindfulness" },
    { id: "learning", label: "Learning" },
  ];

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-[#f5a3c0] border-t-[#e8729a] animate-spin" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white border-[#f5a3c0]/20">
          <Target className="w-16 h-16 text-[#e8729a] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#3d2b2e] mb-2">Habits</h2>
          <p className="text-[#8a7075] mb-6">Sign in to track your habits.</p>
          <a href={getLoginUrl()}><Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-8">Sign In</Button></a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f5a3c0]/20">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/dashboard"><Button variant="ghost" size="sm" className="text-[#8a7075]"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link>
            <span className="font-bold text-[#3d2b2e]">Habits</span>
          </div>
          <Button size="sm" className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full"><Plus className="w-4 h-4 mr-1" /> New Habit</Button>
        </div>
      </header>

      <div className="container py-6 max-w-2xl mx-auto">
        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id ? 'bg-[#e8729a] text-white shadow-md' : 'bg-[#fdf2f4] text-[#3d2b2e] hover:bg-[#f5a3c0]/20'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Habits */}
        <div className="space-y-3">
          {filtered.map(habit => (
            <Card key={habit.id} className="p-4 bg-white border-[#f5a3c0]/20 hover:border-[#f5a3c0]/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#fdf2f4] flex items-center justify-center text-2xl">{habit.emoji}</div>
                  <div>
                    <h3 className="font-bold text-[#3d2b2e]">{habit.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-[#8a7075]">
                      <span className="capitalize">{habit.category}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-[#e8729a]" /> {habit.streak} day streak</span>
                    </div>
                    {/* Mini streak bar */}
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className={`w-5 h-1.5 rounded-full ${i < 5 ? 'bg-[#e8729a]' : 'bg-[#fdf2f4]'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleLog(habit.id)}
                  disabled={loggedToday.has(habit.id)}
                  className={`rounded-full ${loggedToday.has(habit.id) ? 'bg-[#7ab87a] text-white' : 'bg-[#e8729a] hover:bg-[#c4507a] text-white'}`}
                  size="sm"
                >
                  {loggedToday.has(habit.id) ? <><Check className="w-4 h-4 mr-1" /> Done</> : 'Log'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card className="p-8 bg-white border-[#f5a3c0]/20 text-center">
            <Target className="w-12 h-12 text-[#f5a3c0] mx-auto mb-3" />
            <h4 className="font-bold text-[#3d2b2e] mb-1">No habits in this category</h4>
            <p className="text-sm text-[#8a7075]">Create a new habit to get started.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
