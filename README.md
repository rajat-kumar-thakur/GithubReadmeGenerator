# AI README Generator

A modern Next.js application that generates comprehensive README files for GitHub repositories using Google's Gemini AI.

## Features

- 🤖 **AI-Powered Generation**: Uses Google Gemini AI to create professional README files
- 🎨 **Modern UI**: Clean, dark-themed interface with smooth animations
- 📊 **Repository Analysis**: Fetches and analyzes GitHub repository data
- 🔧 **Customizable Prompts**: Add specific instructions for README generation
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🌙 **Dark/Light Mode**: Toggle between themes with smooth transitions
- 📥 **Export Options**: Download as Markdown or copy to clipboard
- ⚡ **Rate Limiting**: Built-in protection against API abuse

## Setup

### Prerequisites

- Node.js 18+ 
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-readme-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env.local` file

## Usage

1. **Enter Repository URL**: Paste any public GitHub repository URL
2. **Add Custom Instructions** (Optional): Provide specific requirements for your README
3. **Generate**: Click the "Generate README" button
4. **Review & Export**: View the generated README and export it

## API Configuration

The application uses Google's Gemini API with the following default settings:

- **Model**: `gemini-1.5-flash` (fast and cost-effective)
- **Temperature**: `0.7` (balanced creativity and consistency)
- **Max Tokens**: `4096` (sufficient for comprehensive READMEs)
- **Rate Limiting**: 10 requests per minute (client-side)

## Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key_here    # Required: Your Gemini API key
GEMINI_MODEL=gemini-1.5-flash              # Optional: Gemini model to use
```

## Available Models

- `gemini-1.5-flash`: Fast and efficient (recommended)
- `gemini-1.5-pro`: More capable but slower
- `gemini-1.0-pro`: Legacy model

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Google Gemini API
- **GitHub Integration**: GitHub REST API
- **Language**: TypeScript
- **Theme**: next-themes for dark/light mode

## Error Handling

The application includes comprehensive error handling for:

- Invalid GitHub URLs
- Private or non-existent repositories
- Gemini API errors (quota, authentication, safety filters)
- Rate limiting
- Network issues

## Gemini API Benefits

- **Cost-effective**: Generally more affordable than OpenAI
- **Fast responses**: Optimized for quick generation
- **Safety filters**: Built-in content safety
- **Generous limits**: Higher rate limits for most use cases

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.