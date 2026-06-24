import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, chats, messages, documents, adminLogs, Chat, Message, Document, AdminLog, InsertChat, InsertMessage, InsertDocument, InsertAdminLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Chat operations
export async function createChat(userId: number, title: string, description?: string): Promise<Chat | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(chats).values({
    userId,
    title,
    description,
  });
  
  return db.select().from(chats).where(eq(chats.id, result[0].insertId as any)).limit(1).then(r => r[0] || null);
}

export async function getUserChats(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(chats).where(eq(chats.userId, userId)).orderBy(desc(chats.updatedAt));
}

export async function getChatById(chatId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(chats).where(and(eq(chats.id, chatId), eq(chats.userId, userId))).limit(1);
  return result[0] || null;
}

export async function deleteChat(chatId: number, userId: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(messages).where(eq(messages.chatId, chatId));
  await db.delete(documents).where(eq(documents.chatId, chatId));
  await db.delete(chats).where(and(eq(chats.id, chatId), eq(chats.userId, userId)));
  return true;
}

// Message operations
export async function createMessage(chatId: number, userId: number, role: 'user' | 'assistant', content: string, tokens?: number): Promise<Message | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(messages).values({
    chatId,
    userId,
    role,
    content,
    tokens,
  });
  
  return db.select().from(messages).where(eq(messages.id, result[0].insertId as any)).limit(1).then(r => r[0] || null);
}

export async function getChatMessages(chatId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(messages).where(eq(messages.chatId, chatId)).orderBy(messages.createdAt);
}

// Document operations
export async function createDocument(userId: number, chatId: number | null, filename: string, fileType: string, fileSize: number, fileKey: string, fileUrl: string, content?: string): Promise<Document | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(documents).values({
    userId,
    chatId,
    filename,
    fileType,
    fileSize,
    fileKey,
    fileUrl,
    content,
  });
  
  return db.select().from(documents).where(eq(documents.id, result[0].insertId as any)).limit(1).then(r => r[0] || null);
}

export async function getUserDocuments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.createdAt));
}

export async function getChatDocuments(chatId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(documents).where(eq(documents.chatId, chatId));
}

export async function deleteDocument(documentId: number, userId: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(documents).where(and(eq(documents.id, documentId), eq(documents.userId, userId)));
  return true;
}

// Admin operations
export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(userId: number, role: 'user' | 'admin') {
  const db = await getDb();
  if (!db) return false;
  
  await db.update(users).set({ role }).where(eq(users.id, userId));
  return true;
}

export async function createAdminLog(adminId: number, action: string, targetUserId?: number, details?: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(adminLogs).values({
    adminId,
    action,
    targetUserId,
    details,
  });
  
  return db.select().from(adminLogs).where(eq(adminLogs.id, result[0].insertId as any)).limit(1).then(r => r[0] || null);
}

export async function getAnalytics() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, totalMessages: 0, totalDocuments: 0, activeUsers: 0 };
  
  const totalUsers = await db.select().from(users);
  const totalMessages = await db.select().from(messages);
  const totalDocuments = await db.select().from(documents);
  const activeUsers = await db.select().from(users).where(eq(users.role, 'user'));
  
  return {
    totalUsers: totalUsers.length,
    totalMessages: totalMessages.length,
    totalDocuments: totalDocuments.length,
    activeUsers: activeUsers.length,
  };
}
