import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repositoryData, customPrompt } = body;

    if (!repositoryData) {
      return NextResponse.json(
        { error: 'Repository data is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 401 }
      );
    }

    // Create a comprehensive prompt for README generation
    const systemPrompt = `You are an expert technical writer specializing in creating comprehensive, professional README files for GitHub repositories. Your task is to analyze the provided repository data and generate a well-structured, informative README.md file.

Guidelines:
- Create a professional, comprehensive README that follows best practices
- Include relevant badges for the project (shields.io format)
- Structure the content with clear sections and proper markdown formatting
- Generate realistic code examples based on the repository's language and structure
- Include installation instructions, usage examples, and API documentation where appropriate
- Make the README engaging and informative for developers
- Use proper markdown syntax with code blocks, tables, and formatting
- Include contributing guidelines and license information
- Add a table of contents for longer READMEs
- Focus on clarity and usefulness for developers who want to understand and use the project
- Generate content that is specific to the repository, not generic templates`;

    const userPrompt = `Please generate a comprehensive README.md file for this GitHub repository:

Repository Information:
- Name: ${repositoryData.name}
- Description: ${repositoryData.description || 'No description provided'}
- Language: ${repositoryData.language}
- Stars: ${repositoryData.stars}
- Forks: ${repositoryData.forks}
- License: ${repositoryData.license || 'No license specified'}
- Topics: ${repositoryData.topics?.join(', ') || 'None'}
- Owner: ${repositoryData.owner}

Repository Structure:
${repositoryData.structure?.map((item: any) => `- ${item.type === 'dir' ? '📁' : '📄'} ${item.name}`).join('\n') || 'Structure not available'}

Main Files:
${repositoryData.mainFiles?.join(', ') || 'No main files identified'}

Dependencies:
${Object.keys(repositoryData.dependencies || {}).slice(0, 10).join(', ') || 'No dependencies found'}

${repositoryData.readme ? `Existing README (for reference, but create a new one):
${repositoryData.readme.substring(0, 1000)}...` : 'No existing README found'}

${customPrompt ? `Additional Instructions:
${customPrompt}` : ''}

Please generate a complete, professional README.md file that would be suitable for this repository. Make it comprehensive but not overly verbose, and ensure it's well-formatted with proper markdown syntax. Include relevant badges, clear installation instructions, usage examples, and all necessary sections for a professional open-source project.

The format output should be .md no unecessary details should be added

dont add md''' please`;

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
    });

    // Combine system and user prompts
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const generatedReadme = response.text();

    if (!generatedReadme) {
      throw new Error('Failed to generate README content');
    }

    return NextResponse.json({
      readme: generatedReadme,
      usage: {
        prompt_tokens: fullPrompt.length,
        completion_tokens: generatedReadme.length,
        total_tokens: fullPrompt.length + generatedReadme.length,
      },
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    if (error instanceof Error) {
      // Handle specific Gemini API errors
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Gemini API key is not configured or invalid' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: 'Gemini API quota exceeded. Please check your usage limits.' },
          { status: 429 }
        );
      }

      if (error.message.includes('SAFETY')) {
        return NextResponse.json(
          { error: 'Content was blocked by Gemini safety filters. Please try with different repository data.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: `Gemini API Error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred while generating the README' },
      { status: 500 }
    );
  }
}