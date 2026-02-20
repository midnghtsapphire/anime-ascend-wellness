import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, CheckCircle, Target, Zap } from "lucide-react";
import { useState } from "react";

export default function Goals() {
  const { isAuthenticated } = useAuth();
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Meditate Daily",
      category: "mindfulness",
      progress: 75,
      target: "30 days",
      milestones: [
        { id: 1, title: "7 days", completed: true },
        { id: 2, title: "14 days", completed: true },
        { id: 3, title: "21 days", completed: false },
        { id: 4, title: "30 days", completed: false },
      ],
    },
    {
      id: 2,
      title: "Read 12 Books",
      category: "learning",
      progress: 33,
      target: "12 books",
      milestones: [
        { id: 1, title: "Book 1", completed: true },
        { id: 2, title: "Book 4", completed: true },
        { id: 3, title: "Book 8", completed: false },
        { id: 4, title: "Book 12", completed: false },
      ],
    },
    {
      id: 3,
      title: "Exercise 3x/week",
      category: "health",
      progress: 60,
      target: "12 weeks",
      milestones: [
        { id: 1, title: "Week 1-3", completed: true },
        { id: 2, title: "Week 4-6", completed: true },
        { id: 3, title: "Week 7-9", completed: false },
        { id: 4, title: "Week 10-12", completed: false },
      ],
    },
  ]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in</h2>
        </Card>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    mindfulness: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
    learning: "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
    health: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Goals</h1>
            <p className="text-slate-400">Track your progress and celebrate milestones</p>
          </div>
          <Button className="bg-teal-500 hover:bg-teal-600">
            <Plus className="w-5 h-5 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      <div className="container py-8">
        {/* Goals */}
        <div className="space-y-6">
          {goals.map((goal) => (
            <Card
              key={goal.id}
              className={`bg-gradient-to-br ${categoryColors[goal.category]} border p-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{goal.title}</h3>
                  <p className="text-sm text-slate-400">Target: {goal.target}</p>
                </div>
                <Target className="w-6 h-6 text-slate-400" />
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">Progress</span>
                  <span className="text-sm text-slate-400">{goal.progress}%</span>
                </div>
                <div className="w-full bg-slate-900/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-pink-500 h-3 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-white mb-3">Milestones</p>
                <div className="grid grid-cols-4 gap-2">
                  {goal.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`p-3 rounded-lg text-center text-sm font-medium transition-all ${
                        milestone.completed
                          ? "bg-teal-500/30 border border-teal-500 text-teal-300"
                          : "bg-slate-900/50 border border-slate-700 text-slate-400"
                      }`}
                    >
                      {milestone.completed && <CheckCircle className="w-4 h-4 mx-auto mb-1" />}
                      <p className="text-xs">{milestone.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-teal-500 hover:bg-teal-600">
                  <Zap className="w-4 h-4 mr-2" />
                  Log Progress
                </Button>
                <Button variant="outline" className="flex-1 border-slate-600">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {goals.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No goals yet</h3>
            <p className="text-slate-400 mb-6">Set your first goal to start your journey</p>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <Plus className="w-5 h-5 mr-2" />
              Create Goal
            </Button>
          </Card>
        )}

        {/* Goal Ideas */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Goal Ideas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "30-Day Meditation Challenge", category: "mindfulness" },
              { title: "Read 1 Book Per Month", category: "learning" },
              { title: "Exercise 3x Per Week", category: "health" },
              { title: "Journal Daily", category: "mindfulness" },
            ].map((idea, idx) => (
              <Card
                key={idx}
                className="bg-slate-800/50 border-slate-700 p-4 cursor-pointer hover:border-teal-500/50 transition-all"
              >
                <p className="text-white font-medium mb-3">{idea.title}</p>
                <Button variant="ghost" className="text-teal-400 hover:text-teal-300 p-0">
                  Create this goal →
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
