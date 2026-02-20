import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Search, Heart, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function Journal() {
  const { isAuthenticated } = useAuth();
  const [entries, setEntries] = useState([
    {
      id: 1,
      title: "A Day of Growth",
      date: "2026-02-20",
      mood: "grateful",
      preview: "Today was amazing. I completed my morning meditation and felt so calm...",
      likes: 5,
    },
    {
      id: 2,
      title: "Overcoming Challenges",
      date: "2026-02-19",
      mood: "focused",
      preview: "I faced a difficult situation today but managed to stay calm and focused...",
      likes: 3,
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

  const moodEmojis: Record<string, string> = {
    grateful: "🙏",
    focused: "🎯",
    energized: "⚡",
    calm: "🌊",
    creative: "✨",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Journal</h1>
            <p className="text-slate-400">Reflect on your journey</p>
          </div>
          <Button className="bg-teal-500 hover:bg-teal-600">
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      <div className="container py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search entries..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Entries */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card
              key={entry.id}
              className="bg-slate-800/50 border-slate-700 p-6 hover:border-teal-500/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{entry.title}</h3>
                    <span className="text-2xl">{moodEmojis[entry.mood] || "😐"}</span>
                  </div>
                  <p className="text-sm text-slate-400">{entry.date}</p>
                </div>
              </div>

              <p className="text-slate-300 mb-4 line-clamp-2">{entry.preview}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-slate-400 hover:text-pink-400 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{entry.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-slate-400 hover:text-teal-400 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">2</span>
                  </button>
                </div>
                <Button variant="ghost" className="text-teal-400 hover:text-teal-300">
                  Read More →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {entries.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No entries yet</h3>
            <p className="text-slate-400 mb-6">Start journaling to reflect on your wellness journey</p>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <Plus className="w-5 h-5 mr-2" />
              Write First Entry
            </Button>
          </Card>
        )}

        {/* Journaling Prompts */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Journaling Prompts</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "What are you grateful for today?",
              "What challenged you today and how did you handle it?",
              "What's one thing you learned about yourself?",
              "How did you practice self-care today?",
            ].map((prompt, idx) => (
              <Card key={idx} className="bg-slate-800/50 border-slate-700 p-4 cursor-pointer hover:border-teal-500/50 transition-all">
                <p className="text-white font-medium mb-3">{prompt}</p>
                <Button variant="ghost" className="text-teal-400 hover:text-teal-300 p-0">
                  Write about this →
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
