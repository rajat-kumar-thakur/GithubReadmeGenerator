"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Code, Download, Copy, RefreshCw, Star, GitFork, BookOpen } from 'lucide-react';
import { RepositoryData } from '@/app/page';
import { RepositoryMetadata } from '@/components/repository-metadata';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { toast } from 'sonner';

interface ReadmeOutputProps {
  content: string;
  repositoryData: RepositoryData | null;
  onReset: () => void;
}

export function ReadmeOutput({ content, repositoryData, onReset }: ReadmeOutputProps) {
  const [activeTab, setActiveTab] = useState('preview');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('README copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${repositoryData?.name || 'README'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('README downloaded successfully!');
  };

  if (!content) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Generated README</h2>
        </div>

        <Card className="flex-1 flex items-center justify-center bg-card border-border">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">No README generated yet</h3>
              <p className="text-muted-foreground">
                Enter a GitHub repository URL to get started
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Generated README</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="border-border"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="border-border"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="border-border"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col bg-card border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b border-border px-6 py-3">
            <TabsList className="bg-muted">
              <TabsTrigger value="preview" className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="markdown" className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                Markdown
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="preview" className="flex-1 p-6 overflow-auto">
            <div className="space-y-0">
              {repositoryData && <RepositoryMetadata repository={repositoryData} />}
              <MarkdownRenderer content={content} />
            </div>
          </TabsContent>

          <TabsContent value="markdown" className="flex-1 p-6 overflow-auto">
            {repositoryData && (
              <div className="mb-6">
                <RepositoryMetadata repository={repositoryData} />
              </div>
            )}
            <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto border border-border">
              <code className="text-foreground whitespace-pre-wrap">
                {content}
              </code>
            </pre>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}