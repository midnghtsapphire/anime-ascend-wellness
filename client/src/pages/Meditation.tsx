import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Wind, Clock, Volume2 } from "lucide-react";
import { useState } from "react";

export default function Meditation() {
  const { isAuthenticated } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(5);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in</h2>
        </Card>
      </div>
    );
  }

  const sessions = [
    { id: 1, name: "Morning Calm", duration: 5, level: "Beginner", category: "breathing" },
    { id: 2, name: "Focus Flow", duration: 10, level: "Intermediate", category: "focus" },
    { id: 3, name: "Evening Relax", duration: 15, level: "Beginner", category: "sleep" },
    { id: 4, name: "Deep Meditation", duration: 20, level: "Advanced", category: "deep" },
    { id: 5, name: "Stress Relief", duration: 10, level: "Intermediate", category: "stress" },
    { id: 6, name: "Gratitude", duration: 8, level: "Beginner", category: "gratitude" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-white">Meditation & Breathing</h1>
          <p className="text-slate-400">Find calm and peace</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Quick Meditation */}
        <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 p-8 mb-8">
          <div className="text-center">
            <Wind className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Quick Breathing</h2>
            <p className="text-slate-300 mb-6">Take a moment to breathe and center yourself</p>

            {/* Breathing Circle */}
            <div className="flex justify-center mb-8">
              <div
                className={`w-32 h-32 rounded-full border-4 border-cyan-400 flex items-center justify-center transition-all ${
                  isPlaying ? "animate-pulse" : ""
                }`}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-400">{duration}m</p>
                  <p className="text-xs text-slate-400">Breathe</p>
                </div>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 3, 5, 10].map((min) => (
                <Button
                  key={min}
                  variant={duration === min ? "default" : "outline"}
                  className={
                    duration === min
                      ? "bg-cyan-500 hover:bg-cyan-600"
                      : "border-slate-600"
                  }
                  onClick={() => setDuration(min)}
                >
                  {min}m
                </Button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 rounded-full w-16 h-16"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              <Button variant="outline" className="border-slate-600">
                <Volume2 className="w-5 h-5 mr-2" />
                Ambient Sounds
              </Button>
            </div>
          </div>
        </Card>

        {/* Sessions */}
        <h2 className="text-2xl font-bold text-white mb-6">Guided Sessions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="bg-slate-800/50 border-slate-700 p-6 hover:border-cyan-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white mb-1">{session.name}</h3>
                  <p className="text-sm text-slate-400">{session.duration} minutes</p>
                </div>
                <Button
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-600 rounded-full w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="w-4 h-4 ml-0.5" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-400">
                  {session.level}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {session.duration}m
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="bg-slate-800/50 border-slate-700 p-6 mt-8">
          <h3 className="text-lg font-bold text-white mb-4">Meditation Tips</h3>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Find a quiet, comfortable place</li>
            <li>✓ Sit upright with your spine straight</li>
            <li>✓ Focus on your natural breath</li>
            <li>✓ When your mind wanders, gently bring it back</li>
            <li>✓ Practice regularly for best results</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
