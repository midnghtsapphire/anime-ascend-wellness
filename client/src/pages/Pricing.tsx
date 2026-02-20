import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
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

  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      tokens: "5",
      description: "Perfect for getting started",
      features: [
        "Basic habit tracking",
        "Mood logging",
        "Community access",
        "5 AI messages/month",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "/month",
      tokens: "50",
      description: "For serious growth",
      features: [
        "Everything in Free",
        "Advanced analytics",
        "Guided meditations",
        "50 AI messages/month",
        "Priority support",
      ],
      cta: "Upgrade to Premium",
      highlighted: true,
    },
    {
      name: "Pro",
      price: "$19.99",
      period: "/month",
      tokens: "200",
      description: "For maximum growth",
      features: [
        "Everything in Premium",
        "Personalized recommendations",
        "Early access to features",
        "200 AI messages/month",
        "1-on-1 coaching",
      ],
      cta: "Upgrade to Pro",
      highlighted: false,
    },
  ];

  const handleUpgrade = (tier: "premium" | "pro") => {
    if (!isAuthenticated) {
      toast.error("Please sign in to upgrade");
      return;
    }
    checkoutMutation.mutate({ tier });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Simple, Transparent Pricing</h1>
          <p className="text-slate-400">Choose the plan that fits your wellness journey</p>
        </div>
      </div>

      <div className="container py-16">
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative overflow-hidden transition-all ${
                tier.highlighted
                  ? "md:scale-105 bg-gradient-to-br from-teal-500/20 to-pink-500/20 border-teal-500/50 shadow-2xl"
                  : "bg-slate-800/50 border-slate-700"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-pink-500 text-white text-sm font-bold py-1 text-center">
                  Most Popular
                </div>
              )}

              <div className="p-8 pt-12">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{tier.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-slate-400">{tier.period}</span>
                  </div>
                  <div className="mt-3 text-teal-400 font-semibold">
                    {tier.tokens} AI messages/month
                  </div>
                </div>

                <Button
                  className={`w-full mb-8 ${
                    tier.name === "Free"
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-teal-500 hover:bg-teal-600 text-white"
                  }`}
                  onClick={() => {
                    if (tier.name === "Free") {
                      // Free tier doesn't need checkout
                      toast.success("You're on the Free plan!");
                    } else {
                      handleUpgrade(tier.name.toLowerCase() as "premium" | "pro");
                    }
                  }}
                  disabled={
                    checkoutMutation.isPending ||
                    (isAuthenticated && user?.subscriptionTier === tier.name.toLowerCase())
                  }
                >
                  {isAuthenticated && user?.subscriptionTier === tier.name.toLowerCase()
                    ? "Current Plan"
                    : tier.cta}
                </Button>

                <div className="space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.",
              },
              {
                q: "What happens to my data if I cancel?",
                a: "Your data is always yours. You can download your habits, journal entries, and goals anytime, even after canceling.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee. If you're not satisfied, contact support for a full refund.",
              },
              {
                q: "Is there a free trial for Premium?",
                a: "Start with our Free plan to explore all features. Upgrade anytime to unlock advanced tools.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-slate-400">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
