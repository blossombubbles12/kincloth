'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center transition-all hover:scale-105 active:scale-95 group overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun className="absolute inset-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500 fill-amber-500/20" />
        <Moon className="absolute inset-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-rose-400 fill-rose-400/20" />
      </div>
      
      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/0 to-rose-500/0 group-hover:from-rose-500/5 group-hover:to-rose-500/10 transition-all pointer-events-none" />
    </button>
  );
}
