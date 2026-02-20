import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Star, Plus, ArrowLeft, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Goals() {
  const { isAuthenticated, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("health");

  const goalsList = trpc.goals.list.useQuery(undefined, { enabled: isAuthenticated });
  const createGoal = trpc.goals.create.useMutation({
    onSuccess: () => { goalsList.refetch(); setShowForm(false); setTitle(""); setDescription(""); toast.success("Goal created! 🌸"); },
  });
  const updateProgress = trpc.goals.updateProgress.useMutation({
    onSuccess: () => { goalsList.refetch(); toast.success("Progress updated!"); },
  });

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-[#f5a3c0] border-t-[#e8729a] animate-spin" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white border-[#f5a3c0]/20">
          <Star className="w-16 h-16 text-[#e8a849] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#3d2b2e] mb-2">Goals</h2>
          <p className="text-[#8a7075] mb-6">Sign in to track your goals.</p>
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
            <span className="font-bold text-[#3d2b2e]">Goals</span>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full">
            <Plus className="w-4 h-4 mr-1" /> New Goal
          </Button>
        </div>
      </header>

      <div className="container py-6 max-w-2xl mx-auto">
        {showForm && (
          <Card className="p-5 bg-white border-[#e8729a]/30 mb-6">
            <h4 className="font-bold text-[#3d2b2e] mb-3">New Goal</h4>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Goal title"
              className="w-full px-3 py-2 border border-[#f5a3c0]/30 rounded-xl text-sm bg-white text-[#3d2b2e] focus:outline-none focus:border-[#e8729a] mb-3" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" rows={3}
              className="w-full px-3 py-2 border border-[#f5a3c0]/30 rounded-xl text-sm bg-white text-[#3d2b2e] focus:outline-none focus:border-[#e8729a] mb-3 resize-none" />
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-[#f5a3c0]/30 rounded-xl text-sm bg-white text-[#3d2b2e] focus:outline-none focus:border-[#e8729a] mb-3">
              <option value="health">Health</option>
              <option value="fitness">Fitness</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="career">Career</option>
              <option value="learning">Learning</option>
              <option value="relationships">Relationships</option>
            </select>
            <div className="flex gap-2">
              <Button onClick={() => { if (!title.trim()) { toast.error("Title required"); return; } createGoal.mutate({ title: title.trim(), description: description.trim() || undefined, category }); }}
                className="flex-1 bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-xl" disabled={createGoal.isPending}>
                Create Goal
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" className="border-[#f5a3c0] text-[#c4507a] rounded-xl">Cancel</Button>
            </div>
          </Card>
        )}

        {goalsList.isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-[#fdf2f4] rounded-xl animate-pulse" />)}</div>
        ) : goalsList.data && goalsList.data.length > 0 ? (
          <div className="space-y-3">
            {goalsList.data.map((goal: any) => (
              <Card key={goal.id} className="p-4 bg-white border-[#f5a3c0]/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-[#3d2b2e]">{goal.title}</h4>
                    {goal.description && <p className="text-sm text-[#8a7075]">{goal.description}</p>}
                    {goal.category && <span className="text-xs bg-[#fdf2f4] text-[#c4507a] px-2 py-0.5 rounded-full mt-1 inline-block">{goal.category}</span>}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-[#e8729a]">
                    <TrendingUp className="w-4 h-4" /> {goal.progress}%
                  </div>
                </div>
                <div className="w-full bg-[#fdf2f4] rounded-full h-2 mb-3">
                  <div className="bg-gradient-to-r from-[#e8729a] to-[#f5a3c0] h-2 rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
                </div>
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map(p => (
                    <button key={p} onClick={() => updateProgress.mutate({ id: goal.id, progress: p })}
                      className={`text-xs px-3 py-1 rounded-full transition-all ${
                        goal.progress >= p ? 'bg-[#e8729a] text-white' : 'bg-[#fdf2f4] text-[#8a7075] hover:bg-[#f5a3c0]/20'
                      }`}>
                      {p}%
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 bg-white border-[#f5a3c0]/20 text-center">
            <Star className="w-12 h-12 text-[#f5a3c0] mx-auto mb-3" />
            <h4 className="font-bold text-[#3d2b2e] mb-1">No goals yet</h4>
            <p className="text-sm text-[#8a7075] mb-4">Set your first goal and start tracking progress.</p>
            <Button onClick={() => setShowForm(true)} className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full">
              <Plus className="w-4 h-4 mr-1" /> Create First Goal
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
