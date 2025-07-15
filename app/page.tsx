"use client";

import { useState } from 'react';
import { Header } from '@/components/header';
import { RepositoryInput } from '@/components/repository-input';
import { ReadmeOutput } from '@/components/readme-output';
import { LoadingOverlay } from '@/components/loading-overlay';
import { toast } from 'sonner';
import { generateReadme } from '@/lib/ai-service';
import { rateLimiter } from '@/lib/ai-service';
import { fetchRepositoryData } from '@/lib/github-service';
import { validateGitHubUrl } from '@/lib/utils';

export interface RepositoryData {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  watchers?: number;
  license: string;
  topics: string[];
  readme: string;
  structure: any[];
  dependencies: any;
  mainFiles: string[];
  owner: string;
  url: string;
  lastUpdated?: string;
}

export default function Home() {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [repositoryData, setRepositoryData] = useState<RepositoryData | null>(null);
  const [generatedReadme, setGeneratedReadme] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleUrlSubmit = async (url: string, prompt: string) => {
    if (!validateGitHubUrl(url)) {
      toast.error('Please enter a valid GitHub repository URL');
      return;
    }

    // Check rate limiting
    if (!rateLimiter.canMakeRequest()) {
      const waitTime = Math.ceil(rateLimiter.getTimeUntilNextRequest() / 1000);
      toast.error(`Rate limit exceeded. Please wait ${waitTime} seconds before trying again.`);
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Analyzing repository...');
    
    try {
      // Fetch repository data
      const data = await fetchRepositoryData(url);
      setRepositoryData(data);
      
      setLoadingMessage('Generating README with Gemini AI...');
      
      // Generate README
      const readme = await generateReadme(data, prompt);
      setGeneratedReadme(readme);
      setRepositoryUrl(url);
      setCustomPrompt(prompt);
      
      toast.success('README generated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process repository';
      toast.error(errorMessage);
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleReset = () => {
    setRepositoryUrl('');
    setRepositoryData(null);
    setGeneratedReadme('');
    setCustomPrompt('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-120px)]">
            {/* Left Column - Repository Input */}
            <div className="flex flex-col">
              <RepositoryInput
                onSubmit={handleUrlSubmit}
                disabled={isLoading}
                initialUrl={repositoryUrl}
                initialPrompt={customPrompt}
              />
            </div>

            {/* Right Column - README Output */}
            <div className="flex flex-col">
              <ReadmeOutput
                content={generatedReadme}
                repositoryData={repositoryData}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>
      </main>

      {isLoading && (
        <LoadingOverlay message={loadingMessage} />
      )}
    </div>
  );
}