import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  HeartPulse, ShieldAlert, Brain, Activity, Sparkles,
  ArrowRight, Target, BookOpen, Wind, Star, Compass
} from "lucide-react";

/* Inline SVG cherry blossom branch decoration */
function CherryBlossom({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 180 Q80 140 60 120 Q40 100 30 70 Q20 40 40 30 Q60 20 70 40 Q80 60 90 80" stroke="#e8729a" strokeWidth="2" fill="none" opacity="0.3" />
      <circle cx="30" cy="70" r="8" fill="#f5a3c0" opacity="0.6" />
      <circle cx="35" cy="62" r="6" fill="#f5a3c0" opacity="0.5" />
      <circle cx="25" cy="65" r="7" fill="#e8729a" opacity="0.4" />
      <circle cx="60" cy="120" r="9" fill="#f5a3c0" opacity="0.5" />
      <circle cx="55" cy="112" r="7" fill="#f5a3c0" opacity="0.4" />
      <circle cx="65" cy="115" r="6" fill="#e8729a" opacity="0.3" />
      <circle cx="45" cy="95" r="7" fill="#f5a3c0" opacity="0.5" />
      <circle cx="50" cy="88" r="5" fill="#e8729a" opacity="0.4" />
      <circle cx="70" cy="40" r="10" fill="#f5a3c0" opacity="0.6" />
      <circle cx="75" cy="32" r="7" fill="#f5a3c0" opacity="0.5" />
      <circle cx="65" cy="35" r="8" fill="#e8729a" opacity="0.4" />
    </svg>
  );
}

/* Chibi mascot Hana */
function ChibiHana({ size = 120 }: { size?: number }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 140" width={size} height={size * 1.17}>
        {/* Hair back */}
        <ellipse cx="60" cy="45" rx="38" ry="35" fill="#3d2b2e" />
        {/* Face */}
        <ellipse cx="60" cy="52" rx="30" ry="28" fill="#ffecd2" />
        {/* Hair bangs */}
        <path d="M25 40 Q35 15 60 18 Q85 15 95 40 Q90 30 75 25 Q60 22 45 25 Q30 30 25 40Z" fill="#3d2b2e" />
        {/* Eyes */}
        <ellipse cx="45" cy="52" rx="4" ry="5" fill="#3d2b2e" />
        <ellipse cx="75" cy="52" rx="4" ry="5" fill="#3d2b2e" />
        <circle cx="43" cy="50" r="1.5" fill="white" />
        <circle cx="73" cy="50" r="1.5" fill="white" />
        {/* Blush */}
        <ellipse cx="36" cy="60" rx="6" ry="3" fill="#f5a3c0" opacity="0.5" />
        <ellipse cx="84" cy="60" rx="6" ry="3" fill="#f5a3c0" opacity="0.5" />
        {/* Mouth */}
        <path d="M54 64 Q60 69 66 64" stroke="#3d2b2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Cherry blossom in hair */}
        <circle cx="88" cy="30" r="5" fill="#f5a3c0" />
        <circle cx="92" cy="26" r="4" fill="#e8729a" />
        <circle cx="85" cy="25" r="3" fill="#f5a3c0" opacity="0.7" />
        {/* Body */}
        <path d="M35 78 Q35 72 60 72 Q85 72 85 78 L85 110 Q85 125 60 125 Q35 125 35 110Z" fill="white" stroke="#f5a3c0" strokeWidth="1.5" />
        {/* Heart on body */}
        <path d="M55 92 Q55 86 60 86 Q65 86 65 92 Q65 98 60 102 Q55 98 55 92Z" fill="#e8729a" opacity="0.6" />
        {/* Arms */}
        <path d="M35 85 Q25 90 22 100" stroke="#ffecd2" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M85 85 Q95 90 98 100" stroke="#ffecd2" strokeWidth="8" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f5a3c0]/20">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="w-7 h-7 text-[#e8729a]" />
            <span className="text-xl font-bold text-[#3d2b2e]">Anime Ascend</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#8a7075]">
            <Link href="/health" className="hover:text-[#e8729a] transition-colors">Health Monitor</Link>
            <Link href="/companion" className="hover:text-[#e8729a] transition-colors">Companion</Link>
            <Link href="/dashboard" className="hover:text-[#e8729a] transition-colors">Dashboard</Link>
            <Link href="/pricing" className="hover:text-[#e8729a] transition-colors">Pricing</Link>
            <Link href="/support" className="hover:text-[#e8729a] transition-colors">Support</Link>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/health">
                <Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-6">
                  Health Monitor
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-6">
                  Get Started
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <CherryBlossom className="absolute top-0 right-0 w-48 h-48 opacity-40 petal-float" />
        <CherryBlossom className="absolute bottom-10 left-0 w-36 h-36 opacity-30 petal-float" style={{ animationDelay: '2s' }} />

        <div className="container relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fdf2f4] border border-[#f5a3c0]/30 text-sm text-[#c4507a] font-medium mb-6">
                <HeartPulse className="w-4 h-4" />
                Your Health Companion
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-[#3d2b2e] leading-tight mb-6">
                Your Wellness
                <span className="sakura-text block">Guardian Angel</span>
              </h1>
              <p className="text-lg text-[#8a7075] leading-relaxed mb-8 max-w-lg">
                Monitor your heart health, detect stress episodes, and stay safe with fall detection.
                Your chibi companion Hana guides you through every moment — and stays with you until you're okay.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link href="/health">
                    <Button size="lg" className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-8 text-base">
                      Open Health Monitor <HeartPulse className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button size="lg" className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-8 text-base">
                      Start Free <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </a>
                )}
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-[#f5a3c0] text-[#c4507a] hover:bg-[#fdf2f4]">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 rounded-full bg-gradient-to-br from-[#fdf2f4] to-[#f5a3c0]/20 flex items-center justify-center">
                  <ChibiHana size={180} />
                </div>
                {/* Floating health indicators */}
                <div className="absolute -top-2 -right-2 bg-white border border-[#f5a3c0]/30 shadow-md p-3 rounded-xl health-pulse">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-[#d4556b]" />
                    <span className="text-sm font-bold text-[#3d2b2e]">72 BPM</span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -left-2 bg-white border border-[#7ab87a]/30 shadow-md p-3 rounded-xl health-pulse-green">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-[#7ab87a]" />
                    <span className="text-sm font-bold text-[#3d2b2e]">Safe</span>
                  </div>
                </div>
                <div className="absolute top-1/2 -left-8 bg-white border border-[#e8a849]/30 shadow-md p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#e8a849]" />
                    <span className="text-sm font-bold text-[#3d2b2e]">Calm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Health Features */}
      <section className="py-20 sakura-gradient">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d2b2e] mb-4">Core Health Monitoring</h2>
            <p className="text-[#8a7075] text-lg max-w-2xl mx-auto">
              Advanced health monitoring that watches over you — and guides you through recovery when something's not right.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: HeartPulse, color: '#d4556b', title: 'Heart Arrhythmia Detection', desc: 'Uses your phone camera and flash for PPG (photoplethysmography) to detect irregular heartbeats, heart rate variability, tachycardia, and bradycardia in real-time.' },
              { icon: Brain, color: '#e8a849', title: 'Stress Detection', desc: 'Monitors biometric signals to detect stress episodes. When elevated stress is detected, Hana immediately offers guided exercises to bring you back to calm.' },
              { icon: ShieldAlert, color: '#7ab8c4', title: 'Fall Detection', desc: 'Accelerometer and gyroscope monitoring detects falls instantly. Alerts emergency contacts automatically — especially vital for elderly or chronically ill users.' },
              { icon: Activity, color: '#7ab87a', title: 'Guided Exercises', desc: "When arrhythmia or stress is detected, Hana doesn't just show a list — she stays with you through the entire exercise session until your vitals stabilize." },
              { icon: Sparkles, color: '#e8729a', title: 'Companion Mode', desc: 'Hana remains present and active during health episodes. She talks you through breathing, monitors your progress, and celebrates when you are stable again.' },
              { icon: ShieldAlert, color: '#d4556b', title: 'Emergency Alerts', desc: 'If a fall is detected or vitals are concerning, the app automatically alerts your emergency contacts with your location and health status.' },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-[#f5a3c0]/20 p-8 rounded-2xl shadow-sm hover:shadow-lg hover:border-[#f5a3c0]/40 transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: `${f.color}15` }}>
                  <f.icon className="w-7 h-7" style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-bold text-[#3d2b2e] mb-3">{f.title}</h3>
                <p className="text-[#8a7075] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary Features */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d2b2e] mb-4">Wellness Toolkit</h2>
            <p className="text-[#8a7075] text-lg max-w-2xl mx-auto">
              Beyond health monitoring, build lasting wellness habits with our complete toolkit.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: Target, label: 'Habits', path: '/habits', color: '#e8729a' },
              { icon: BookOpen, label: 'Journal', path: '/journal', color: '#7ab87a' },
              { icon: Wind, label: 'Meditation', path: '/meditation', color: '#7ab8c4' },
              { icon: Star, label: 'Goals', path: '/goals', color: '#e8a849' },
              { icon: Compass, label: 'Discover', path: '/discover', color: '#c4507a' },
            ].map((item) => (
              <Link key={item.label} href={item.path}>
                <div className="bg-white border border-[#f5a3c0]/20 p-6 rounded-2xl text-center shadow-sm hover:shadow-md hover:border-[#f5a3c0]/40 transition-all group">
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${item.color}15` }}>
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <span className="text-sm font-semibold text-[#3d2b2e]">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sakura-gradient">
        <div className="container text-center">
          <ChibiHana size={100} />
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2b2e] mb-4 mt-6">Let Hana Watch Over You</h2>
          <p className="text-[#8a7075] text-lg max-w-xl mx-auto mb-8">
            Start monitoring your heart health today. Your chibi companion is ready to guide you through every wellness moment.
          </p>
          {isAuthenticated ? (
            <Link href="/health">
              <Button size="lg" className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-10 text-base">
                Open Health Monitor <HeartPulse className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-10 text-base">
                Start Free — No Credit Card <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#f5a3c0]/20">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-[#e8729a]" />
              <span className="font-bold text-[#3d2b2e]">Anime Ascend</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#8a7075]">
              <Link href="/pricing" className="hover:text-[#e8729a]">Pricing</Link>
              <Link href="/support" className="hover:text-[#e8729a]">Support</Link>
              <Link href="/settings" className="hover:text-[#e8729a]">Settings</Link>
            </div>
            <p className="text-sm text-[#8a7075]">&copy; 2026 Anime Ascend. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
