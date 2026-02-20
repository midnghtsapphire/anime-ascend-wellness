import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles, HeartPulse, Wind, Activity, ArrowLeft,
  Play, Pause, RotateCcw, CheckCircle, ChevronRight, Timer
} from "lucide-react";

/* Chibi Hana SVG for companion mode */
function CompanionHana({ mood = "calm", size = 160 }: { mood?: string; size?: number }) {
  const mouthPaths: Record<string, string> = {
    calm: "M54 64 Q60 69 66 64",
    encouraging: "M52 62 Q60 70 68 62",
    celebrating: "M50 60 Q60 72 70 60",
    concerned: "M54 66 Q60 63 66 66",
  };

  return (
    <div className="inline-flex items-center justify-center">
      <svg viewBox="0 0 120 140" width={size} height={size * 1.17}>
        <ellipse cx="60" cy="45" rx="38" ry="35" fill="#3d2b2e" />
        <ellipse cx="60" cy="52" rx="30" ry="28" fill="#ffecd2" />
        <path d="M25 40 Q35 15 60 18 Q85 15 95 40 Q90 30 75 25 Q60 22 45 25 Q30 30 25 40Z" fill="#3d2b2e" />
        <ellipse cx="45" cy="52" rx="4" ry="5" fill="#3d2b2e" />
        <ellipse cx="75" cy="52" rx="4" ry="5" fill="#3d2b2e" />
        <circle cx="43" cy="50" r="1.5" fill="white" />
        <circle cx="73" cy="50" r="1.5" fill="white" />
        <ellipse cx="36" cy="60" rx="6" ry="3" fill="#f5a3c0" opacity="0.5" />
        <ellipse cx="84" cy="60" rx="6" ry="3" fill="#f5a3c0" opacity="0.5" />
        <path d={mouthPaths[mood] || mouthPaths.calm} stroke="#3d2b2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="88" cy="30" r="5" fill="#f5a3c0" />
        <circle cx="92" cy="26" r="4" fill="#e8729a" />
        <circle cx="85" cy="25" r="3" fill="#f5a3c0" opacity="0.7" />
        <path d="M35 78 Q35 72 60 72 Q85 72 85 78 L85 110 Q85 125 60 125 Q35 125 35 110Z" fill="white" stroke="#f5a3c0" strokeWidth="1.5" />
        <path d="M55 92 Q55 86 60 86 Q65 86 65 92 Q65 98 60 102 Q55 98 55 92Z" fill="#e8729a" opacity="0.6" />
        <path d="M35 85 Q25 90 22 100" stroke="#ffecd2" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M85 85 Q95 90 98 100" stroke="#ffecd2" strokeWidth="8" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

/* Breathing exercise types */
const exercises = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    description: "A calming technique used by Navy SEALs. Breathe in a square pattern.",
    trigger: "stress_relief",
    steps: [
      { instruction: "Breathe in slowly", duration: 4, phase: "inhale" },
      { instruction: "Hold your breath", duration: 4, phase: "hold" },
      { instruction: "Breathe out slowly", duration: 4, phase: "exhale" },
      { instruction: "Hold empty", duration: 4, phase: "hold" },
    ],
    rounds: 4,
    companionMessages: [
      "Let's breathe together. I'm right here with you. 🌸",
      "You're doing great. Feel the calm washing over you.",
      "Almost there. Your body is relaxing with each breath.",
      "Wonderful! You completed a full cycle. How do you feel?",
    ],
  },
  {
    id: "cardiac-recovery",
    name: "Cardiac Recovery",
    description: "Gentle breathing to slow your heart rate when it's elevated.",
    trigger: "arrhythmia",
    steps: [
      { instruction: "Breathe in through your nose", duration: 6, phase: "inhale" },
      { instruction: "Hold gently", duration: 2, phase: "hold" },
      { instruction: "Breathe out through your mouth", duration: 8, phase: "exhale" },
      { instruction: "Rest", duration: 2, phase: "hold" },
    ],
    rounds: 6,
    companionMessages: [
      "I noticed your heart rate is elevated. Let's slow it down together. 💗",
      "Slow, deep breaths. I'm monitoring your heart rate.",
      "Good. Your heart is starting to calm down.",
      "Keep going. You're doing beautifully.",
      "Almost done. Your rhythm is improving.",
      "You did it! Your heart rate is stabilizing. I'm so proud of you! ✨",
    ],
  },
  {
    id: "grounding-54321",
    name: "5-4-3-2-1 Grounding",
    description: "A sensory grounding technique to bring you back to the present moment.",
    trigger: "stress_episode",
    steps: [
      { instruction: "Name 5 things you can SEE", duration: 15, phase: "observe" },
      { instruction: "Name 4 things you can TOUCH", duration: 12, phase: "observe" },
      { instruction: "Name 3 things you can HEAR", duration: 10, phase: "observe" },
      { instruction: "Name 2 things you can SMELL", duration: 8, phase: "observe" },
      { instruction: "Name 1 thing you can TASTE", duration: 6, phase: "observe" },
    ],
    rounds: 1,
    companionMessages: [
      "Let's ground ourselves together. Focus on your senses. 🍃",
      "Good. You're connecting with the present moment.",
      "You're doing wonderfully. Keep focusing.",
      "Almost there. You're safe and present.",
      "Beautiful. You're grounded and centered now. 🌸",
    ],
  },
  {
    id: "progressive-relaxation",
    name: "Progressive Muscle Relaxation",
    description: "Tense and release muscle groups to release physical tension.",
    trigger: "stress_relief",
    steps: [
      { instruction: "Tense your hands — make fists", duration: 5, phase: "tense" },
      { instruction: "Release and relax your hands", duration: 5, phase: "relax" },
      { instruction: "Tense your shoulders — lift them up", duration: 5, phase: "tense" },
      { instruction: "Release and drop your shoulders", duration: 5, phase: "relax" },
      { instruction: "Tense your face — scrunch it up", duration: 5, phase: "tense" },
      { instruction: "Release and relax your face", duration: 5, phase: "relax" },
      { instruction: "Tense your whole body", duration: 5, phase: "tense" },
      { instruction: "Release everything completely", duration: 10, phase: "relax" },
    ],
    rounds: 1,
    companionMessages: [
      "Let's release all that tension. I'll guide you through each muscle group. 💪",
      "Tense... and release. Feel the difference.",
      "You're carrying less tension already.",
      "Keep going. Your body is thanking you.",
      "Almost done. One more area to release.",
      "Feel how light your body is now.",
      "Last one. Give it everything.",
      "You did it! Your whole body is relaxed. You're amazing! ✨",
    ],
  },
];

export default function CompanionMode() {
  const { isAuthenticated, loading } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState<typeof exercises[0] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [companionMessage, setCompanionMessage] = useState("Hi! I'm Hana. I'm here to guide you through wellness exercises. Pick one and let's start together! 🌸");
  const [hanaMood, setHanaMood] = useState<string>("calm");
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startExercise = useCallback((exercise: typeof exercises[0]) => {
    setSelectedExercise(exercise);
    setCurrentStep(0);
    setCurrentRound(0);
    setIsRunning(true);
    setIsComplete(false);
    setTimeLeft(exercise.steps[0].duration);
    setCompanionMessage(exercise.companionMessages[0]);
    setHanaMood("encouraging");
  }, []);

  // Timer logic
  useEffect(() => {
    if (!isRunning || !selectedExercise) return;
    clearTimer();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Move to next step
          const nextStep = currentStep + 1;
          if (nextStep >= selectedExercise.steps.length) {
            // Next round
            const nextRound = currentRound + 1;
            if (nextRound >= selectedExercise.rounds) {
              // Exercise complete!
              setIsRunning(false);
              setIsComplete(true);
              setHanaMood("celebrating");
              setCompanionMessage(selectedExercise.companionMessages[selectedExercise.companionMessages.length - 1]);
              clearTimer();
              return 0;
            }
            setCurrentRound(nextRound);
            setCurrentStep(0);
            const msgIdx = Math.min(nextRound, selectedExercise.companionMessages.length - 1);
            setCompanionMessage(selectedExercise.companionMessages[msgIdx]);
            return selectedExercise.steps[0].duration;
          }
          setCurrentStep(nextStep);
          const msgIdx = Math.min(nextStep, selectedExercise.companionMessages.length - 1);
          setCompanionMessage(selectedExercise.companionMessages[msgIdx]);
          return selectedExercise.steps[nextStep].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, currentStep, currentRound, selectedExercise, clearTimer]);

  const resetExercise = () => {
    clearTimer();
    setIsRunning(false);
    setIsComplete(false);
    setCurrentStep(0);
    setCurrentRound(0);
    setTimeLeft(0);
    setHanaMood("calm");
    setCompanionMessage("Ready for another round? Pick an exercise! 🌸");
    setSelectedExercise(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#f5a3c0] border-t-[#e8729a] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white border-[#f5a3c0]/20">
          <Sparkles className="w-16 h-16 text-[#e8729a] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#3d2b2e] mb-2">Meet Hana</h2>
          <p className="text-[#8a7075] mb-6">Sign in to access your wellness companion.</p>
          <a href={getLoginUrl()}>
            <Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-8">Sign In</Button>
          </a>
        </Card>
      </div>
    );
  }

  const currentStepData = selectedExercise?.steps[currentStep];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f5a3c0]/20">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href={selectedExercise ? "#" : "/"}>
              <Button variant="ghost" size="sm" className="text-[#8a7075]" onClick={selectedExercise ? resetExercise : undefined}>
                <ArrowLeft className="w-4 h-4 mr-1" /> {selectedExercise ? 'Back' : 'Home'}
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#e8729a]" />
              <span className="font-bold text-[#3d2b2e]">Companion Mode</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6 max-w-2xl mx-auto">
        {/* Hana & Message */}
        <div className="text-center mb-8">
          <CompanionHana mood={hanaMood} size={isRunning ? 140 : 120} />
          <div className="mt-4 bg-white border border-[#f5a3c0]/20 rounded-2xl p-4 shadow-sm relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-[#f5a3c0]/20 rotate-45" />
            <p className="text-[#3d2b2e] font-medium relative">{companionMessage}</p>
          </div>
        </div>

        {/* Active Exercise */}
        {selectedExercise && !isComplete && (
          <Card className="p-6 bg-white border-[#f5a3c0]/20 mb-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#3d2b2e] mb-2">{selectedExercise.name}</h3>
              <p className="text-sm text-[#8a7075] mb-6">Round {currentRound + 1} of {selectedExercise.rounds}</p>

              {/* Timer circle */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#fdf2f4" strokeWidth="6" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e8729a" strokeWidth="6"
                    strokeDasharray={`${currentStepData ? (timeLeft / currentStepData.duration) * 264 : 0} 264`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <span className="text-5xl font-bold text-[#3d2b2e]">{timeLeft}</span>
                    <p className="text-xs text-[#8a7075]">seconds</p>
                  </div>
                </div>
              </div>

              {/* Current instruction */}
              <div className={`p-4 rounded-2xl mb-4 ${
                currentStepData?.phase === 'inhale' ? 'bg-[#7ab87a]/10' :
                currentStepData?.phase === 'exhale' ? 'bg-[#7ab8c4]/10' :
                currentStepData?.phase === 'hold' ? 'bg-[#e8a849]/10' :
                currentStepData?.phase === 'tense' ? 'bg-[#d4556b]/10' :
                currentStepData?.phase === 'relax' ? 'bg-[#7ab87a]/10' :
                'bg-[#e8729a]/10'
              }`}>
                <p className="text-lg font-semibold text-[#3d2b2e]">{currentStepData?.instruction}</p>
              </div>

              {/* Step progress */}
              <div className="flex justify-center gap-2 mb-4">
                {selectedExercise.steps.map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full transition-all ${
                    i < currentStep ? 'bg-[#e8729a]' : i === currentStep ? 'bg-[#e8729a] scale-125' : 'bg-[#fdf2f4]'
                  }`} />
                ))}
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-3">
                <Button onClick={() => setIsRunning(!isRunning)} className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-6">
                  {isRunning ? <><Pause className="w-4 h-4 mr-2" /> Pause</> : <><Play className="w-4 h-4 mr-2" /> Resume</>}
                </Button>
                <Button onClick={resetExercise} variant="outline" className="border-[#f5a3c0] text-[#c4507a] rounded-full px-6">
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Completion */}
        {isComplete && (
          <Card className="p-8 bg-white border-[#f5a3c0]/20 mb-6 text-center">
            <CheckCircle className="w-16 h-16 text-[#7ab87a] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#3d2b2e] mb-2">Exercise Complete!</h3>
            <p className="text-[#8a7075] mb-6">You did amazing. Hana is proud of you! 🌸</p>
            <div className="flex justify-center gap-3">
              <Button onClick={resetExercise} className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-6">
                Try Another Exercise
              </Button>
              <Link href="/health">
                <Button variant="outline" className="border-[#f5a3c0] text-[#c4507a] rounded-full px-6">
                  <HeartPulse className="w-4 h-4 mr-2" /> Check Vitals
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Exercise Selection */}
        {!selectedExercise && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#3d2b2e]">Choose an Exercise</h3>
            {exercises.map(ex => (
              <Card
                key={ex.id}
                className="p-5 bg-white border-[#f5a3c0]/20 hover:border-[#f5a3c0]/40 hover:shadow-md transition-all cursor-pointer"
                onClick={() => startExercise(ex)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#e8729a]/10 flex items-center justify-center">
                      {ex.trigger === 'arrhythmia' ? <HeartPulse className="w-6 h-6 text-[#d4556b]" /> :
                       ex.trigger === 'stress_episode' ? <Activity className="w-6 h-6 text-[#e8a849]" /> :
                       <Wind className="w-6 h-6 text-[#7ab8c4]" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#3d2b2e]">{ex.name}</h4>
                      <p className="text-sm text-[#8a7075]">{ex.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#8a7075]">
                        <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {ex.steps.reduce((a, s) => a + s.duration, 0) * ex.rounds}s</span>
                        <span>{ex.rounds} round{ex.rounds > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#8a7075]" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
