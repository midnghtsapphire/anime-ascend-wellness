import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Mail, HelpCircle } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Support() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "general",
  });

  const createTicketMutation = trpc.support.createTicket.useMutation({
    onSuccess: () => {
      toast.success("Support ticket created! We'll get back to you soon.");
      setFormData({ subject: "", description: "", category: "general" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create support ticket");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to submit a support ticket");
      return;
    }
    if (!formData.subject || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }
    createTicketMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Support & Help</h1>
          <p className="text-slate-400">We're here to help you succeed on your wellness journey</p>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
            <Card className="bg-slate-800/50 border-slate-700 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="billing">Billing Issue</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="How can we help?"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Tell us more about your issue..."
                    rows={5}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-600"
                  disabled={createTicketMutation.isPending}
                >
                  {createTicketMutation.isPending ? "Submitting..." : "Submit Ticket"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Quick Help</h2>
            <div className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700 p-6 hover:border-teal-500/50 transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <MessageSquare className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Live Chat</h3>
                    <p className="text-sm text-slate-400">
                      Chat with our support team during business hours
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6 hover:border-teal-500/50 transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Email Support</h3>
                    <p className="text-sm text-slate-400">
                      support@anime-ascend.com
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6 hover:border-teal-500/50 transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Knowledge Base</h3>
                    <p className="text-sm text-slate-400">
                      Browse our FAQ and documentation
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How do I reset my password?",
                a: "Go to the login page and click 'Forgot Password'. Follow the email instructions to reset your password.",
              },
              {
                q: "How do I delete my account?",
                a: "Go to Settings > Account > Danger Zone and click 'Delete Account'. Your data will be permanently removed.",
              },
              {
                q: "Can I export my data?",
                a: "Yes! Go to Settings > Account and click 'Download My Data'. You'll receive a ZIP file with all your information.",
              },
              {
                q: "How do I cancel my subscription?",
                a: "Go to Settings > Billing and click 'Cancel Subscription'. You'll have access until the end of your billing cycle.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express) through Stripe.",
              },
              {
                q: "Is my data secure?",
                a: "Yes! We use industry-standard encryption (HTTPS/TLS) and never store sensitive payment information.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-slate-400 text-sm">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
