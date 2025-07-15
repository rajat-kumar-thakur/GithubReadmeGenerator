"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Github, Settings, Sparkles } from 'lucide-react';

interface RepositoryInputProps {
  onSubmit: (url: string, prompt: string) => void;
  disabled: boolean;
  initialUrl?: string;
  initialPrompt?: string;
}

export function RepositoryInput({ onSubmit, disabled, initialUrl = '', initialPrompt = '' }: RepositoryInputProps) {
  const [url, setUrl] = useState(initialUrl);
  const [customPrompt, setCustomPrompt] = useState(initialPrompt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim(), customPrompt.trim());
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-6">
        <Github className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">Repository Details</h2>
      </div>

      <Card className="flex-1 p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="h-full flex flex-col space-y-6">
          <div className="space-y-3">
            <Label htmlFor="github-url" className="text-sm font-medium text-foreground">
              GitHub Repository URL
            </Label>
            <Input
              id="github-url"
              type="url"
              placeholder="https://github.com/username/repository"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={disabled}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            <p className="text-sm text-muted-foreground">
              Enter the URL of a public GitHub repository
            </p>
          </div>

          <div className="flex-1 flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="custom-prompt" className="text-sm font-medium text-foreground">
                Custom Instructions (Optional)
              </Label>
            </div>
            <Textarea
              id="custom-prompt"
              placeholder="Add specific instructions for the README generation (e.g., 'Focus on API documentation' or 'Include deployment instructions')"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={disabled}
              className="flex-1 min-h-[120px] bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Provide additional context or specific requirements for your README
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={disabled || !url.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {disabled ? 'Generating README...' : 'Generate README'}
          </Button>
        </form>
      </Card>
    </div>
  );
}