import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { createDocument, deleteDocument, getUserDocuments } from "./db";
import { TRPCError } from "@trpc/server";
import { storagePut, storageGet, storageGetSignedUrl } from "./storage";
import * as fs from "fs";
import * as path from "path";

// Supported file types
const SUPPORTED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const fileRouter = router({
  // Upload a document
  uploadDocument: protectedProcedure
    .input(z.object({ 
      chatId: z.number().optional(),
      filename: z.string(),
      fileType: z.string(),
      fileSize: z.number(),
      fileData: z.string(), // Base64 encoded file data
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Validate file type
        if (!SUPPORTED_TYPES.includes(input.fileType)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Unsupported file type" });
        }

        // Validate file size
        if (input.fileSize > MAX_FILE_SIZE) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "File size exceeds 10MB limit" });
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(input.fileData, "base64");

        // Generate unique file key
        const fileKey = `documents/${ctx.user.id}/${Date.now()}-${input.filename}`;

        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, input.fileType);

        // Extract text content from file (simplified - in production use proper PDF/DOCX parsing)
        let content = "";
        if (input.fileType === "text/plain") {
          content = buffer.toString("utf-8");
        } else {
          content = `[${input.fileType} file: ${input.filename}]`;
        }

        // Create document record
        const document = await createDocument(
          ctx.user.id,
          input.chatId || null,
          input.filename,
          input.fileType,
          input.fileSize,
          fileKey,
          url,
          content
        );

        if (!document) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create document" });
        }

        return document;
      } catch (error) {
        console.error("File upload error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to upload file" });
      }
    }),

  // Get presigned URL for document download
  getDocumentUrl: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const documents = await getUserDocuments(ctx.user.id);
        const document = documents.find(d => d.id === input.documentId);

        if (!document) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
        }

        // Get presigned URL
        const url = await storageGetSignedUrl(document.fileKey);

        return { url };
      } catch (error) {
        console.error("Get document URL error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get document URL" });
      }
    }),

  // Delete a document
  deleteDocument: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const success = await deleteDocument(input.documentId, ctx.user.id);
        if (!success) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
        }
        return { success: true };
      } catch (error) {
        console.error("Delete document error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete document" });
      }
    }),
});
