import { RepositoryData } from '@/app/page';

export async function generateReadme(
  repositoryData: RepositoryData,
  customPrompt: string
): Promise<string> {
  try {
    const response = await fetch('/api/generate-readme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repositoryData,
        customPrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.readme;
  } catch (error) {
    console.error('AI Service Error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to generate README. Please try again.');
  }
}

// Rate limiting helper (optional - for client-side rate limiting)
export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 10, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    // Check if we can make a new request
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }

  getTimeUntilNextRequest(): number {
    if (this.requests.length < this.maxRequests) {
      return 0;
    }
    
    const oldestRequest = Math.min(...this.requests);
    return this.timeWindow - (Date.now() - oldestRequest);
  }
}

// Create a global rate limiter instance
export const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute (more generous for Gemini)