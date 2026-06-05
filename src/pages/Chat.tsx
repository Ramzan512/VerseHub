import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User, Send } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Hi! I'm VerseHub AI.\nHow can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      
      const responseText = await res.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch(e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col p-4 max-w-3xl mx-auto space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">AI Chat (Plain Text)</h1>
        <p className="text-sm text-muted-foreground mt-1">Model: gpt-4o-mini | Provider: OpenRouter</p>
      </div>
      
      <Card className="flex-1 flex flex-col overflow-hidden border-white/10 p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground my-10">
              Start a conversation...
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <img 
                  src="https://i.postimg.cc/mg6FZkJH/IMG-20260531-120027.png" 
                  alt="Verse AI" 
                  className="w-8 h-8 rounded-full object-contain shrink-0 shadow-[0_0_10px_rgba(0,191,255,0.4)] bg-black/50 border border-[#00BFFF]/30 p-1" 
                />
              )}
              <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <img 
                src="https://i.postimg.cc/mg6FZkJH/IMG-20260531-120027.png" 
                alt="Verse AI" 
                className="w-8 h-8 rounded-full object-contain shrink-0 shadow-[0_0_10px_rgba(0,191,255,0.4)] bg-black/50 border border-[#00BFFF]/30 p-1 animate-pulse" 
              />
              <div className="p-3 rounded-lg bg-muted flex items-center">
                <div className="animate-pulse text-sm text-muted-foreground">Thinking...</div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..." 
            disabled={loading}
            className="flex-1 border-white/20"
          />
          <Button type="submit" disabled={!input.trim() || loading}>
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
