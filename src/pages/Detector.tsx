import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { Search, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Detector() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ score: number, analysis: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || data.error || "Failed to analyze text");
      }
      setResult(data);
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

  const isAi = result && result.score > 70;
  const isMixed = result && result.score >= 40 && result.score <= 70;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Detector</h1>
        <p className="text-muted-foreground">Identify AI-generated content with high accuracy.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-white/5 order-2 md:order-1">
          <CardContent className="p-6 h-full flex flex-col">
            <h3 className="font-semibold mb-4">Input Text</h3>
            <Textarea 
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste text here to analyze..." 
              className="min-h-[300px] flex-1 resize-none bg-background/50 border-white/10 leading-relaxed"
            />
            <Button onClick={analyze} disabled={!text.trim() || loading} className="w-full mt-4">
              {loading ? "Analyzing..." : "Run Analysis"} <Search className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 order-1 md:order-2">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Results</h3>
            
            {error && !loading && (
              <div className="text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-xl text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <p className="font-medium text-sm">{error}</p>
              </div>
            )}

            {!result && !error && !loading && (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground opacity-50 text-center px-4">
                <ShieldCheck className="w-16 h-16 mb-4" />
                <p>Waiting for text input to analyze determining AI authorship probability.</p>
              </div>
            )}

            {loading && (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <Search className="w-10 h-10 text-primary mb-4" />
                  <p className="text-primary font-medium">Scanning text patterns...</p>
                </div>
              </div>
            )}

            {result && !loading && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="text-center p-6 bg-background rounded-xl border border-white/5">
                  <div className="text-6xl font-bold mb-2 tracking-tighter">
                    <span className={isAi ? "text-destructive" : isMixed ? "text-yellow-500" : "text-emerald-500"}>
                      {result.score}%
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">AI Probability Score</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Human</span>
                    <span>AI</span>
                  </div>
                  <Progress value={result.score} className="h-3" 
                    indicatorClassName={isAi ? "bg-destructive" : isMixed ? "bg-yellow-500" : "bg-emerald-500"} 
                  />
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                  <h4 className="flex items-center gap-2 font-semibold text-sm mb-2">
                    <AlertTriangle className="w-4 h-4 text-primary" />
                    Analysis Engine Verdict
                  </h4>
                  <p className="text-sm text-muted-foreground">{result.analysis}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
