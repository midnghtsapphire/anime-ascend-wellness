import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { BookOpen, Plus, ArrowLeft, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const prompts = [
  "What made you smile today? 🌸",
  "What are you grateful for right now?",
  "How did you take care of yourself today?",
  "What challenge did you overcome recently?",
  "What's one thing you'd like to improve?",
  "Describe a moment of peace you experienced.",
];

export default function Journal() {
  const { isAuthenticated, loading } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [currentPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);

  const entries = trpc.journal.list.useQuery(undefined, { enabled: isAuthenticated });
  const createEntry = trpc.journal.create.useMutation({
    onSuccess: () => {
      entries.refetch();
      setShowEditor(false);
      setTitle("");
      setContent("");
      setMood("");
      toast.success("Journal entry saved! 🌸");
    },
  });
  const deleteEntry = trpc.journal.delete.useMutation({
    onSuccess: () => { entries.refetch(); toast.success("Entry deleted"); },
  });

  const handleSubmit = () => {
    if (!content.trim()) { toast.error("Write something first"); return; }
    createEntry.mutate({ title: title.trim() || undefined, content: content.trim(), mood: mood || undefined });
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-[#f5a3c0] border-t-[#e8729a] animate-spin" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white border-[#f5a3c0]/20">
          <BookOpen className="w-16 h-16 text-[#7ab87a] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#3d2b2e] mb-2">Journal</h2>
          <p className="text-[#8a7075] mb-6">Sign in to start journaling.</p>
          <a href={getLoginUrl()}><Button className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full px-8">Sign In</Button></a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f5a3c0]/20">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/dashboard"><Button variant="ghost" size="sm" className="text-[#8a7075]"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link>
            <span className="font-bold text-[#3d2b2e]">Journal</span>
          </div>
          <Button onClick={() => setShowEditor(!showEditor)} size="sm" className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full">
            <Plus className="w-4 h-4 mr-1" /> New Entry
          </Button>
        </div>
      </header>

      <div className="container py-6 max-w-2xl mx-auto">
        {/* Prompt */}
        {!showEditor && (
          <Card className="p-5 bg-gradient-to-r from-[#fdf2f4] to-white border-[#f5a3c0]/20 mb-6 cursor-pointer hover:shadow-md transition-all" onClick={() => setShowEditor(true)}>
            <p className="text-sm text-[#8a7075] mb-1">Today's prompt</p>
            <p className="text-[#3d2b2e] font-medium">{currentPrompt}</p>
          </Card>
        )}

        {/* Editor */}
        {showEditor && (
          <Card className="p-5 bg-white border-[#e8729a]/30 mb-6">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (optional)"
              className="w-full px-3 py-2 border border-[#f5a3c0]/30 rounded-xl text-sm bg-white text-[#3d2b2e] focus:outline-none focus:border-[#e8729a] mb-3" />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={currentPrompt} rows={6}
              className="w-full px-3 py-2 border border-[#f5a3c0]/30 rounded-xl text-sm bg-white text-[#3d2b2e] focus:outline-none focus:border-[#e8729a] mb-3 resize-none" />
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-[#8a7075]">Mood:</span>
              {['😊', '😌', '😔', '😤', '🥰', '😴'].map(m => (
                <button key={m} onClick={() => setMood(m)} className={`text-xl p-1 rounded-lg transition-all ${mood === m ? 'bg-[#e8729a]/10 scale-125' : 'hover:bg-[#fdf2f4]'}`}>{m}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1 bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-xl" disabled={createEntry.isPending}>
                <Send className="w-4 h-4 mr-1" /> Save Entry
              </Button>
              <Button onClick={() => setShowEditor(false)} variant="outline" className="border-[#f5a3c0] text-[#c4507a] rounded-xl">Cancel</Button>
            </div>
          </Card>
        )}

        {/* Entries */}
        {entries.isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-[#fdf2f4] rounded-xl animate-pulse" />)}</div>
        ) : entries.data && entries.data.length > 0 ? (
          <div className="space-y-3">
            {entries.data.map((entry: any) => (
              <Card key={entry.id} className="p-4 bg-white border-[#f5a3c0]/20 hover:border-[#f5a3c0]/40 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.mood && <span className="text-lg">{entry.mood}</span>}
                      <h4 className="font-bold text-[#3d2b2e]">{entry.title || 'Untitled'}</h4>
                    </div>
                    <p className="text-sm text-[#8a7075] line-clamp-2">{entry.content}</p>
                    <p className="text-xs text-[#8a7075] mt-2">{new Date(entry.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#8a7075] hover:text-[#d4556b]"
                    onClick={() => { if (confirm("Delete this entry?")) deleteEntry.mutate({ id: entry.id }); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 bg-white border-[#f5a3c0]/20 text-center">
            <BookOpen className="w-12 h-12 text-[#f5a3c0] mx-auto mb-3" />
            <h4 className="font-bold text-[#3d2b2e] mb-1">No journal entries yet</h4>
            <p className="text-sm text-[#8a7075] mb-4">Start writing to capture your thoughts and feelings.</p>
            <Button onClick={() => setShowEditor(true)} className="bg-[#e8729a] hover:bg-[#c4507a] text-white rounded-full">
              <Plus className="w-4 h-4 mr-1" /> Write First Entry
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
