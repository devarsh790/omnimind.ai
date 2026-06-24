import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextToSpeech } from './TextToSpeech';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface EnhancedMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  displayedContent?: string;
}

export function EnhancedMessage({
  role,
  content,
  isStreaming = false,
  displayedContent,
}: EnhancedMessageProps) {
  const [displayText, setDisplayText] = useState('');
  const [copied, setCopied] = useState(false);
  const textToDisplay = displayedContent || content;

  // Line-by-line streaming effect
  useEffect(() => {
    if (!isStreaming) {
      setDisplayText(textToDisplay);
      return;
    }

    let currentIndex = 0;
    const lines = textToDisplay.split('\n');
    let displayedLines: string[] = [];

    const streamInterval = setInterval(() => {
      if (currentIndex < lines.length) {
        displayedLines.push(lines[currentIndex]);
        setDisplayText(displayedLines.join('\n'));
        currentIndex++;
      } else {
        clearInterval(streamInterval);
      }
    }, 50); // 50ms per line for smooth streaming

    return () => clearInterval(streamInterval);
  }, [textToDisplay, isStreaming]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect and render code blocks
  const renderContent = (): ReactNode[] => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(textToDisplay)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <p key={`text-${lastIndex}`} className="text-foreground/90 mb-3 leading-relaxed">
            {textToDisplay.substring(lastIndex, match.index)}
          </p>
        );
      }

      // Add code block
      const language = match[1] || 'javascript';
      const code = match[2];

      parts.push(
        <div
          key={`code-${match.index}`}
          className="relative bg-[#1e1e1e] rounded-lg overflow-hidden mb-3 border border-neon-cyan/20"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-[#0a0e27] border-b border-neon-cyan/20">
            <span className="text-xs font-mono text-neon-cyan">{language}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
              className="h-6 w-6 p-0 hover:bg-neon-pink/20"
            >
              {copied ? (
                <Check className="w-4 h-4 text-neon-pink" />
              ) : (
                <Copy className="w-4 h-4 text-neon-cyan" />
              )}
            </Button>
          </div>
          <SyntaxHighlighter
            language={language}
            style={atomDark}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < textToDisplay.length) {
      parts.push(
        <p key={`text-${lastIndex}`} className="text-foreground/90 leading-relaxed">
          {textToDisplay.substring(lastIndex)}
        </p>
      );
    }

    return parts.length > 0 ? parts : [<p className="text-foreground/90">{textToDisplay}</p>];
  };

  return (
    <div
      className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        role === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
          role === 'user'
            ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/50'
            : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
        }`}
      >
        {role === 'user' ? 'U' : 'AI'}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-2xl ${
          role === 'user' ? 'text-right' : 'text-left'
        }`}
      >
        <div
          className={`inline-block px-4 py-3 rounded-lg ${
            role === 'user'
              ? 'bg-neon-pink/10 border border-neon-pink/30 text-neon-pink'
              : 'bg-neon-cyan/5 border border-neon-cyan/30'
          }`}
        >
          {role === 'assistant' ? (
            <div className="text-left space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">{renderContent()}</div>
                <TextToSpeech text={textToDisplay} disabled={isStreaming} />
              </div>
              {isStreaming && (
                <div className="flex gap-1 mt-2">
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-200" />
                </div>
              )}
            </div>
          ) : (
            <p className="text-foreground/90">{displayText}</p>
          )}
        </div>
      </div>
    </div>
  );
}
