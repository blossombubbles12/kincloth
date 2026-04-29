'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 neo-border bg-[var(--card)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-black transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all" size={16} />
      <Moon className="absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" size={16} />
    </button>
  );
}
