import { useState } from 'react';
import { Calculator } from './components/Calculator';
import { AIAssistant } from './components/AIAssistant';
import { Sparkles, BrainCircuit, Calculator as CalcIcon, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);
  const [showAI, setShowAI] = useState(false);

  const handleAIRequest = (expr: string, res: string) => {
    setAiPrompt(`Explain this calculation: ${expr} = ${res}`);
    setShowAI(true);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-orange-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
          <header className="mb-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-2"
            >
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <BrainCircuit className="text-orange-500" size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                AI <span className="text-orange-500">Scientific</span>
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 text-sm max-w-xs mx-auto"
            >
              Precision engineering meets artificial intelligence.
            </motion.p>
          </header>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Calculator onAIRequest={handleAIRequest} />
          </motion.div>

          {/* Mobile Toggle for AI */}
          <button 
            onClick={() => setShowAI(!showAI)}
            className="md:hidden mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800 border border-zinc-700 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            {showAI ? <CalcIcon size={18} /> : <MessageSquare size={18} />}
            {showAI ? "Show Calculator" : "Ask AI Assistant"}
          </button>
        </main>

        {/* AI Sidebar */}
        <AnimatePresence>
          {(showAI || window.innerWidth >= 768) && (
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "fixed inset-y-0 right-0 z-50 md:relative md:z-0 w-full md:w-[400px] lg:w-[450px] shadow-2xl",
                !showAI && "hidden md:flex"
              )}
            >
              <AIAssistant 
                initialPrompt={aiPrompt} 
                onClose={window.innerWidth < 768 ? () => setShowAI(false) : undefined} 
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
