import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { githubUrl, customPrompt } = await request.json();

    if (!githubUrl) {
      return NextResponse.json({ error: 'GitHub URL is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Extract owner and repo from GitHub URL
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
    }

    const [, owner, repo] = match;

    // Fetch repository information
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoResponse.ok) {
      return NextResponse.json({ error: 'Repository not found or not accessible' }, { status: 404 });
    }

    const repoData = await repoResponse.json();

    // Fetch repository contents
    const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
    if (!contentsResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch repository contents' }, { status: 500 });
    }

    const contents = await contentsResponse.json();

    // Fetch specific files that are important for README generation
    const importantFiles = ['package.json', 'requirements.txt', 'Cargo.toml', 'go.mod', 'pom.xml', 'composer.json', 'Gemfile', 'setup.py'];
    const fileContents: Record<string, string> = {};

    for (const file of contents) {
      if (importantFiles.includes(file.name) && file.type === 'file') {
        try {
          const fileResponse = await fetch(file.download_url);
          if (fileResponse.ok) {
            const content = await fileResponse.text();
            // Limit file content size to prevent token overflow
            fileContents[file.name] = content.length > 2000 ? content.substring(0, 2000) + '...' : content;
          }
        } catch (error) {
          console.error(`Error fetching ${file.name}:`, error);
        }
      }
    }

    // Generate README using OpenAI
    const readme = await generateReadmeWithOpenAI(repoData, contents, fileContents, customPrompt);

    return NextResponse.json({
      readme,
      repoInfo: {
        name: repoData.name,
        owner: repoData.owner.login,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stargazers_count,
      },
    });

  } catch (error) {
    console.error('Error generating README:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}

async function generateReadmeWithOpenAI(
  repoData: any, 
  contents: any[], 
  fileContents: Record<string, string>, 
  customPrompt: string
): Promise<string> {
  const { name, description, language, owner } = repoData;
  const files = contents.filter(item => item.type === 'file').map(item => item.name);

  // Create a comprehensive prompt for OpenAI
  const systemPrompt = `You are an expert technical writer specializing in creating comprehensive, professional README files for GitHub repositories. Your task is to analyze the provided repository information and generate a well-structured, informative README.md file.

Guidelines:
- Create a professional, comprehensive README that follows best practices
- Include appropriate sections like Overview, Features, Installation, Usage, etc.
- Use proper markdown formatting with code blocks, badges, and structure
- Use emojis sparingly and professionally
- Ensure the README is production-ready and comprehensive`;

  const userPrompt = `Generate a comprehensive README.md file for this GitHub repository:
- Infer the project's purpose and functionality from the available information
**Repository Information:**
- Name: ${name}
- Owner: ${owner.login}
- Description: ${description || 'No description provided'}
- Primary Language: ${language || 'Not specified'}
- Stars: ${repoData.stargazers_count || 0}
- Include installation instructions based on the detected technology stack
**File Structure:**
${files.slice(0, 20).join(', ')}${files.length > 20 ? ` and ${files.length - 20} more files` : ''}
- Add usage examples when possible
**Key Configuration Files:**
${Object.entries(fileContents).map(([filename, content]) => 
  `\n--- ${filename} ---\n${content}`
).join('\n')}
- Include contribution guidelines and license information
${customPrompt ? `\n**Custom Requirements:**\n${customPrompt}` : ''}
- Make it engaging and easy to understand for both technical and non-technical users
Please generate a complete, professional README.md file that would be suitable for this repository.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Failed to generate README content.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate README with AI. Please check your OpenAI API configuration.');
  }
}