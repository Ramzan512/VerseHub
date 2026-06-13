import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { RefreshCw, CheckCircle2, UserCheck, Copy, Type } from 'lucide-react';
import { motion } from 'motion/react';

export default function Humanizer() {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('Conversational & Professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = ['Conversational & Professional', 'Casual & Friendly', 'Academic', 'Creative Storytelling'];

  const humanize = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResult('');
    setError(null);
    try {
      const res = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, style })
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || data.error || "Failed to humanize text");
      }
      setResult(data.result);
    } catch(e: any) {
      // console.warn(e);
      let errorMsg = e.message;
      if (errorMsg.includes("OPENROUTER_API_KEY") || errorMsg.includes("GEMINI_API_KEY")) {
        errorMsg = "It looks like your OpenRouter API key is missing. Please add your OPENROUTER_API_KEY in the environment settings.";
      }
      setError(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 flex flex-col h-full pb-4">
      <div>
        <h1 className="text-3xl font-bold">AI Humanizer</h1>
        <p className="text-muted-foreground">Transform robotic AI text into natural human writing.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {styles.map(s => (
          <Button 
            key={s} 
            variant={style === s ? 'default' : 'secondary'} 
            onClick={() => setStyle(s)}
            className="rounded-full text-xs"
          >
            {s} {style === s && <CheckCircle2 className="w-3 h-3 ml-2" />}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-[500px]">
        {/* Input */}
        <Card className="bg-card/50 border-border flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col group relative">
            <Textarea 
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste the AI-generated text you want to humanize here..." 
              className="flex-1 w-full p-6 border-0 focus-visible:ring-0 resize-none bg-transparent h-full min-h-[300px] text-base leading-relaxed"
            />
            <div className="p-4 border-t border-border bg-background/30 flex justify-between items-center rounded-b-xl">
              <span className="text-xs text-muted-foreground">{text.length} characters</span>
              <Button onClick={humanize} disabled={!text.trim() || loading} className="shadow-lg shadow-primary/20">
                {loading ? <RefreshCw className="mr-2 w-4 h-4 animate-spin" /> : <UserCheck className="mr-2 w-4 h-4" />}
                Humanize Text
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="bg-card/50 border-border flex flex-col relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="font-medium animate-pulse">Rewriting for a human touch...</p>
            </div>
          )}
          <CardContent className="p-6 flex-1 flex flex-col min-h-[300px]">
            {error && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-xl text-center w-full">
                  <p className="font-medium text-sm">{error}</p>
                </div>
              </div>
            )}
            
            {!result && !error && !loading ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground opacity-50 text-center flex-col">
                <Type className="w-12 h-12 mb-4" />
                <p>The humanized output will appear here.</p>
              </div>
            ) : (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto pr-2 text-base leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
                <div className="pt-4 border-t border-border mt-4 flex justify-end">
                  <Button variant="secondary" onClick={() => navigator.clipboard.writeText(result)}>
                    <Copy className="w-4 h-4 mr-2"/> Copy Output
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
