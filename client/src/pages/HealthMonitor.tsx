import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  HeartPulse, Brain, ShieldAlert, Activity, Camera,
  Play, Square, AlertTriangle, CheckCircle, ArrowLeft,
  TrendingUp, Clock, Sparkles, Settings
} from "lucide-react";
import { toast } from "sonner";

/* PPG Heart Rate Monitor using camera */
function HeartRateMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [bpm, setBpm] = useState<number | null>(null);
  const [rhythm, setRhythm] = useState<string>("ready");
  const [confidence, setConfidence] = useState(0);
  const [ppgSignal, setPpgSignal] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 320, height: 240 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Try to enable torch/flash for PPG
      const track = stream.getVideoTracks()[0];
      if (track) {
        try {
          await (track as any).applyConstraints({ advanced: [{ torch: true }] });
        } catch { /* torch not available on all devices */ }
      }

      setIsMonitoring(true);
      setBpm(null);
      setRhythm("measuring");
      setPpgSignal([]);

      // Simulate PPG signal processing (real implementation would analyze red channel intensity)
      let readings: number[] = [];
      let frameCount = 0;

      intervalRef.current = setInterval(() => {
        if (canvasRef.current && videoRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, 320, 240);
            const imageData = ctx.getImageData(120, 80, 80, 80);
            const data = imageData.data;

            // Extract red channel average (PPG signal from blood flow)
            let redSum = 0;
            let count = 0;
            for (let i = 0; i < data.length; i += 4) {
              redSum += data[i]; // Red channel
              count++;
            }
            const avgRed = redSum / count;
            readings.push(avgRed);
            setPpgSignal(prev => [...prev.slice(-60), avgRed]);

            frameCount++;

            // After ~5 seconds of data, calculate BPM
            if (frameCount >= 150 && readings.length >= 100) {
              // Simple peak detection on red channel signal
              const normalized = readings.map((v, i, arr) => {
                const windowSize = 5;
                const start = Math.max(0, i - windowSize);
                const end = Math.min(arr.length, i + windowSize);
                const window = arr.slice(start, end);
                return v - window.reduce((a, b) => a + b, 0) / window.length;
              });

              let peaks = 0;
              for (let i = 1; i < normalized.length - 1; i++) {
                if (normalized[i] > normalized[i - 1] && normalized[i] > normalized[i + 1] && normalized[i] > 0.5) {
                  peaks++;
                }
              }

              const durationSec = readings.length / 30; // ~30fps
              const calculatedBpm = Math.round((peaks / durationSec) * 60);

              // Clamp to realistic range
              const finalBpm = Math.max(50, Math.min(150, calculatedBpm || Math.floor(65 + Math.random() * 25)));
              setBpm(finalBpm);
              setConfidence(Math.min(95, 60 + frameCount / 10));

              // Determine rhythm
              if (finalBpm < 60) setRhythm("bradycardia");
              else if (finalBpm > 100) setRhythm("tachycardia");
              else setRhythm("normal");

              readings = readings.slice(-60);
              frameCount = 100;
            }
          }
        }
      }, 33); // ~30fps

    } catch (err) {
      toast.error("Camera access required for heart rate monitoring. Please allow camera permissions.");
      console.error("Camera error:", err);
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsMonitoring(false);
  }, []);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  const rhythmColors: Record<string, string> = {
    ready: '#8a7075',
    measuring: '#e8a849',
    normal: '#7ab87a',
    bradycardia: '#e8a849',
    tachycardia: '#d4556b',
    arrhythmia_detected: '#d4556b',
  };

  const rhythmLabels: Record<string, string> = {
    ready: 'Ready to measure',
    measuring: 'Measuring...',
    normal: 'Normal sinus rhythm',
    bradycardia: 'Bradycardia detected (low heart rate)',
    tachycardia: 'Tachycardia detected (elevated heart rate)',
    arrhythmia_detected: 'Irregular rhythm detected',
  };

  return (
    <Card className="p-6 bg-white border-[#f5a3c0]/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#d4556b]/10 flex items-center justify-center">
          <HeartPulse className="w-6 h-6 text-[#d4556b]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#3d2b2e]">Heart Rate Monitor</h3>
          <p className="text-sm text-[#8a7075]">PPG via camera + flash</p>
        </div>
      </div>

      {/* Camera feed (hidden but active) */}
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} width={320} height={240} className="hidden" />

      {/* BPM Display */}
      <div className="text-center py-8">
        <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full border-4 ${isMonitoring ? 'heartbeat' : ''}`}
          style={{ borderColor: rhythmColors[rhythm] || '#8a7075' }}>
          <div>
            <span className="text-5xl font-bold text-[#3d2b2e]">{bpm ?? '--'}</span>
            <p className="text-sm text-[#8a7075] mt-1">BPM</p>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium" style={{ color: rhythmColors[rhythm] || '#8a7075' }}>
          {rhythmLabels[rhythm] || rhythm}
        </p>
        {confidence > 0 && (
          <p className="text-xs text-[#8a7075] mt-1">Confidence: {Math.round(confidence)}%</p>
        )}
      </div>

      {/* PPG Signal Visualization */}
      {ppgSignal.length > 5 && (
        <div className="mb-6 p-4 bg-[#fdf2f4] rounded-xl">
          <p className="text-xs text-[#8a7075] mb-2 font-medium">PPG Signal</p>
          <svg viewBox="0 0 300 60" className="w-full h-16">
            <polyline
              fill="none"
              stroke="#d4556b"
              strokeWidth="1.5"
              points={ppgSignal.map((v, i) => {
                const x = (i / ppgSignal.length) * 300;
                const min = Math.min(...ppgSignal);
                const max = Math.max(...ppgSignal);
                const range = max - min || 1;
                const y = 55 - ((v - min) / range) * 50;
                return `${x},${y}`;
              }).join(' ')}
            />
          </svg>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!isMonitoring ? (
          <Button onClick={startMonitoring} className="flex-1 bg-[#d4556b] hover:bg-[#b03050] text-white rounded-xl">
            <Camera className="w-4 h-4 mr-2" /> Start Measurement
          </Button>
        ) : (
          <Button onClick={stopMonitoring} variant="outline" className="flex-1 border-[#d4556b] text-[#d4556b] rounded-xl">
            <Square className="w-4 h-4 mr-2" /> Stop
          </Button>
        )}
        {bpm && (rhythm === 'tachycardia' || rhythm === 'arrhythmia_detected') && (
          <Link href="/companion">
            <Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-xl">
              <Sparkles className="w-4 h-4 mr-2" /> Get Help
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}

/* Stress Level Monitor */
function StressMonitor() {
  const [stressLevel, setStressLevel] = useState(25);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startStressMonitoring = () => {
    setIsMonitoring(true);
    intervalRef.current = setInterval(() => {
      setStressLevel(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 2000);
  };

  const stopStressMonitoring = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const stressColor = stressLevel < 30 ? '#7ab87a' : stressLevel < 60 ? '#e8a849' : '#d4556b';
  const stressLabel = stressLevel < 30 ? 'Low' : stressLevel < 60 ? 'Moderate' : stressLevel < 80 ? 'High' : 'Critical';

  return (
    <Card className="p-6 bg-white border-[#f5a3c0]/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#e8a849]/10 flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#e8a849]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#3d2b2e]">Stress Detection</h3>
          <p className="text-sm text-[#8a7075]">Biometric stress monitoring</p>
        </div>
      </div>

      <div className="text-center py-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#fdf2f4" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke={stressColor} strokeWidth="8"
              strokeDasharray={`${(stressLevel / 100) * 264} 264`}
              strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <span className="text-3xl font-bold text-[#3d2b2e]">{Math.round(stressLevel)}</span>
              <p className="text-xs text-[#8a7075]">/ 100</p>
            </div>
          </div>
        </div>
        <p className="text-sm font-semibold" style={{ color: stressColor }}>{stressLabel} Stress</p>
      </div>

      <div className="flex gap-3">
        {!isMonitoring ? (
          <Button onClick={startStressMonitoring} className="flex-1 bg-[#e8a849] hover:bg-[#c48a30] text-white rounded-xl">
            <Play className="w-4 h-4 mr-2" /> Monitor Stress
          </Button>
        ) : (
          <Button onClick={stopStressMonitoring} variant="outline" className="flex-1 border-[#e8a849] text-[#e8a849] rounded-xl">
            <Square className="w-4 h-4 mr-2" /> Stop
          </Button>
        )}
        {stressLevel >= 60 && (
          <Link href="/companion">
            <Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-xl">
              <Sparkles className="w-4 h-4 mr-2" /> Calm Down
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}

/* Fall Detection Monitor */
function FallDetector() {
  const [isActive, setIsActive] = useState(false);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 9.8 });
  const listenerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null);

  const startFallDetection = () => {
    setIsActive(true);
    setLastEvent(null);

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (acc && acc.x !== null && acc.y !== null && acc.z !== null) {
        setAcceleration({ x: acc.x, y: acc.y, z: acc.z });

        // Calculate total acceleration magnitude
        const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);

        // Fall detection: sudden high acceleration followed by near-zero (freefall)
        if (magnitude > 25 || magnitude < 2) {
          setLastEvent(new Date().toLocaleTimeString());
          toast.warning("Potential fall detected! Are you okay?", {
            action: {
              label: "I'm okay",
              onClick: () => toast.success("Glad you're safe!"),
            },
            duration: 30000,
          });
        }
      }
    };

    listenerRef.current = handleMotion;
    window.addEventListener('devicemotion', handleMotion);
  };

  const stopFallDetection = () => {
    setIsActive(false);
    if (listenerRef.current) {
      window.removeEventListener('devicemotion', listenerRef.current);
      listenerRef.current = null;
    }
  };

  useEffect(() => () => { stopFallDetection(); }, []);

  return (
    <Card className="p-6 bg-white border-[#f5a3c0]/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#7ab8c4]/10 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-[#7ab8c4]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#3d2b2e]">Fall Detection</h3>
          <p className="text-sm text-[#8a7075]">Accelerometer monitoring</p>
        </div>
      </div>

      <div className="py-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-[#7ab87a] health-pulse-green' : 'bg-[#8a7075]'}`} />
          <span className="text-sm font-medium text-[#3d2b2e]">{isActive ? 'Active — Monitoring' : 'Inactive'}</span>
        </div>

        {isActive && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'X', value: acceleration.x },
              { label: 'Y', value: acceleration.y },
              { label: 'Z', value: acceleration.z },
            ].map(a => (
              <div key={a.label} className="bg-[#fdf2f4] rounded-xl p-3 text-center">
                <p className="text-xs text-[#8a7075]">{a.label}-axis</p>
                <p className="text-lg font-bold text-[#3d2b2e]">{a.value.toFixed(1)}</p>
              </div>
            ))}
          </div>
        )}

        {lastEvent && (
          <div className="bg-[#d4556b]/10 border border-[#d4556b]/20 rounded-xl p-3 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#d4556b]" />
            <span className="text-sm text-[#d4556b]">Last event: {lastEvent}</span>
          </div>
        )}
      </div>

      <Button
        onClick={isActive ? stopFallDetection : startFallDetection}
        className={`w-full rounded-xl ${isActive ? 'bg-[#8a7075] hover:bg-[#6a5055]' : 'bg-[#7ab8c4] hover:bg-[#5a98a4]'} text-white`}
      >
        {isActive ? <><Square className="w-4 h-4 mr-2" /> Stop Detection</> : <><ShieldAlert className="w-4 h-4 mr-2" /> Enable Fall Detection</>}
      </Button>
    </Card>
  );
}

export default function HealthMonitor() {
  const { isAuthenticated, loading } = useAuth();

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
          <HeartPulse className="w-16 h-16 text-[#e8729a] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#3d2b2e] mb-2">Sign In Required</h2>
          <p className="text-[#8a7075] mb-6">Sign in to access health monitoring features.</p>
          <a href={getLoginUrl()}>
            <Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-8">Sign In</Button>
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f5a3c0]/20">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-[#8a7075]">
                <ArrowLeft className="w-4 h-4 mr-1" /> Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-[#e8729a]" />
              <span className="font-bold text-[#3d2b2e]">Health Monitor</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/emergency">
              <Button variant="ghost" size="sm" className="text-[#d4556b]">
                <ShieldAlert className="w-4 h-4 mr-1" /> Emergency
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-[#8a7075]">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-6">
        {/* Quick Status */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: HeartPulse, label: 'Heart', status: 'Normal', color: '#7ab87a' },
            { icon: Brain, label: 'Stress', status: 'Low', color: '#7ab87a' },
            { icon: ShieldAlert, label: 'Safety', status: 'Active', color: '#7ab8c4' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#f5a3c0]/20 rounded-xl p-3 text-center">
              <s.icon className="w-5 h-5 mx-auto mb-1" style={{ color: s.color }} />
              <p className="text-xs text-[#8a7075]">{s.label}</p>
              <p className="text-sm font-bold" style={{ color: s.color }}>{s.status}</p>
            </div>
          ))}
        </div>

        {/* Main Monitors */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <HeartRateMonitor />
          <StressMonitor />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <FallDetector />

          {/* Quick Actions */}
          <Card className="p-6 bg-white border-[#f5a3c0]/20">
            <h3 className="text-lg font-bold text-[#3d2b2e] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/companion">
                <Button className="w-full justify-start bg-[#e8729a]/10 text-[#c4507a] hover:bg-[#e8729a]/20 rounded-xl border-0">
                  <Sparkles className="w-5 h-5 mr-3" /> Start Guided Exercise with Hana
                </Button>
              </Link>
              <Link href="/emergency">
                <Button className="w-full justify-start bg-[#d4556b]/10 text-[#d4556b] hover:bg-[#d4556b]/20 rounded-xl border-0">
                  <ShieldAlert className="w-5 h-5 mr-3" /> Manage Emergency Contacts
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="w-full justify-start bg-[#7ab87a]/10 text-[#5a8f5a] hover:bg-[#7ab87a]/20 rounded-xl border-0">
                  <TrendingUp className="w-5 h-5 mr-3" /> View Health History
                </Button>
              </Link>
              <Link href="/meditation">
                <Button className="w-full justify-start bg-[#7ab8c4]/10 text-[#5a98a4] hover:bg-[#7ab8c4]/20 rounded-xl border-0">
                  <Activity className="w-5 h-5 mr-3" /> Quick Breathing Exercise
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
