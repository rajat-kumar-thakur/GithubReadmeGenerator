import { parseGitHubUrl } from './utils';
import { RepositoryData } from '@/app/page';

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';

interface GitHubRepository {
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  license: { name: string } | null;
  topics: string[];
  owner: { login: string };
  html_url: string;
  default_branch: string;
  updated_at: string;
}

interface GitHubContent {
  name: string;
  type: string;
  size: number;
  download_url: string | null;
  path: string;
}

export async function fetchRepositoryData(url: string): Promise<RepositoryData> {
  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    throw new Error('Invalid GitHub URL');
  }

  const { owner, repo } = parsed;

  try {
    // Fetch repository information
    const repoResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
    if (!repoResponse.ok) {
      if (repoResponse.status === 404) {
        throw new Error('Repository not found or is private');
      }
      throw new Error(`Failed to fetch repository: ${repoResponse.statusText}`);
    }

    const repoData: GitHubRepository = await repoResponse.json();

    // Fetch repository contents
    const contentsResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents`);
    const contents: GitHubContent[] = contentsResponse.ok ? await contentsResponse.json() : [];

    // Fetch existing README if it exists
    let existingReadme = '';
    const readmeFile = contents.find(file => 
      file.name.toLowerCase().startsWith('readme') && file.type === 'file'
    );
    
    if (readmeFile && readmeFile.download_url) {
      try {
        const readmeResponse = await fetch(readmeFile.download_url);
        if (readmeResponse.ok) {
          existingReadme = await readmeResponse.text();
        }
      } catch (error) {
        console.warn('Failed to fetch existing README:', error);
      }
    }

    // Fetch package.json for dependencies
    let dependencies = {};
    const packageJson = contents.find(file => file.name === 'package.json');
    if (packageJson && packageJson.download_url) {
      try {
        const packageResponse = await fetch(packageJson.download_url);
        if (packageResponse.ok) {
          const packageData = await packageResponse.json();
          dependencies = {
            ...packageData.dependencies,
            ...packageData.devDependencies
          };
        }
      } catch (error) {
        console.warn('Failed to fetch package.json:', error);
      }
    }

    // Identify main files
    const mainFiles = contents
      .filter(file => file.type === 'file')
      .filter(file => {
        const name = file.name.toLowerCase();
        return name.includes('index') || 
               name.includes('main') || 
               name.includes('app') ||
               name.endsWith('.json') ||
               name.endsWith('.md') ||
               name.endsWith('.yml') ||
               name.endsWith('.yaml');
      })
      .map(file => file.name);

    // Create repository structure
    const structure = contents.map(item => ({
      name: item.name,
      type: item.type,
      size: item.size,
      path: item.path
    }));

    const repositoryData: RepositoryData = {
      name: repoData.name,
      description: repoData.description || '',
      language: repoData.language || 'Unknown',
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      watchers: repoData.watchers_count,
      license: repoData.license?.name || '',
      topics: repoData.topics || [],
      readme: existingReadme,
      structure,
      dependencies,
      mainFiles,
      owner: repoData.owner.login,
      url: repoData.html_url,
      lastUpdated: repoData.updated_at
    };

    return repositoryData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch repository data');
  }
}

export async function fetchFileContent(owner: string, repo: string, path: string): Promise<string> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.type === 'file' && data.download_url) {
      const fileResponse = await fetch(data.download_url);
      if (fileResponse.ok) {
        return await fileResponse.text();
      }
    }
    
    throw new Error('File not found or is not a regular file');
  } catch (error) {
    throw new Error(`Failed to fetch file content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}