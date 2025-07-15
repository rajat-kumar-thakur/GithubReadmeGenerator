"use client";

import { Github, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Github className="h-8 w-8 text-foreground" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                README Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered documentation
              </p>
            </div>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}