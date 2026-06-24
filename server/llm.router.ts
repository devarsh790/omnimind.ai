import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { createMessage, getChatMessages, getChatDocuments, createDocument } from "./db";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";

export const llmRouter = router({
  // Stream chat completion
  streamChat: protectedProcedure
    .input(z.object({ 
      chatId: z.number(), 
      message: z.string(),
      documentIds: z.number().array().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Create user message
        await createMessage(input.chatId, ctx.user.id, "user", input.message);

        // Build context from documents if provided
        let context = "";
        if (input.documentIds && input.documentIds.length > 0) {
          const documents = await getChatDocuments(input.chatId);
          const selectedDocs = documents.filter(d => input.documentIds!.includes(d.id));
          context = selectedDocs.map(d => d.content).filter(Boolean).join("\n\n");
        }

        // Get chat history for context
        const messages = await getChatMessages(input.chatId);
        const conversationHistory = messages.slice(-10).map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        // Call LLM
        const response = await invokeLLM({
          messages: [
            ...conversationHistory,
            { role: "user", content: input.message },
          ],
        });

        // Store assistant message
        const messageContent = response.choices[0]?.message?.content;
        const assistantContent = typeof messageContent === 'string' ? messageContent : JSON.stringify(messageContent);
        const tokens = response.usage?.total_tokens || 0;
        if (assistantContent) {
          await createMessage(input.chatId, ctx.user.id, "assistant", assistantContent, tokens);
        }

        return { success: true, content: assistantContent };
      } catch (error) {
        console.error("LLM error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to process chat" });
      }
    }),

  // Generate code
  generateCode: protectedProcedure
    .input(z.object({ 
      chatId: z.number(),
      prompt: z.string(),
      language: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const codePrompt = `Generate ${input.language || "JavaScript"} code for: ${input.prompt}. Provide only the code without explanations.`;
        
        const response = await invokeLLM({
          messages: [{ role: "user", content: codePrompt }],
        });

        const messageContent = response.choices[0]?.message?.content;
        const code = typeof messageContent === 'string' ? messageContent : JSON.stringify(messageContent);
        const tokens = response.usage?.total_tokens || 0;
        await createMessage(input.chatId, ctx.user.id, "assistant", code, tokens);
        return { code };
      } catch (error) {
        console.error("Code generation error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to generate code" });
      }
    }),

  // Summarize text
  summarizeText: protectedProcedure
    .input(z.object({ 
      chatId: z.number(),
      text: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const summaryPrompt = `Summarize the following text concisely:\n\n${input.text}`;
        
        const response = await invokeLLM({
          messages: [{ role: "user", content: summaryPrompt }],
        });

        const messageContent = response.choices[0]?.message?.content;
        const summary = typeof messageContent === 'string' ? messageContent : JSON.stringify(messageContent);
        const tokens = response.usage?.total_tokens || 0;
        await createMessage(input.chatId, ctx.user.id, "assistant", summary, tokens);
        return { summary };
      } catch (error) {
        console.error("Summarization error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to summarize text" });
      }
    }),

  // Analyze document with RAG
  analyzeDocument: protectedProcedure
    .input(z.object({ 
      chatId: z.number(),
      documentId: z.number(),
      question: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const documents = await getChatDocuments(input.chatId);
        const document = documents.find(d => d.id === input.documentId);
        
        if (!document) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
        }

        const analysisPrompt = `Based on the following document:\n\n${document.content}\n\nAnswer this question: ${input.question}`;
        
        const response = await invokeLLM({
          messages: [{ role: "user", content: analysisPrompt }],
        });

        const messageContent = response.choices[0]?.message?.content;
        const analysis = typeof messageContent === 'string' ? messageContent : JSON.stringify(messageContent);
        const tokens = response.usage?.total_tokens || 0;
        await createMessage(input.chatId, ctx.user.id, "assistant", analysis, tokens);
        return { analysis };
      } catch (error) {
        console.error("Document analysis error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to analyze document" });
      }
    }),
});
