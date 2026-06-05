import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Bot, User, Send, Copy, AlertCircle, Key, Activity, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Verse Hub assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setNeedsSetup(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        // If the server returns HTML or plain text (e.g., Vercel 500 error page)
        throw new Error('AI service temporarily unavailable (Invalid server response)');
      }
      
      if (res.ok && data.success !== false) {
        // Use data.response if available, otherwise check data.message
        setMessages(prev => [...prev, { role: 'assistant', content: data.response || "No response received." }]);
      } else {
        if (data.error === "GEMINI_API_KEY_MISSING") {
          setNeedsSetup(true);
        } else if (data.error === "QUOTA_EXHAUSTED") {
          setMessages(prev => [...prev, { role: 'assistant', content: "It looks like we've hit our usage limits for now. Please try again a bit later when the quota resets!" }]);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: data.message || `Error: ${data.error || 'AI service temporarily unavailable'}` }]);
        }
      }
    } catch(e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `An error occurred: ${e.message}` }]);
    }
    setLoading(false);
  };

  if (needsSetup) {
    return (
      <div className="h-full flex flex-col pt-10 pb-6 max-w-2xl mx-auto px-4">
        <Card className="p-8 border-amber-500/30 bg-amber-500/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Key className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">API Key Required</h2>
              <p className="text-muted-foreground text-lg">
                To use the AI Chat, you need to configure your Gemini API Key.
              </p>
            </div>
            
            <div className="bg-background/80 p-6 rounded-xl border border-white/10 w-full text-left space-y-4">
              <p className="font-medium text-sm text-muted-foreground uppercase tracking-widest">Setup Instructions</p>
              <ol className="list-decimal list-inside space-y-3 text-sm">
                <li>Go to Google AI Studio to get your API key.</li>
                <li>Open your AI agent settings or environment variables panel.</li>
                <li>Add a new variable named <code className="bg-muted px-1.5 py-0.5 rounded text-amber-400">GEMINI_API_KEY</code></li>
                <li>Paste your API key as the value.</li>
                <li>Restart the server.</li>
              </ol>
            </div>
            
            <Button onClick={() => setNeedsSetup(false)} variant="outline" className="w-full">
              I've added the key, take me back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-2 pb-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Chat</h1>
          <p className="text-muted-foreground">Powered by Gemini for advanced reasoning.</p>
        </div>
        
        {/* Debug Panel */}
        <div className="flex items-center gap-3 bg-card border border-white/10 rounded-full px-4 py-1.5 text-xs text-muted-foreground shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
             <Activity className="w-3.5 h-3.5" /> Provider: Gemini
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
             <Zap className="w-3.5 h-3.5" /> Model: gemini-2.5-flash
          </div>
        </div>
      </div>
      
      <Card className="flex-1 flex flex-col bg-card/50 overflow-hidden border-white/10">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                {msg.role === 'assistant' && (
                  <button 
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                    className="mt-2 text-xs opacity-50 hover:opacity-100 flex items-center gap-1 transition-opacity"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-4 text-muted-foreground">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center"><Bot className="w-5 h-5 animate-pulse" /></div>
              <div className="bg-muted p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/5 bg-background/50">
          <form onSubmit={sendMessage} className="flex gap-2 relative">
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything..." 
              className="bg-muted/50 border-white/10 h-12 pr-12 focus-visible:ring-primary"
              disabled={loading}
            />
            <Button size="icon" type="submit" disabled={!input.trim() || loading} className="absolute right-2 top-2 h-8 w-8">
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-2 justify-center">
            <AlertCircle className="w-3 h-3" /> AI can make mistakes. Verify important information.
          </div>
        </div>
      </Card>
    </div>
  );
}
