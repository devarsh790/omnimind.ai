import { useState, useRef } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TextToSpeechProps {
  text: string;
  disabled?: boolean;
  autoPlay?: boolean;
}

export function TextToSpeech({ text, disabled = false, autoPlay = false }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSpeak = async () => {
    if (!text.trim()) {
      toast.error('No text to speak');
      return;
    }

    try {
      setIsSynthesizing(true);

      // Use Web Speech API (built-in browser feature)
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0; // Normal speed
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Optional: Set voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find an English voice
        const englishVoice = voices.find((voice) =>
          voice.lang.startsWith('en')
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsSynthesizing(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        toast.error('Failed to play audio');
        setIsPlaying(false);
        setIsSynthesizing(false);
      };

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Start speaking
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      toast.error('Text-to-speech not available');
      setIsSynthesizing(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <Button
      onClick={isPlaying ? handleStop : handleSpeak}
      disabled={disabled || isSynthesizing}
      variant="ghost"
      size="sm"
      className={`h-8 w-8 p-0 transition-all ${
        isPlaying
          ? 'bg-neon-cyan/20 text-neon-cyan'
          : 'text-neon-cyan hover:bg-neon-cyan/10'
      }`}
      title={isPlaying ? 'Stop speaking' : 'Play audio'}
    >
      {isSynthesizing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </Button>
  );
}
