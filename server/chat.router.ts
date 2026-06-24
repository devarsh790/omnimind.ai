import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { createChat, getUserChats, getChatById, deleteChat, createMessage, getChatMessages, getUserDocuments, getChatDocuments, createDocument, deleteDocument } from "./db";
import { TRPCError } from "@trpc/server";

export const chatRouter = router({
  // Create a new chat
  createChat: protectedProcedure
    .input(z.object({ title: z.string().min(1), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const chat = await createChat(ctx.user.id, input.title, input.description);
      if (!chat) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create chat" });
      return chat;
    }),

  // Get all chats for the current user
  listChats: protectedProcedure.query(async ({ ctx }) => {
    return getUserChats(ctx.user.id);
  }),

  // Get a specific chat
  getChat: protectedProcedure
    .input(z.object({ chatId: z.number() }))
    .query(async ({ ctx, input }) => {
      const chat = await getChatById(input.chatId, ctx.user.id);
      if (!chat) throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" });
      return chat;
    }),

  // Delete a chat
  deleteChat: protectedProcedure
    .input(z.object({ chatId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const chat = await getChatById(input.chatId, ctx.user.id);
      if (!chat) throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" });
      
      const success = await deleteChat(input.chatId, ctx.user.id);
      if (!success) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete chat" });
      return { success: true };
    }),

  // Get messages for a chat
  getMessages: protectedProcedure
    .input(z.object({ chatId: z.number() }))
    .query(async ({ ctx, input }) => {
      const chat = await getChatById(input.chatId, ctx.user.id);
      if (!chat) throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" });
      return getChatMessages(input.chatId);
    }),

  // Add a message to a chat
  addMessage: protectedProcedure
    .input(z.object({ chatId: z.number(), role: z.enum(["user", "assistant"]), content: z.string(), tokens: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const chat = await getChatById(input.chatId, ctx.user.id);
      if (!chat) throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" });
      
      const message = await createMessage(input.chatId, ctx.user.id, input.role, input.content, input.tokens);
      if (!message) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create message" });
      return message;
    }),

  // Get documents for a chat
  getChatDocuments: protectedProcedure
    .input(z.object({ chatId: z.number() }))
    .query(async ({ ctx, input }) => {
      const chat = await getChatById(input.chatId, ctx.user.id);
      if (!chat) throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" });
      return getChatDocuments(input.chatId);
    }),

  // Get all documents for the current user
  getUserDocuments: protectedProcedure.query(async ({ ctx }) => {
    return getUserDocuments(ctx.user.id);
  }),

  // Delete a document
  deleteDocument: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const success = await deleteDocument(input.documentId, ctx.user.id);
      if (!success) throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      return { success: true };
    }),
});
