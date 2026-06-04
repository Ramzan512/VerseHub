import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Bot, Search, ExternalLink, Globe, Layout, Code2, Rocket, CloudUpload, Github, Server } from 'lucide-react';
import { Input } from '../components/ui/input';
import { motion } from 'motion/react';

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    {
      name: 'Google AI Studio',
      url: 'https://aistudio.google.com',
      description: 'Build production-ready AI applications quickly with Google Gemini models.',
      icon: Code2,
      category: 'AI Builder',
      color: 'text-blue-400',
      bg: 'bg-blue-500/20'
    },
    {
      name: 'Replit',
      url: 'https://replit.com',
      description: 'Collaborative browser-based IDE with built-in AI coding assistance.',
      icon: Layout,
      category: 'AI Builder',
      color: 'text-orange-400',
      bg: 'bg-orange-500/20'
    },
    {
      name: 'Bolt.new',
      url: 'https://bolt.new',
      description: 'Create and deploy full-stack Next.js applications directly in the browser.',
      icon: Rocket,
      category: 'AI Builder',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20'
    },
    {
      name: 'Lovable',
      url: 'https://lovable.dev',
      description: 'AI-powered website builder turning ideas into functional React applications.',
      icon: Bot,
      category: 'AI Builder',
      color: 'text-pink-400',
      bg: 'bg-pink-500/20'
    },
    {
      name: 'V0',
      url: 'https://v0.dev',
      description: 'Generative UI system by Vercel for generating React components from text.',
      icon: Layout,
      category: 'AI Builder',
      color: 'text-zinc-400',
      bg: 'bg-zinc-500/20'
    },
    {
      name: 'Base44',
      url: 'https://base44.app',
      description: 'Modern, AI-assisted development tools for rapid prototyping and deployment.',
      icon: Code2,
      category: 'AI Builder',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20'
    },
    {
      name: 'Vercel',
      url: 'https://vercel.com',
      description: 'Frontend cloud platform for developing, previewing, and shipping web apps.',
      icon: Server,
      category: 'Publishing',
      color: 'text-zinc-400',
      bg: 'bg-zinc-500/20'
    },
    {
      name: 'Netlify',
      url: 'https://netlify.com',
      description: 'Platform for modern web development, CI/CD, and edge deployment.',
      icon: CloudUpload,
      category: 'Publishing',
      color: 'text-teal-400',
      bg: 'bg-teal-500/20'
    },
    {
      name: 'Cloudflare Pages',
      url: 'https://pages.cloudflare.com',
      description: 'Fast, secure platform for frontend developers to build and deploy fast.',
      icon: Globe,
      category: 'Publishing',
      color: 'text-orange-400',
      bg: 'bg-orange-500/20'
    },
    {
      name: 'GitHub Pages',
      url: 'https://pages.github.com',
      description: 'Websites for you and your projects, hosted directly from your GitHub repository.',
      icon: Github,
      category: 'Publishing',
      color: 'text-zinc-400',
      bg: 'bg-zinc-500/20'
    }
  ];

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const builders = filteredTools.filter(t => t.category === 'AI Builder');
  const publishers = filteredTools.filter(t => t.category === 'Publishing');

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Layout className="w-8 h-8 text-primary" /> Web Development Tools
          </h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
            A curated collection of the best AI website builders and publishing platforms for rapid application development.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..." 
            className="pl-9 bg-card/50 border-white/10 focus-visible:ring-primary h-12"
          />
        </div>
      </div>

      {builders.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-white/5 pb-4">AI Website Builders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builders.map((tool, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={tool.name}
              >
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
                  <Card className="h-full bg-card/40 border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm cursor-pointer relative overflow-hidden flex flex-col group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group-hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-6 relative z-10 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tool.bg} ${tool.color} shadow-lg shadow-black/20 text-xl font-bold`}>
                          <tool.icon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                             {tool.category}
                           </span>
                           <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                        {tool.description}
                      </p>
                      <div className="text-xs text-muted-foreground font-mono truncate border-t border-white/5 pt-4 mt-auto">
                        {tool.url.replace('https://', '')}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {publishers.length > 0 && (
        <section className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold border-b border-white/5 pb-4">Publishing Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publishers.map((tool, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={tool.name}
              >
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
                  <Card className="h-full bg-card/40 border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden p-6 relative group-hover:shadow-[0_0_30px_rgba(56,189,248,0.1)] group-hover:-translate-y-1">
                     <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="relative z-10 flex flex-col h-full">
                       <div className="flex items-center justify-between mb-4">
                          <tool.icon className={`w-8 h-8 ${tool.color}`} />
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                       </div>
                       <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                       <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                         {tool.description}
                       </p>
                       <div className="text-xs text-muted-foreground/80 font-mono truncate mt-auto">
                         {tool.url.replace('https://', '')}
                       </div>
                     </div>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {filteredTools.length === 0 && (
        <div className="text-center py-20 bg-card/20 rounded-xl border border-white/5">
           <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
           <p className="text-lg text-muted-foreground">No tools found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
