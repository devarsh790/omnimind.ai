# OmniMind AI - API Documentation

## Overview

OmniMind AI is a production-ready AI chatbot platform with advanced features including real-time chat streaming, RAG-powered document analysis, voice I/O, code generation, and admin management.

## Base URL

```
https://api.omnimind.ai/api/trpc
```

## Authentication

All endpoints require JWT authentication via HTTP-only cookies set during OAuth login. The Manus OAuth system handles authentication automatically.

## API Endpoints

### Authentication

#### Get Current User
```
POST /api/trpc/auth.me
```
**Description:** Get the current authenticated user profile

**Response:**
```json
{
  "id": 1,
  "openId": "user_openid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-06-24T00:00:00Z",
  "updatedAt": "2024-06-24T00:00:00Z",
  "lastSignedIn": "2024-06-24T00:00:00Z"
}
```

#### Logout
```
POST /api/trpc/auth.logout
```
**Description:** Logout the current user and clear session

**Response:**
```json
{
  "success": true
}
```

### Chat Management

#### Create Chat
```
POST /api/trpc/chat.createChat
```
**Input:**
```json
{
  "title": "Chat Title",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "title": "Chat Title",
  "description": "Optional description",
  "createdAt": "2024-06-24T00:00:00Z",
  "updatedAt": "2024-06-24T00:00:00Z"
}
```

#### List User Chats
```
POST /api/trpc/chat.listChats
```
**Description:** Get all chats for the current user

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "title": "Chat Title",
    "description": "Optional description",
    "createdAt": "2024-06-24T00:00:00Z",
    "updatedAt": "2024-06-24T00:00:00Z"
  }
]
```

#### Get Chat
```
POST /api/trpc/chat.getChat
```
**Input:**
```json
{
  "chatId": 1
}
```

**Response:** Chat object

#### Delete Chat
```
POST /api/trpc/chat.deleteChat
```
**Input:**
```json
{
  "chatId": 1
}
```

**Response:**
```json
{
  "success": true
}
```

### Messages

#### Get Chat Messages
```
POST /api/trpc/chat.getMessages
```
**Input:**
```json
{
  "chatId": 1
}
```

**Response:**
```json
[
  {
    "id": 1,
    "chatId": 1,
    "userId": 1,
    "role": "user",
    "content": "Hello AI",
    "tokens": 10,
    "createdAt": "2024-06-24T00:00:00Z"
  }
]
```

#### Add Message
```
POST /api/trpc/chat.addMessage
```
**Input:**
```json
{
  "chatId": 1,
  "role": "user",
  "content": "Hello AI",
  "tokens": 10
}
```

**Response:** Message object

### LLM Features

#### Stream Chat Completion
```
POST /api/trpc/llm.streamChat
```
**Input:**
```json
{
  "chatId": 1,
  "message": "What is AI?",
  "documentIds": [1, 2]
}
```

**Response:**
```json
{
  "success": true,
  "content": "AI is artificial intelligence..."
}
```

#### Generate Code
```
POST /api/trpc/llm.generateCode
```
**Input:**
```json
{
  "chatId": 1,
  "prompt": "Create a hello world function",
  "language": "JavaScript"
}
```

**Response:**
```json
{
  "code": "function helloWorld() {\n  console.log('Hello World');\n}"
}
```

#### Summarize Text
```
POST /api/trpc/llm.summarizeText
```
**Input:**
```json
{
  "chatId": 1,
  "text": "Long text to summarize..."
}
```

**Response:**
```json
{
  "summary": "Summary of the text..."
}
```

#### Analyze Document
```
POST /api/trpc/llm.analyzeDocument
```
**Input:**
```json
{
  "chatId": 1,
  "documentId": 1,
  "question": "What is the main topic?"
}
```

**Response:**
```json
{
  "analysis": "Analysis of the document..."
}
```

### File Management

#### Upload Document
```
POST /api/trpc/file.uploadDocument
```
**Input:**
```json
{
  "chatId": 1,
  "filename": "document.pdf",
  "fileType": "application/pdf",
  "fileSize": 102400,
  "fileData": "base64_encoded_file_data"
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "chatId": 1,
  "filename": "document.pdf",
  "fileType": "application/pdf",
  "fileSize": 102400,
  "fileKey": "documents/1/1234567890-document.pdf",
  "fileUrl": "/manus-storage/documents/1/1234567890-document.pdf",
  "content": "Extracted document content",
  "createdAt": "2024-06-24T00:00:00Z",
  "updatedAt": "2024-06-24T00:00:00Z"
}
```

#### Get Document URL
```
POST /api/trpc/file.getDocumentUrl
```
**Input:**
```json
{
  "documentId": 1
}
```

**Response:**
```json
{
  "url": "presigned_s3_url"
}
```

#### Delete Document
```
POST /api/trpc/file.deleteDocument
```
**Input:**
```json
{
  "documentId": 1
}
```

**Response:**
```json
{
  "success": true
}
```

### Voice

#### Transcribe Audio
```
POST /api/trpc/voice.transcribeAudio
```
**Input:**
```json
{
  "audioData": "base64_encoded_audio",
  "audioFormat": "webm",
  "language": "en"
}
```

**Response:**
```json
{
  "transcript": "Transcribed text from audio",
  "language": "en"
}
```

### Admin

#### List All Users
```
POST /api/trpc/admin.listUsers
```
**Description:** Requires admin role

**Response:**
```json
[
  {
    "id": 1,
    "openId": "user_openid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-06-24T00:00:00Z"
  }
]
```

#### Update User Role
```
POST /api/trpc/admin.updateUserRole
```
**Input:**
```json
{
  "userId": 1,
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true
}
```

#### Get Analytics
```
POST /api/trpc/admin.getAnalytics
```
**Description:** Requires admin role

**Response:**
```json
{
  "totalUsers": 100,
  "totalMessages": 5000,
  "totalDocuments": 250,
  "activeUsers": 45
}
```

#### Get User Details
```
POST /api/trpc/admin.getUserDetails
```
**Input:**
```json
{
  "userId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "openId": "user_openid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "chatCount": 10,
  "messageCount": 150,
  "createdAt": "2024-06-24T00:00:00Z"
}
```

#### Delete User
```
POST /api/trpc/admin.deleteUser
```
**Input:**
```json
{
  "userId": 1
}
```

**Response:**
```json
{
  "success": true
}
```

## Error Handling

All errors follow the tRPC error format:

```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Error description"
}
```

### Common Error Codes

- `UNAUTHORIZED` - User not authenticated
- `FORBIDDEN` - User lacks required permissions
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid input
- `INTERNAL_SERVER_ERROR` - Server error

## Rate Limiting

API requests are rate-limited to prevent abuse:
- 100 requests per minute per user
- 1000 requests per hour per user

## Data Models

### User
```typescript
{
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}
```

### Chat
```typescript
{
  id: number;
  userId: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Message
```typescript
{
  id: number;
  chatId: number;
  userId: number;
  role: "user" | "assistant";
  content: string;
  tokens: number;
  createdAt: Date;
}
```

### Document
```typescript
{
  id: number;
  userId: number;
  chatId: number | null;
  filename: string;
  fileType: string;
  fileSize: number;
  fileKey: string;
  fileUrl: string;
  content: string | null;
  embeddings: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Integration Examples

### JavaScript/TypeScript with tRPC

```typescript
import { trpc } from '@/lib/trpc';

// Create a chat
const chat = await trpc.chat.createChat.mutate({
  title: 'My Chat'
});

// Send a message
const response = await trpc.llm.streamChat.mutate({
  chatId: chat.id,
  message: 'Hello AI'
});

// Upload a document
const doc = await trpc.file.uploadDocument.mutate({
  chatId: chat.id,
  filename: 'document.pdf',
  fileType: 'application/pdf',
  fileSize: 102400,
  fileData: base64Data
});
```

## WebSocket Support

Real-time features are available through WebSocket connections for streaming chat responses and live updates.

## Versioning

Current API Version: 1.0.0

## Support

For API support, please contact support@omnimind.ai or visit https://omnimind.ai/docs
