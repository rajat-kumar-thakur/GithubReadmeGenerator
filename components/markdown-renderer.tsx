"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { theme } = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Enhanced heading rendering with better spacing
            h1: ({ children }) => (
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 mt-8 first:mt-0 pb-3 border-b border-slate-200 dark:border-slate-700">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-4 mt-8 first:mt-0 pb-2 border-b border-slate-200 dark:border-slate-700">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3 mt-6 first:mt-0">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2 mt-5 first:mt-0">
                {children}
              </h4>
            ),
            h5: ({ children }) => (
              <h5 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 mt-4 first:mt-0">
                {children}
              </h5>
            ),
            h6: ({ children }) => (
              <h6 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2 mt-4 first:mt-0">
                {children}
              </h6>
            ),

            // Enhanced paragraph spacing
            p: ({ children }) => (
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {children}
              </p>
            ),

            // Enhanced code blocks with copy functionality
            code({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode; [key: string]: any }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');
              
              if (!inline && match) {
                return (
                  <div className="relative group mb-6">
                    <div className="flex items-center justify-between bg-slate-800 dark:bg-slate-900 px-4 py-2 rounded-t-lg">
                      <span className="text-sm text-slate-300 font-medium">
                        {match[1]}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCode(codeString)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-white hover:bg-slate-700"
                      >
                        {copiedCode === codeString ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <SyntaxHighlighter
                      style={theme === 'dark' ? oneDark : oneLight}
                      language={match[1]}
                      PreTag="div"
                      className="!mt-0 !rounded-t-none !rounded-b-lg"
                      {...props}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              return (
                <code 
                  className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-sm font-mono" 
                  {...props}
                >
                  {children}
                </code>
              );
            },

            // Enhanced blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-6 py-4 my-6 italic text-slate-700 dark:text-slate-300">
                {children}
              </blockquote>
            ),

            // Enhanced lists
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700 dark:text-slate-300 ml-4">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-700 dark:text-slate-300 ml-4">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),

            // Enhanced links
            a: ({ href, children }) => (
              <a
                href={href}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-300 dark:decoration-blue-600 underline-offset-2 hover:decoration-blue-500 dark:hover:decoration-blue-400 transition-colors inline-flex items-center gap-1"
              >
                {children}
                {href?.startsWith('http') && (
                  <ExternalLink className="h-3 w-3 opacity-70" />
                )}
              </a>
            ),

            // Enhanced tables
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-slate-100 dark:bg-slate-800">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="border border-slate-300 dark:border-slate-600 px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-slate-300 dark:border-slate-600 px-4 py-3 text-slate-700 dark:text-slate-300">
                {children}
              </td>
            ),

            // Enhanced horizontal rules
            hr: () => (
              <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
            ),

            // Enhanced images
            img: ({ src, alt }) => (
              <div className="my-6">
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full h-auto rounded-lg shadow-md border border-slate-200 dark:border-slate-700"
                />
                {alt && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 italic">
                    {alt}
                  </p>
                )}
              </div>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </Card>
  );
}