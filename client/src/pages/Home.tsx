import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Zap, BookOpen, Wind, Star, Users, ArrowRight, Sparkles } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-teal-400" />
            <h1 className="text-xl font-bold text-white">Anime Ascend</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    Settings
                  </Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-teal-500 hover:bg-teal-600">Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your Journey to <span className="bg-gradient-to-r from-teal-400 to-pink-500 bg-clip-text text-transparent">Growth</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Transform your life through anime-inspired wellness. Track habits, meditate, journal, and grow with a community of people on their personal growth journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8">
                  Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8">
                  Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            )}
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <h3 className="text-3xl font-bold text-white text-center mb-12">What You Can Do</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: "Track Habits",
              description: "Build streaks and transform your daily routines with anime-inspired motivation.",
            },
            {
              icon: BookOpen,
              title: "Journal Your Journey",
              description: "Reflect on your growth with guided journaling and mood tracking.",
            },
            {
              icon: Wind,
              title: "Meditate & Breathe",
              description: "Find calm with guided meditations and breathing exercises.",
            },
            {
              icon: Star,
              title: "Set & Achieve Goals",
              description: "Define your milestones and celebrate your progress.",
            },
            {
              icon: Sparkles,
              title: "AI Wellness Coach",
              description: "Get personalized guidance from your AI wellness coach.",
            },
            {
              icon: Users,
              title: "Community Support",
              description: "Connect with others on their wellness journey.",
            },
          ].map((feature, idx) => (
            <Card key={idx} className="bg-slate-800/50 border-slate-700 hover:border-teal-500/50 transition-all p-6">
              <feature.icon className="w-8 h-8 text-teal-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-slate-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-20">
        <h3 className="text-3xl font-bold text-white text-center mb-12">Simple Pricing</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Free",
              price: "$0",
              tokens: "5 AI messages/month",
              features: ["Basic habit tracking", "Mood logging", "Community access"],
            },
            {
              name: "Premium",
              price: "$9.99",
              tokens: "50 AI messages/month",
              features: ["Everything in Free", "Advanced analytics", "Guided meditations", "Priority support"],
              highlighted: true,
            },
            {
              name: "Pro",
              price: "$19.99",
              tokens: "200 AI messages/month",
              features: ["Everything in Premium", "Personalized recommendations", "Early access to features"],
            },
          ].map((tier, idx) => (
            <Card
              key={idx}
              className={`p-6 transition-all ${
                tier.highlighted
                  ? "bg-gradient-to-br from-teal-500/20 to-pink-500/20 border-teal-500/50"
                  : "bg-slate-800/50 border-slate-700"
              }`}
            >
              <h4 className="text-2xl font-bold text-white mb-2">{tier.name}</h4>
              <p className="text-3xl font-bold text-teal-400 mb-1">{tier.price}</p>
              <p className="text-sm text-slate-400 mb-6">{tier.tokens}</p>
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  tier.highlighted
                    ? "bg-teal-500 hover:bg-teal-600"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center">
        <div className="bg-gradient-to-r from-teal-500/10 to-pink-500/10 border border-teal-500/30 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Life?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of people on their wellness journey. Start free today, upgrade anytime.
          </p>
          {!isAuthenticated && (
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white">
                Start Your Journey Now
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 py-8">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-teal-400">Features</a></li>
                <li><a href="#" className="hover:text-teal-400">Pricing</a></li>
                <li><a href="#" className="hover:text-teal-400">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-teal-400">Help Center</a></li>
                <li><a href="#" className="hover:text-teal-400">Contact</a></li>
                <li><a href="#" className="hover:text-teal-400">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-teal-400">Privacy</a></li>
                <li><a href="#" className="hover:text-teal-400">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-teal-400">Discord</a></li>
                <li><a href="#" className="hover:text-teal-400">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 text-center text-slate-400">
            <p>&copy; 2026 Anime Ascend. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Icon placeholder (use from lucide-react)
const Target = Zap;
