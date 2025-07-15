"use client";

import { Loader2, Github, Sparkles, Code, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface LoadingOverlayProps {
  message: string;
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="p-8 bg-card border-border max-w-md w-full mx-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-muted-foreground" />
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <Sparkles className="h-8 w-8 text-purple-500" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {message}
            </h3>
            <p className="text-muted-foreground text-sm">
              {message.includes('Gemini') || message.includes('AI') ? 'AI is analyzing your repository...' : 'This may take a few moments...'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Code className="h-4 w-4" />
              <span>Analyzing code</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="h-4 w-4" />
              <span>AI processing</span>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </Card>
    </div>
  );
}