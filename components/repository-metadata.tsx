"use client";

import { Star, GitFork, Eye, Calendar, Code, Scale, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RepositoryData } from '@/app/page';

interface RepositoryMetadataProps {
  repository: RepositoryData;
}

export function RepositoryMetadata({ repository }: RepositoryMetadataProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Card className="p-6 mb-8 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 border-slate-200 dark:border-slate-700">
      <div className="space-y-4">
        {/* Repository Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {repository.owner}/{repository.name}
              </h1>
              <a
                href={repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
            {repository.description && (
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                {repository.description}
              </p>
            )}
          </div>
        </div>

        <Separator className="bg-slate-200 dark:bg-slate-700" />

        {/* Repository Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{formatNumber(repository.stars)}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">stars</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
            <GitFork className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{formatNumber(repository.forks)}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">forks</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
            <Eye className="h-4 w-4 text-green-500" />
            <span className="font-medium">{formatNumber(repository.watchers || 0)}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">watching</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span className="text-sm">
              {repository.lastUpdated ? formatDate(repository.lastUpdated) : 'Unknown'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Code className="h-4 w-4 text-orange-500" />
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              {repository.language || 'Unknown'}
            </Badge>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4">
            {repository.license && (
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                <Scale className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{repository.license}</span>
              </div>
            )}
            
            {repository.topics && repository.topics.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Topics:</span>
                <div className="flex flex-wrap gap-1">
                  {repository.topics.slice(0, 5).map((topic) => (
                    <Badge
                      key={topic}
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
                    >
                      {topic}
                    </Badge>
                  ))}
                  {repository.topics.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{repository.topics.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}