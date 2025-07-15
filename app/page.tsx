"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  Github, 
  Sparkles, 
  Copy, 
  Download, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  FileText,
  Code,
  BookOpen,
  Settings
} from 'lucide-react';

export default function Home() {
  const [githubUrl, setGithubUrl] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedReadme, setGeneratedReadme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [repoInfo, setRepoInfo] = useState<any>(null);

  const handleGenerate = async () => {
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    // Validate GitHub URL
    const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+\/?$/;
    if (!githubRegex.test(githubUrl.trim())) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/generate-readme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubUrl: githubUrl.trim(),
          customPrompt: customPrompt.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate README');
      }

      setGeneratedReadme(data.readme);
      setRepoInfo(data.repoInfo);
      setSuccess('README generated successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReadme);
    setSuccess('README copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const downloadReadme = () => {
    const blob = new Blob([generatedReadme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
    setSuccess('README downloaded!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI README Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your GitHub repositories into beautiful, professional README files using AI. 
            Just paste your repo URL and let our AI create comprehensive documentation.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Powered by OpenAI GPT-4
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm transition-colors duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                Repository Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="github-url">GitHub Repository URL</Label>
                <Input
                  id="github-url"
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="h-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-sm text-muted-foreground">
                  Enter the URL of a public GitHub repository
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-prompt" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Custom Instructions (Optional)
                </Label>
                <Textarea
                  id="custom-prompt"
                  placeholder="Add specific instructions for the README generation (e.g., 'Focus on API documentation' or 'Include deployment instructions')"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px] resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-sm text-muted-foreground">
                  Provide additional context or specific requirements for your README
                </p>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isLoading || !githubUrl.trim()}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating README...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate README
                  </>
                )}
              </Button>

              {error && (
                <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400 animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400 animate-in slide-in-from-top-2 duration-300">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Generated README Preview */}
          <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm transition-colors duration-300">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Generated README
                </CardTitle>
                {generatedReadme && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors duration-200"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadReadme}
                      className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!generatedReadme && !isLoading && (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No README generated yet</p>
                  <p className="text-sm">Enter a GitHub repository URL to get started</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-500" />
                  <p className="text-lg mb-2">Analyzing repository...</p>
                  <p className="text-sm text-muted-foreground">This may take a few moments</p>
                </div>
              )}

              {generatedReadme && (
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="markdown">Markdown</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="mt-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div 
                        className="bg-white dark:bg-slate-800 rounded-lg p-6 border transition-colors duration-300"
                      >
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                          {generatedReadme}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="markdown" className="mt-4">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border transition-colors duration-300">
                      <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {generatedReadme}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Repository Info */}
        {repoInfo && (
          <Card className="mt-8 shadow-xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm transition-colors duration-300 animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Repository Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="font-semibold">{repoInfo.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Owner</Label>
                  <p className="font-semibold">{repoInfo.owner}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Language</Label>
                  <Badge variant="secondary">{repoInfo.language || 'N/A'}</Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Stars</Label>
                  <p className="font-semibold">{repoInfo.stars || 0}</p>
                </div>
              </div>
              {repoInfo.description && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="text-sm">{repoInfo.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}