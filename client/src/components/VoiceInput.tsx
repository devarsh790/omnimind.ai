import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const transcribeMutation = trpc.voice.transcribeAudio.useMutation({
    onSuccess: (data) => {
      onTranscript(data.transcript);
      toast.success("Audio transcribed successfully");
    },
    onError: () => {
      toast.error("Failed to transcribe audio");
    },
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = (e.target?.result as string).split(",")[1];
          transcribeMutation.mutate({
            audioData: base64,
            audioFormat: "webm",
          });
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Microphone error:", error);
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2">
      {isRecording && (
        <div className="flex items-center gap-2 px-3 py-1 bg-[#ff00ff]/10 rounded border border-[#ff00ff]/30">
          <div className="w-2 h-2 bg-[#ff00ff] rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-[#ff00ff]">{formatTime(recordingTime)}</span>
        </div>
      )}
      <Button
        size="icon"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || transcribeMutation.isPending}
        className={`${
          isRecording
            ? "bg-destructive hover:bg-destructive/90"
            : "dark:border-[#00ffff]/30 dark:text-[#00ffff] dark:hover:bg-[#00ffff]/10"
        }`}
        variant={isRecording ? "default" : "outline"}
      >
        {isRecording ? <Square size={18} /> : <Mic size={18} />}
      </Button>
    </div>
  );
}
