import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI README Generator - Transform GitHub repos into beautiful documentation',
  description: 'Generate professional README files for your GitHub repositories using AI. Just paste your repo URL and get comprehensive documentation instantly.',
  keywords: ['README', 'GitHub', 'AI', 'documentation', 'generator', 'markdown'],
  authors: [{ name: 'AI README Generator' }],
  openGraph: {
    title: 'AI README Generator',
    description: 'Transform GitHub repositories into beautiful README files using AI',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}