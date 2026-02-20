import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  ShieldAlert, Phone, Plus, Trash2, ArrowLeft, AlertTriangle,
  HeartPulse, Brain, User, Mail, Edit2, Check, X
} from "lucide-react";
import { toast } from "sonner";

export default function Emergency() {
  const { isAuthenticated, loading } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [notifyOnFall, setNotifyOnFall] = useState(true);
  const [notifyOnArrhythmia, setNotifyOnArrhythmia] = useState(true);
  const [notifyOnStress, setNotifyOnStress] = useState(false);

  const contacts = trpc.emergency.listContacts.useQuery(undefined, { enabled: isAuthenticated });
  const addContact = trpc.emergency.addContact.useMutation({
    onSuccess: () => {
      contacts.refetch();
      resetForm();
      toast.success("Emergency contact added");
    },
    onError: (err) => toast.error(err.message),
  });
  const removeContact = trpc.emergency.removeContact.useMutation({
    onSuccess: () => {
      contacts.refetch();
      toast.success("Contact removed");
    },
  });

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setRelationship("");
    setIsPrimary(false);
    setNotifyOnFall(true);
    setNotifyOnArrhythmia(true);
    setNotifyOnStress(false);
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    addContact.mutate({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      relationship: relationship.trim() || undefined,
      isPrimary,
      notifyOnFall,
      notifyOnArrhythmia,
      notifyOnStress,
    });
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
          <ShieldAlert className="w-16 h-16 text-[#d4556b] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#3d2b2e] mb-2">Emergency Contacts</h2>
          <p className="text-[#8a7075] mb-6">Sign in to manage your emergency contacts.</p>
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
            <Link href="/health">
              <Button variant="ghost" size="sm" className="text-[#8a7075]">
                <ArrowLeft className="w-4 h-4 mr-1" /> Health
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#d4556b]" />
              <span className="font-bold text-[#3d2b2e]">Emergency</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6 max-w-2xl mx-auto">
        {/* Alert Info */}
        <Card className="p-5 bg-[#d4556b]/5 border-[#d4556b]/20 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#d4556b] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-[#3d2b2e] mb-1">How Emergency Alerts Work</h3>
              <p className="text-sm text-[#8a7075] leading-relaxed">
                When a fall is detected or your vitals show concerning patterns, Anime Ascend will automatically
                notify your emergency contacts with your status. You can customize which events trigger alerts for each contact.
              </p>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-5 bg-white border-[#f5a3c0]/20 mb-6">
          <h3 className="font-bold text-[#3d2b2e] mb-4">Alert Triggers</h3>
          <div className="space-y-3">
            {[
              { icon: ShieldAlert, label: 'Fall Detection', desc: 'Alert contacts when a fall is detected', color: '#7ab8c4' },
              { icon: HeartPulse, label: 'Heart Arrhythmia', desc: 'Alert contacts when irregular heart rhythm is detected', color: '#d4556b' },
              { icon: Brain, label: 'Severe Stress', desc: 'Alert contacts during critical stress episodes', color: '#e8a849' },
            ].map(trigger => (
              <div key={trigger.label} className="flex items-center justify-between p-3 bg-[#fdf2f4] rounded-xl">
                <div className="flex items-center gap-3">
                  <trigger.icon className="w-5 h-5" style={{ color: trigger.color }} />
                  <div>
                    <p className="text-sm font-semibold text-[#3d2b2e]">{trigger.label}</p>
                    <p className="text-xs text-[#8a7075]">{trigger.desc}</p>
                  </div>
                </div>
                <div className="w-10 h-6 bg-[#7ab87a] rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Contacts List */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#3d2b2e]">Emergency Contacts</h3>
          <Button onClick={() => setShowAddForm(true)} size="sm" className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full">
            <Plus className="w-4 h-4 mr-1" /> Add Contact
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="p-5 bg-white border-[#e8729a]/30 mb-4">
            <h4 className="font-bold text-[#3d2b2e] mb-4">New Emergency Contact</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-[#3d2b2e] block mb-1">Name *</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#f5a3c0]/30 rounded-xl text-sm bg-white text-[#3d2b2e] focus:outline-none focus:border-[#e8729a]"
                  placeholder="Contact name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#3d2b2e] block mb-1">Phone *</label>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-[#f5a3c0]/30 rounded-xl text-sm bg-white text-[#3d2b2e] focus:outline-none focus:border-[#e8729a]"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#3d2b2e] block mb-1">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#f5a3c0]/30 rounded-xl text-sm bg-white text-[#3d2b2e] focus:outline-none focus:border-[#e8729a]"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#3d2b2e] block mb-1">Relationship</label>
                <input
                  type="text" value={relationship} onChange={e => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 border border-[#f5a3c0]/30 rounded-xl text-sm bg-white text-[#3d2b2e] focus:outline-none focus:border-[#e8729a]"
                  placeholder="e.g., Parent, Spouse, Doctor"
                />
              </div>

              {/* Notification preferences */}
              <div className="pt-2">
                <p className="text-sm font-medium text-[#3d2b2e] mb-2">Notify this contact for:</p>
                <div className="space-y-2">
                  {[
                    { label: 'Fall detection', checked: notifyOnFall, onChange: setNotifyOnFall },
                    { label: 'Heart arrhythmia', checked: notifyOnArrhythmia, onChange: setNotifyOnArrhythmia },
                    { label: 'Stress episodes', checked: notifyOnStress, onChange: setNotifyOnStress },
                  ].map(opt => (
                    <label key={opt.label} className="flex items-center gap-2 text-sm text-[#3d2b2e] cursor-pointer">
                      <input type="checkbox" checked={opt.checked} onChange={e => opt.onChange(e.target.checked)}
                        className="rounded border-[#f5a3c0] text-[#e8729a] focus:ring-[#e8729a]" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-[#3d2b2e] cursor-pointer pt-1">
                <input type="checkbox" checked={isPrimary} onChange={e => setIsPrimary(e.target.checked)}
                  className="rounded border-[#f5a3c0] text-[#e8729a] focus:ring-[#e8729a]" />
                Set as primary contact
              </label>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSubmit} className="flex-1 bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-xl"
                  disabled={addContact.isPending}>
                  <Check className="w-4 h-4 mr-1" /> Save Contact
                </Button>
                <Button onClick={resetForm} variant="outline" className="border-[#f5a3c0] text-[#c4507a] rounded-xl">
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Contacts */}
        {contacts.isLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-[#fdf2f4] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : contacts.data && contacts.data.length > 0 ? (
          <div className="space-y-3">
            {contacts.data.map((contact: any) => (
              <Card key={contact.id} className="p-4 bg-white border-[#f5a3c0]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e8729a]/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#e8729a]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#3d2b2e]">{contact.name}</p>
                        {contact.isPrimary && (
                          <span className="text-xs bg-[#e8729a]/10 text-[#c4507a] px-2 py-0.5 rounded-full">Primary</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#8a7075]">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {contact.phone}</span>
                        {contact.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</span>}
                      </div>
                      {contact.relationship && (
                        <p className="text-xs text-[#8a7075] mt-0.5">{contact.relationship}</p>
                      )}
                      <div className="flex gap-2 mt-1">
                        {contact.notifyOnFall && <span className="text-xs bg-[#7ab8c4]/10 text-[#5a98a4] px-1.5 py-0.5 rounded">Falls</span>}
                        {contact.notifyOnArrhythmia && <span className="text-xs bg-[#d4556b]/10 text-[#d4556b] px-1.5 py-0.5 rounded">Heart</span>}
                        {contact.notifyOnStress && <span className="text-xs bg-[#e8a849]/10 text-[#c48a30] px-1.5 py-0.5 rounded">Stress</span>}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost" size="sm" className="text-[#8a7075] hover:text-[#d4556b]"
                    onClick={() => {
                      if (confirm("Remove this emergency contact?")) {
                        removeContact.mutate({ id: contact.id });
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 bg-white border-[#f5a3c0]/20 text-center">
            <Phone className="w-12 h-12 text-[#f5a3c0] mx-auto mb-3" />
            <h4 className="font-bold text-[#3d2b2e] mb-1">No Emergency Contacts</h4>
            <p className="text-sm text-[#8a7075] mb-4">Add contacts who should be notified during health emergencies.</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full">
              <Plus className="w-4 h-4 mr-1" /> Add Your First Contact
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
