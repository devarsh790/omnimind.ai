import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { transcribeAudio } from "./_core/voiceTranscription";
import { storagePut } from "./storage";

export const voiceRouter = router({
  // Transcribe audio to text
  transcribeAudio: protectedProcedure
    .input(z.object({
      audioData: z.string(), // Base64 encoded audio
      audioFormat: z.string().default("mp3"), // mp3, wav, m4a, etc.
      language: z.string().optional(), // Optional language code
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Convert base64 to buffer
        const buffer = Buffer.from(input.audioData, "base64");

        // Upload audio to storage temporarily
        const fileKey = `audio/${ctx.user.id}/${Date.now()}.${input.audioFormat}`;
        const { url } = await storagePut(fileKey, buffer, `audio/${input.audioFormat}`);

        // Transcribe using Whisper API
        const result = await transcribeAudio({
          audioUrl: url,
          language: input.language,
        });

        if ("error" in result) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: result.error });
        }

        return { transcript: result.text, language: result.language };
      } catch (error) {
        console.error("Transcription error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to transcribe audio" });
      }
    }),
});
