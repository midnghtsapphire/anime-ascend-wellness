import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Wind, ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

const sessions = [
  { id: 'morning', name: 'Morning Calm', duration: 300, desc: 'Start your day with peace', emoji: '🌅' },
  { id: 'focus', name: 'Deep Focus', duration: 600, desc: 'Sharpen your concentration', emoji: '🎯' },
  { id: 'stress', name: 'Stress Relief', duration: 420, desc: 'Release tension and worry', emoji: '🍃' },
  { id: 'sleep', name: 'Sleep Prep', duration: 480, desc: 'Wind down for restful sleep', emoji: '🌙' },
  { id: 'gratitude', name: 'Gratitude', duration: 300, desc: 'Appreciate the good things', emoji: '🙏' },
  { id: 'body-scan', name: 'Body Scan', duration: 600, desc: 'Connect with your body', emoji: '✨' },
];

export default function Meditation() {
  const { isAuthenticated, loading } = useAuth();
  const [activeSession, setActiveSession] = useState<typeof sessions[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (breathRef.current) { clearTimeout(breathRef.current); breathRef.current = null; }
  }, []);

  const startSession = (session: typeof sessions[0]) => {
    clearTimers();
    setActiveSession(session);
    setTimeLeft(session.duration);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || !activeSession) return;
    clearTimers();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setIsPlaying(false); clearTimers(); return 0; }
        return prev - 1;
      });
    }, 1000);
    let phase = 0;
    const phases: Array<'inhale' | 'hold' | 'exhale'> = ['inhale', 'hold', 'exhale'];
    const durations = [4000, 2000, 4000];
    const runBreath = () => {
      setBreathPhase(phases[phase % 3]);
      breathRef.current = setTimeout(() => { phase++; runBreath(); }, durations[phase % 3]);
    };
    runBreath();
    return clearTimers;
  }, [isPlaying, activeSession, clearTimers]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-[#f5a3c0] border-t-[#e8729a] animate-spin" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white border-[#f5a3c0]/20">
          <Wind className="w-16 h-16 text-[#7ab8c4] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#3d2b2e] mb-2">Meditation</h2>
          <p className="text-[#8a7075] mb-6">Sign in to start meditating.</p>
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
            <span className="font-bold text-[#3d2b2e]">Meditation</span>
          </div>
        </div>
      </header>

      <div className="container py-6 max-w-2xl mx-auto">
        {activeSession && (
          <Card className="p-8 bg-white border-[#f5a3c0]/20 mb-6 text-center">
            <p className="text-sm text-[#8a7075] mb-2">{activeSession.name}</p>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className={`absolute inset-0 rounded-full transition-all duration-[4000ms] ease-in-out ${
                breathPhase === 'inhale' ? 'scale-100 bg-[#e8729a]/10' :
                breathPhase === 'hold' ? 'scale-100 bg-[#e8729a]/15' :
                'scale-75 bg-[#e8729a]/5'
              }`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-4xl font-bold text-[#3d2b2e]">{formatTime(timeLeft)}</p>
                  <p className="text-sm text-[#e8729a] font-medium capitalize mt-1">{breathPhase}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setIsPlaying(!isPlaying)} className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-6">
                {isPlaying ? <><Pause className="w-4 h-4 mr-2" /> Pause</> : <><Play className="w-4 h-4 mr-2" /> Resume</>}
              </Button>
              <Button onClick={() => { clearTimers(); setActiveSession(null); setIsPlaying(false); }} variant="outline" className="border-[#f5a3c0] text-[#c4507a] rounded-full px-6">
                <RotateCcw className="w-4 h-4 mr-2" /> End
              </Button>
            </div>
          </Card>
        )}

        {!activeSession && (
          <>
            <h3 className="font-bold text-[#3d2b2e] mb-4">Choose a Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sessions.map(session => (
                <Card key={session.id} className="p-5 bg-white border-[#f5a3c0]/20 hover:border-[#f5a3c0]/40 hover:shadow-md transition-all cursor-pointer" onClick={() => startSession(session)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#fdf2f4] flex items-center justify-center text-2xl">{session.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#3d2b2e]">{session.name}</h4>
                      <p className="text-sm text-[#8a7075]">{session.desc}</p>
                      <p className="text-xs text-[#e8729a] mt-1">{Math.floor(session.duration / 60)} min</p>
                    </div>
                    <Play className="w-5 h-5 text-[#e8729a]" />
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-5 bg-white border-[#f5a3c0]/20 mt-6">
              <h4 className="font-bold text-[#3d2b2e] mb-3">Meditation Tips</h4>
              <ul className="space-y-2 text-sm text-[#8a7075]">
                <li className="flex items-center gap-2"><span className="text-[#e8729a]">🌸</span> Find a quiet, comfortable place</li>
                <li className="flex items-center gap-2"><span className="text-[#e8729a]">🌸</span> Sit upright with your spine straight</li>
                <li className="flex items-center gap-2"><span className="text-[#e8729a]">🌸</span> Focus on your natural breath</li>
                <li className="flex items-center gap-2"><span className="text-[#e8729a]">🌸</span> When your mind wanders, gently bring it back</li>
                <li className="flex items-center gap-2"><span className="text-[#e8729a]">🌸</span> Practice regularly for best results</li>
              </ul>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
