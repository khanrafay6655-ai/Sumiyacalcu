import React, { useState, useEffect, useRef } from 'react';
import { evaluate } from 'mathjs';
import { 
  Delete, 
  RotateCcw, 
  Equal, 
  Sparkles, 
  Info,
  History,
  Settings,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalculatorProps {
  onCalculate?: (expression: string, result: string) => void;
  onAIRequest?: (expression: string, result: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onCalculate, onAIRequest }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<{expr: string, res: string}[]>([]);
  const [isScientific, setIsScientific] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [display]);

  const handleInput = (val: string) => {
    if (display === '0' && !isNaN(Number(val))) {
      setDisplay(val);
    } else {
      setDisplay(prev => prev + val);
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const backspace = () => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const calculate = () => {
    try {
      // Basic sanitization and mathjs evaluation
      const result = evaluate(display).toString();
      setHistory(prev => [{ expr: display, res: result }, ...prev].slice(0, 10));
      setExpression(display + ' =');
      setDisplay(result);
      if (onCalculate) onCalculate(display, result);
    } catch (err) {
      setDisplay('Error');
    }
  };

  const handleScientific = (func: string) => {
    if (display === '0') {
      setDisplay(func + '(');
    } else {
      setDisplay(prev => prev + func + '(');
    }
  };

  const Button = ({ 
    children, 
    onClick, 
    className, 
    variant = 'default' 
  }: { 
    children: React.ReactNode, 
    onClick: () => void, 
    className?: string,
    variant?: 'default' | 'action' | 'operator' | 'scientific'
  }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "h-14 rounded-xl font-medium text-lg transition-colors flex items-center justify-center",
        variant === 'default' && "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
        variant === 'action' && "bg-orange-500 text-white hover:bg-orange-600",
        variant === 'operator' && "bg-zinc-700 text-orange-400 hover:bg-zinc-600",
        variant === 'scientific' && "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 text-sm",
        className
      )}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="w-full max-w-md bg-zinc-950 p-6 rounded-[2rem] shadow-2xl border border-zinc-800 flex flex-col gap-6">
      {/* Display Area */}
      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 flex flex-col items-end justify-end min-h-[140px] relative overflow-hidden">
        <div className="text-zinc-500 text-sm font-mono mb-1 h-5 overflow-hidden text-ellipsis w-full text-right">
          {expression}
        </div>
        <div 
          ref={scrollRef}
          className="text-white text-4xl font-light tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none w-full text-right"
        >
          {display}
        </div>
        
        <button 
          onClick={() => onAIRequest?.(expression.replace(' =', ''), display)}
          className="absolute top-4 left-4 p-2 rounded-full bg-zinc-800 text-orange-400 hover:bg-zinc-700 transition-colors group"
          title="Explain with AI"
        >
          <Sparkles size={18} className="group-hover:animate-pulse" />
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-4 gap-3">
        {/* Scientific Row */}
        <Button variant="scientific" onClick={() => handleScientific('sin')}>sin</Button>
        <Button variant="scientific" onClick={() => handleScientific('cos')}>cos</Button>
        <Button variant="scientific" onClick={() => handleScientific('tan')}>tan</Button>
        <Button variant="scientific" onClick={() => handleScientific('log')}>log</Button>
        
        <Button variant="scientific" onClick={() => handleInput('pi')}>π</Button>
        <Button variant="scientific" onClick={() => handleInput('e')}>e</Button>
        <Button variant="scientific" onClick={() => handleScientific('sqrt')}>√</Button>
        <Button variant="scientific" onClick={() => handleInput('^')}>xʸ</Button>

        {/* Main Pad */}
        <Button variant="operator" onClick={clear} className="text-red-400">AC</Button>
        <Button variant="operator" onClick={backspace}><Delete size={20} /></Button>
        <Button variant="operator" onClick={() => handleInput('%')}>%</Button>
        <Button variant="operator" onClick={() => handleInput('/')}>÷</Button>

        <Button onClick={() => handleInput('7')}>7</Button>
        <Button onClick={() => handleInput('8')}>8</Button>
        <Button onClick={() => handleInput('9')}>9</Button>
        <Button variant="operator" onClick={() => handleInput('*')}>×</Button>

        <Button onClick={() => handleInput('4')}>4</Button>
        <Button onClick={() => handleInput('5')}>5</Button>
        <Button onClick={() => handleInput('6')}>6</Button>
        <Button variant="operator" onClick={() => handleInput('-')}>−</Button>

        <Button onClick={() => handleInput('1')}>1</Button>
        <Button onClick={() => handleInput('2')}>2</Button>
        <Button onClick={() => handleInput('3')}>3</Button>
        <Button variant="operator" onClick={() => handleInput('+')}>+</Button>

        <Button onClick={() => handleInput('0')} className="col-span-2">0</Button>
        <Button onClick={() => handleInput('.')}>.</Button>
        <Button variant="action" onClick={calculate}><Equal size={24} /></Button>
      </div>
      
      {/* Quick Scientific Extras */}
      <div className="flex justify-between items-center px-2">
        <div className="flex gap-4">
           <button className="text-zinc-500 hover:text-zinc-300 transition-colors"><History size={18} /></button>
           <button className="text-zinc-500 hover:text-zinc-300 transition-colors"><Settings size={18} /></button>
        </div>
        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          AI Scientific v1.0
        </div>
      </div>
    </div>
  );
};
