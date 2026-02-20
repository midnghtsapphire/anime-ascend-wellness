import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Filter, Heart, Bookmark } from "lucide-react";
import { useState } from "react";

export default function Discover() {
  const { isAuthenticated } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const moods = [
    { id: "energized", label: "Energized", emoji: "⚡", color: "from-amber-500" },
    { id: "calm", label: "Calm", emoji: "🌊", color: "from-cyan-500" },
    { id: "focused", label: "Focused", emoji: "🎯", color: "from-blue-500" },
    { id: "creative", label: "Creative", emoji: "✨", color: "from-purple-500" },
    { id: "grateful", label: "Grateful", emoji: "🙏", color: "from-green-500" },
  ];

  const categories = [
    { id: "all", label: "All" },
    { id: "meditation", label: "Meditation" },
    { id: "exercise", label: "Exercise" },
    { id: "learning", label: "Learning" },
    { id: "creativity", label: "Creativity" },
    { id: "social", label: "Social" },
  ];

  const activities = [
    {
      id: 1,
      title: "5-Minute Breathing",
      category: "meditation",
      mood: "calm",
      description: "Quick breathing exercise to center yourself",
      duration: "5 min",
      level: "Beginner",
      likes: 234,
    },
    {
      id: 2,
      title: "Morning Yoga Flow",
      category: "exercise",
      mood: "energized",
      description: "Energizing yoga routine to start your day",
      duration: "15 min",
      level: "Beginner",
      likes: 456,
    },
    {
      id: 3,
      title: "Creative Writing Prompt",
      category: "creativity",
      mood: "creative",
      description: "Unlock your creativity with guided prompts",
      duration: "20 min",
      level: "Intermediate",
      likes: 189,
    },
    {
      id: 4,
      title: "Gratitude Meditation",
      category: "meditation",
      mood: "grateful",
      description: "Cultivate gratitude and appreciation",
      duration: "10 min",
      level: "Beginner",
      likes: 312,
    },
    {
      id: 5,
      title: "Focus Music Session",
      category: "learning",
      mood: "focused",
      description: "Deep focus music for productivity",
      duration: "60 min",
      level: "All",
      likes: 567,
    },
    {
      id: 6,
      title: "Group Meditation",
      category: "social",
      mood: "calm",
      description: "Meditate with others in our community",
      duration: "30 min",
      level: "Beginner",
      likes: 298,
    },
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
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-white mb-4">Discover Wellness</h1>
          <p className="text-slate-400 mb-4">Find activities that match your mood and goals</p>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search activities..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Mood Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">How are you feeling?</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all ${
                  selectedMood === mood.id
                    ? "border-teal-500 bg-teal-500/20"
                    : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                }`}
              >
                <span className="text-2xl mr-2">{mood.emoji}</span>
                <span className="text-white font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Browse by Category</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className={
                  selectedCategory === cat.id
                    ? "bg-teal-500 hover:bg-teal-600"
                    : "border-slate-600"
                }
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="bg-slate-800/50 border-slate-700 overflow-hidden hover:border-teal-500/50 transition-all group cursor-pointer"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500/20 to-pink-500/20 p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{activity.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{activity.category}</p>
                  </div>
                  <button className="text-slate-400 hover:text-pink-400 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-4">
                <p className="text-slate-300 mb-4 text-sm">{activity.description}</p>

                {/* Meta */}
                <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
                  <span>{activity.duration}</span>
                  <span>{activity.level}</span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {activity.likes}
                  </span>
                </div>

                {/* CTA */}
                <Button className="w-full bg-teal-500 hover:bg-teal-600">
                  Start Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {activities.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No activities found</h3>
            <p className="text-slate-400">Try adjusting your filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}
