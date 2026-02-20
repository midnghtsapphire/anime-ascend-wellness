import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowLeft, Sparkles, Crown, Star } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";

const tiers = [
  {
    id: 'free',
    name: 'Blossom',
    price: '$0',
    period: 'forever',
    icon: Star,
    color: '#7ab87a',
    desc: 'Start your wellness journey',
    features: [
      'Heart rate monitoring (3x/day)',
      'Basic stress detection',
      'Habit tracker (5 habits)',
      'Journal (5 entries/month)',
      '3 guided exercises/month',
      'Community support',
    ],
    cta: 'Get Started Free',
    tier: 'free' as const,
  },
  {
    id: 'premium',
    name: 'Sakura',
    price: '$9.99',
    period: '/month',
    icon: Sparkles,
    color: '#e8729a',
    desc: 'Full health monitoring',
    popular: true,
    features: [
      'Unlimited heart monitoring',
      'Advanced stress detection',
      'Fall detection alerts',
      'Unlimited habits & journal',
      'AI wellness coach',
      'Companion mode (unlimited)',
      'Emergency contact alerts',
      '50 AI tokens/month',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    tier: 'premium' as const,
  },
  {
    id: 'pro',
    name: 'Hanami',
    price: '$19.99',
    period: '/month',
    icon: Crown,
    color: '#e8a849',
    desc: 'Complete wellness suite',
    features: [
      'Everything in Sakura',
      'Real-time continuous monitoring',
      'Advanced arrhythmia detection',
      'Family member monitoring',
      '200 AI tokens/month',
      'Custom exercise programs',
      'Health data export',
      'Dedicated support',
      'Early access to new features',
    ],
    cta: 'Start Free Trial',
    tier: 'pro' as const,
  },
];

export default function Pricing() {
  const { isAuthenticated, loading } = useAuth();
  const checkoutMutation = trpc.billing.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
        toast.success("Redirecting to checkout...");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
    },
  });

  const handleSubscribe = (tier: 'free' | 'premium' | 'pro') => {
    if (tier === 'free') { toast.success("You're on the free plan!"); return; }
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    checkoutMutation.mutate({ tier });
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-[#f5a3c0] border-t-[#e8729a] animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f5a3c0]/20">
        <div className="container flex items-center h-14">
          <Link href="/"><Button variant="ghost" size="sm" className="text-[#8a7075]"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link>
          <span className="font-bold text-[#3d2b2e] ml-3">Pricing</span>
        </div>
      </header>

      <div className="container py-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#3d2b2e] mb-3">Choose Your Path</h1>
          <p className="text-[#8a7075] max-w-lg mx-auto">Every plan includes core health monitoring. Upgrade for advanced features and unlimited access.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {tiers.map(tier => (
            <Card key={tier.id} className={`p-6 bg-white relative overflow-hidden transition-all hover:shadow-lg ${
              tier.popular ? 'border-[#e8729a] border-2 shadow-md' : 'border-[#f5a3c0]/20'
            }`}>
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-[#e8729a] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">Most Popular</div>
              )}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: `${tier.color}15` }}>
                  <tier.icon className="w-6 h-6" style={{ color: tier.color }} />
                </div>
                <h3 className="text-xl font-bold text-[#3d2b2e]">{tier.name}</h3>
                <p className="text-sm text-[#8a7075]">{tier.desc}</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#3d2b2e]">{tier.price}</span>
                <span className="text-sm text-[#8a7075]">{tier.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#3d2b2e]">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => handleSubscribe(tier.tier)}
                className={`w-full rounded-xl ${tier.popular ? 'bg-[#e8729a] hover:bg-[#c4507a] text-white' : 'bg-[#fdf2f4] text-[#3d2b2e] hover:bg-[#f5a3c0]/20'}`}
                disabled={checkoutMutation.isPending}>
                {tier.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#3d2b2e] mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Can I change my plan anytime?", a: "Yes! Upgrade or downgrade at any time. Changes take effect at your next billing cycle." },
              { q: "What happens to my data if I cancel?", a: "Your data is always yours. Download habits, journal entries, and health data anytime." },
              { q: "Do you offer refunds?", a: "We offer a 30-day money-back guarantee. Contact support for a full refund." },
              { q: "Is there a free trial?", a: "Yes, Premium and Pro plans include a 7-day free trial. Test with card 4242 4242 4242 4242." },
            ].map((item, idx) => (
              <Card key={idx} className="bg-white border-[#f5a3c0]/20 p-5">
                <h3 className="font-bold text-[#3d2b2e] mb-1">{item.q}</h3>
                <p className="text-sm text-[#8a7075]">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
