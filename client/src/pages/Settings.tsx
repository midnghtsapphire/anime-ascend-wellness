import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Lock, Bell, Palette, CreditCard, LogOut, ChevronRight } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Settings() {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"account" | "accessibility" | "billing" | "notifications">("account");

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in</h2>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: "account" as const, label: "Account", icon: User },
    { id: "accessibility" as const, label: "Accessibility", icon: Palette },
    { id: "billing" as const, label: "Billing", icon: CreditCard },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-teal-500/20 border border-teal-500 text-teal-400"
                      : "hover:bg-slate-800/50 text-slate-400 hover:text-white"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Account Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Name</label>
                      <input
                        type="text"
                        value={user?.name || ""}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Subscription</label>
                      <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-4 py-2">
                        <span className="text-white capitalize font-medium">{user?.subscriptionTier || "free"}</span>
                        <span className="text-teal-400 text-sm">Active</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Danger Zone</h2>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10 w-full"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </Card>
              </div>
            )}

            {/* Accessibility Tab */}
            {activeTab === "accessibility" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Accessibility Modes</h2>
                  <div className="space-y-4">
                    {[
                      {
                        id: "default",
                        name: "Default Mode",
                        description: "Standard interface with full animations",
                      },
                      {
                        id: "wcag-aaa",
                        name: "WCAG AAA Compliance",
                        description: "Enhanced contrast and focus indicators",
                      },
                      {
                        id: "eco-code",
                        name: "ECO CODE",
                        description: "Low energy mode - reduced animations, dark backgrounds",
                      },
                      {
                        id: "neuro-code",
                        name: "NEURO CODE",
                        description: "ADHD-friendly - reduced clutter, focus mode",
                      },
                      {
                        id: "dyslexic",
                        name: "Dyslexic Mode",
                        description: "OpenDyslexic font, increased spacing",
                      },
                      {
                        id: "no-blue-light",
                        name: "No Blue Light",
                        description: "Warm color filter - night safe mode",
                      },
                    ].map((mode) => (
                      <label key={mode.id} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg cursor-pointer hover:bg-slate-900 transition-all">
                        <input
                          type="radio"
                          name="accessibility"
                          value={mode.id}
                          defaultChecked={mode.id === "default"}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-semibold text-white">{mode.name}</p>
                          <p className="text-sm text-slate-400">{mode.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Current Plan</h2>
                  <div className="bg-gradient-to-br from-teal-500/20 to-pink-500/20 border border-teal-500/30 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-slate-400 text-sm">Current Plan</p>
                        <p className="text-2xl font-bold text-white capitalize">{user?.subscriptionTier || "free"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-sm">Tokens Available</p>
                        <p className="text-2xl font-bold text-teal-400">{user?.tokenBalance || 0}</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-4">Upgrade Options</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: "Premium", price: "$9.99", tokens: "50/month" },
                      { name: "Pro", price: "$19.99", tokens: "200/month" },
                    ].map((tier) => (
                      <Card key={tier.name} className="bg-slate-900/50 border-slate-700 p-4">
                        <p className="font-bold text-white mb-1">{tier.name}</p>
                        <p className="text-teal-400 text-lg font-bold mb-2">{tier.price}</p>
                        <p className="text-sm text-slate-400 mb-4">{tier.tokens}</p>
                        <Button className="w-full bg-teal-500 hover:bg-teal-600">Upgrade</Button>
                      </Card>
                    ))}
                  </div>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Billing History</h2>
                  <p className="text-slate-400">No billing history yet</p>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { name: "Daily Reminders", description: "Get reminders to log your habits" },
                      { name: "Milestone Alerts", description: "Celebrate when you reach milestones" },
                      { name: "Community Updates", description: "Updates from the Anime Ascend community" },
                      { name: "Email Digests", description: "Weekly summary of your progress" },
                    ].map((notif) => (
                      <label key={notif.name} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg cursor-pointer hover:bg-slate-900 transition-all">
                        <div>
                          <p className="font-semibold text-white">{notif.name}</p>
                          <p className="text-sm text-slate-400">{notif.description}</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                      </label>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
