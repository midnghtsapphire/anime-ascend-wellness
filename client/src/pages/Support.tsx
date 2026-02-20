import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Mail, HelpCircle, ArrowLeft, Send, Shield } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

const faqs = [
  { q: "How does heart rate monitoring work?", a: "Place your finger over your phone's camera with the flash on. The app uses photoplethysmography (PPG) to detect blood flow changes and calculate your heart rate and rhythm." },
  { q: "Is fall detection accurate?", a: "Fall detection uses your device's accelerometer and gyroscope. It works best when your phone is on your person. False positives are rare but possible during vigorous exercise." },
  { q: "How do I set up emergency contacts?", a: "Go to the Emergency page from your dashboard. Add contacts with their name, phone, and relationship. They'll be notified if a health emergency is detected." },
  { q: "Can I export my health data?", a: "Pro plan users can export all health data including heart rate logs, stress readings, and exercise history from Settings." },
  { q: "How do I cancel my subscription?", a: "Go to Settings > Billing and click 'Manage Subscription'. Cancel anytime and keep access until the end of your billing period." },
  { q: "Is my health data private?", a: "All health data is encrypted and stored securely. We never share data with third parties. Delete all data anytime from Settings." },
];

export default function Support() {
  const { isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({ subject: "", description: "", category: "general" });

  const createTicketMutation = trpc.support.createTicket.useMutation({
    onSuccess: () => {
      toast.success("Support ticket submitted! We'll respond within 24 hours. 🌸");
      setFormData({ subject: "", description: "", category: "general" });
    },
    onError: (error) => toast.error(error.message || "Failed to submit ticket"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error("Please sign in first"); return; }
    if (!formData.subject || !formData.description) { toast.error("Please fill in all fields"); return; }
    createTicketMutation.mutate(formData);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-[#f5a3c0] border-t-[#e8729a] animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f5a3c0]/20">
        <div className="container flex items-center h-14">
          <Link href="/"><Button variant="ghost" size="sm" className="text-[#8a7075]"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link>
          <span className="font-bold text-[#3d2b2e] ml-3">Support</span>
        </div>
      </header>

      <div className="container py-8 max-w-3xl mx-auto">
        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-white border-[#f5a3c0]/20 text-center">
            <MessageSquare className="w-8 h-8 text-[#e8729a] mx-auto mb-2" />
            <h4 className="font-bold text-[#3d2b2e] text-sm">Live Chat</h4>
            <p className="text-xs text-[#8a7075]">Available 9am-5pm EST</p>
          </Card>
          <Card className="p-4 bg-white border-[#f5a3c0]/20 text-center">
            <Mail className="w-8 h-8 text-[#7ab8c4] mx-auto mb-2" />
            <h4 className="font-bold text-[#3d2b2e] text-sm">Email</h4>
            <p className="text-xs text-[#8a7075]">support@animeascend.com</p>
          </Card>
          <Card className="p-4 bg-white border-[#f5a3c0]/20 text-center">
            <Shield className="w-8 h-8 text-[#7ab87a] mx-auto mb-2" />
            <h4 className="font-bold text-[#3d2b2e] text-sm">Emergency</h4>
            <p className="text-xs text-[#8a7075]">24/7 for health alerts</p>
          </Card>
        </div>

        {/* Submit Ticket */}
        {isAuthenticated ? (
          <Card className="p-6 bg-white border-[#f5a3c0]/20 mb-8">
            <h3 className="font-bold text-[#3d2b2e] mb-4">Submit a Support Ticket</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-[#f5a3c0]/30 rounded-xl text-sm bg-white text-[#3d2b2e] focus:outline-none focus:border-[#e8729a]">
                <option value="general">General Question</option>
                <option value="billing">Billing & Payments</option>
                <option value="bug">Bug Report</option>
                <option value="health">Health Feature</option>
                <option value="account">Account & Privacy</option>
              </select>
              <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="Subject"
                className="w-full px-3 py-2 border border-[#f5a3c0]/30 rounded-xl text-sm bg-white text-[#3d2b2e] focus:outline-none focus:border-[#e8729a]" />
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe your issue..." rows={5}
                className="w-full px-3 py-2 border border-[#f5a3c0]/30 rounded-xl text-sm bg-white text-[#3d2b2e] focus:outline-none focus:border-[#e8729a] resize-none" />
              <Button type="submit" className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-xl" disabled={createTicketMutation.isPending}>
                <Send className="w-4 h-4 mr-2" /> Submit Ticket
              </Button>
            </form>
          </Card>
        ) : (
          <Card className="p-6 bg-white border-[#f5a3c0]/20 mb-8 text-center">
            <HelpCircle className="w-12 h-12 text-[#f5a3c0] mx-auto mb-3" />
            <p className="text-[#8a7075] mb-4">Sign in to submit a support ticket</p>
            <a href={getLoginUrl()}><Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-8">Sign In</Button></a>
          </Card>
        )}

        {/* FAQ */}
        <h3 className="font-bold text-[#3d2b2e] mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Card key={i} className="p-4 bg-white border-[#f5a3c0]/20">
              <h4 className="font-bold text-[#3d2b2e] mb-1 text-sm">{faq.q}</h4>
              <p className="text-sm text-[#8a7075]">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
