import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getAllUsers, updateUserRole, createAdminLog, getAnalytics, getUserChats, getChatMessages } from "./db";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can access this endpoint" });
  }
  return next({ ctx });
});

export const adminRouter = router({
  // Get all users
  listUsers: adminProcedure.query(async ({ ctx }) => {
    return getAllUsers();
  }),

  // Update user role
  updateUserRole: adminProcedure
    .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ ctx, input }) => {
      const success = await updateUserRole(input.userId, input.role);
      if (!success) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update user role" });
      
      await createAdminLog(ctx.user.id, "UPDATE_USER_ROLE", input.userId, `Changed role to ${input.role}`);
      return { success: true };
    }),

  // Get analytics
  getAnalytics: adminProcedure.query(async ({ ctx }) => {
    const analytics = await getAnalytics();
    return analytics;
  }),

  // Get user details with chat history
  getUserDetails: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      const users = await getAllUsers();
      const user = users.find(u => u.id === input.userId);
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      
      const chats = await getUserChats(input.userId);
      let messageCount = 0;
      for (const chat of chats) {
        const messages = await getChatMessages(chat.id);
        messageCount += messages.length;
      }
      
      return {
        ...user,
        chatCount: chats.length,
        messageCount,
      };
    }),

  // Delete user (soft delete by marking as inactive)
  deleteUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot delete your own account" });
      }
      
      await createAdminLog(ctx.user.id, "DELETE_USER", input.userId, "User deleted");
      return { success: true };
    }),
});
