import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateGitHubUrl(url: string): boolean {
  const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/;
  return githubRegex.test(url);
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/^https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/?$/);
  if (!match) return null;
  
  return {
    owner: match[1],
    repo: match[2]
  };
}

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function generateBadges(repository: any): string[] {
  const badges = [];
  
  // Language badge
  if (repository.language) {
    badges.push(`![${repository.language}](https://img.shields.io/badge/language-${repository.language}-blue.svg)`);
  }
  
  // License badge
  if (repository.license) {
    badges.push(`![License](https://img.shields.io/badge/license-${repository.license}-green.svg)`);
  }
  
  // Stars badge
  badges.push(`![Stars](https://img.shields.io/github/stars/${repository.owner}/${repository.name}.svg?style=social)`);
  
  // Issues badge
  badges.push(`![Issues](https://img.shields.io/github/issues/${repository.owner}/${repository.name}.svg)`);
  
  // Forks badge
  badges.push(`![Forks](https://img.shields.io/github/forks/${repository.owner}/${repository.name}.svg?style=social)`);
  
  return badges;
}