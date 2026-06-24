# OmniMind AI - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   React UI   │  │  Chat Page   │  │   Admin      │           │
│  │  (Cyberpunk  │  │  (Messages,  │  │  Dashboard   │           │
│  │   Theme)     │  │   Voice I/O) │  │  (Analytics) │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│         │                  │                  │                   │
│         └──────────────────┼──────────────────┘                   │
│                            │                                      │
│                    tRPC Client Layer                              │
└─────────────────────────────────────────────────────────────────┘
                             │
                    HTTP/WebSocket
                             │
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│              (Express.js + tRPC Server)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  OAuth Middleware  │  Auth Middleware  │  Error Handler  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌──────▼──────────┐
│  Chat Router   │  │  LLM Router     │  │  File Router    │
│  - Create      │  │  - Stream Chat  │  │  - Upload       │
│  - List        │  │  - Code Gen     │  │  - Delete       │
│  - Delete      │  │  - Summarize    │  │  - Get URL      │
│  - Messages    │  │  - Analyze      │  │  - RAG Query    │
└────────────────┘  └─────────────────┘  └─────────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌──────▼──────────┐
│  Voice Router  │  │  Admin Router   │  │  Auth Router    │
│  - Transcribe  │  │  - List Users   │  │  - Me           │
│  - TTS         │  │  - Update Role  │  │  - Logout       │
│                │  │  - Analytics    │  │                 │
│                │  │  - Delete User  │  │                 │
└────────────────┘  └─────────────────┘  └─────────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ LLM Service  │  │ Storage      │  │ Voice        │           │
│  │ (Streaming)  │  │ Service      │  │ Service      │           │
│  │              │  │ (S3)         │  │ (Whisper)    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
        │                    │                    │
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌──────▼──────────┐
│  LLM Provider  │  │  S3 Storage     │  │  Whisper API    │
│  (Claude/      │  │  (Manus Built-  │  │  (Speech-to-    │
│   OpenAI)      │  │   in Storage)   │  │   Text)         │
└────────────────┘  └─────────────────┘  └─────────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MySQL Database                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │  Users   │  │  Chats   │  │ Messages │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  │  ┌──────────┐  ┌──────────┐                            │   │
│  │  │Documents │  │Admin Logs│                            │   │
│  │  └──────────┘  └──────────┘                            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

```
App
├── ThemeProvider (Dark/Light Mode)
├── Router
│   ├── Home (Landing Page)
│   ├── Chat
│   │   ├── ChatSidebar
│   │   │   ├── NewChatButton
│   │   │   └── ChatList
│   │   ├── ChatArea
│   │   │   ├── MessageDisplay
│   │   │   └── MessageInput
│   │   │       ├── FileUploadDialog
│   │   │       └── VoiceInput
│   │   └── FileUploadDialog
│   ├── AdminDashboard
│   │   ├── AnalyticsCards
│   │   └── UserManagementTable
│   ├── Profile
│   │   ├── UserInfo
│   │   └── EditForm
│   └── NotFound
└── ErrorBoundary
```

### Backend Routers

```
appRouter
├── system
├── auth
│   ├── me
│   └── logout
├── chat
│   ├── createChat
│   ├── listChats
│   ├── getChat
│   ├── deleteChat
│   ├── getMessages
│   └── addMessage
├── llm
│   ├── streamChat
│   ├── generateCode
│   ├── summarizeText
│   └── analyzeDocument
├── file
│   ├── uploadDocument
│   ├── getDocumentUrl
│   └── deleteDocument
├── voice
│   └── transcribeAudio
└── admin
    ├── listUsers
    ├── updateUserRole
    ├── getAnalytics
    ├── getUserDetails
    └── deleteUser
```

## Data Flow Diagrams

### Chat Message Flow

```
User Input
    ↓
[Chat Page]
    ↓
Send Message Mutation
    ↓
[LLM Router] - streamChat
    ↓
Extract Context (RAG if documents)
    ↓
Call LLM Service (Claude/OpenAI)
    ↓
Stream Response
    ↓
[Chat Page] - Display Message
    ↓
Store in Database
    ↓
Update Message History
```

### Document Upload Flow

```
User Selects File
    ↓
[FileUploadDialog]
    ↓
Validate File (Type, Size)
    ↓
Convert to Base64
    ↓
Upload Mutation
    ↓
[File Router] - uploadDocument
    ↓
Upload to S3 Storage
    ↓
Extract Text Content
    ↓
Generate Embeddings (for RAG)
    ↓
Store Metadata in Database
    ↓
Return Document Object
    ↓
[Chat Page] - Show Success
```

### Voice Input Flow

```
User Clicks Mic Button
    ↓
[VoiceInput Component]
    ↓
Request Microphone Permission
    ↓
Start Recording (MediaRecorder)
    ↓
User Speaks
    ↓
User Clicks Stop
    ↓
Convert Audio to Blob
    ↓
Convert to Base64
    ↓
Transcribe Mutation
    ↓
[Voice Router] - transcribeAudio
    ↓
Upload Audio to S3
    ↓
Call Whisper API
    ↓
Return Transcript
    ↓
[Chat Page] - Populate Input Field
```

### Admin Analytics Flow

```
Admin Navigates to Dashboard
    ↓
[AdminDashboard Page]
    ↓
Check User Role (must be admin)
    ↓
Fetch Analytics Mutation
    ↓
[Admin Router] - getAnalytics
    ↓
Query Database
    ├── COUNT(users) → Total Users
    ├── COUNT(messages) → Total Messages
    ├── COUNT(documents) → Total Documents
    └── COUNT(DISTINCT userId) → Active Users
    ↓
Return Analytics Object
    ↓
[AdminDashboard] - Display Cards
```

## Security Architecture

### Authentication Flow

```
User Visits App
    ↓
Check Session Cookie
    ↓
If No Session:
    ├── Redirect to OAuth Login
    ├── User Authenticates with Manus
    ├── Receive OAuth Token
    ├── Create/Update User in Database
    └── Set Session Cookie
    ↓
If Session Exists:
    ├── Validate Cookie
    ├── Load User Context
    └── Allow Access
```

### Authorization Flow

```
User Makes API Request
    ↓
[Auth Middleware]
    ↓
Check Session Cookie
    ↓
If Missing/Invalid:
    └── Return 401 Unauthorized
    ↓
Extract User from Session
    ↓
Check Procedure Type:
    ├── publicProcedure → Allow
    ├── protectedProcedure → Check User Exists
    └── adminProcedure → Check User Role = "admin"
    ↓
If Check Fails:
    └── Return 403 Forbidden
    ↓
Proceed with Request
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Manus Hosting Platform          │
│  (Autoscale / Cloud Run)                │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐   │
│  │   Node.js Application            │   │
│  │   ├── Express Server             │   │
│  │   ├── tRPC Router                │   │
│  │   ├── Vite Dev Server (Dev)      │   │
│  │   └── React Build (Prod)         │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │   Environment Variables          │   │
│  │   ├── DATABASE_URL               │   │
│  │   ├── BUILT_IN_FORGE_API_KEY     │   │
│  │   ├── JWT_SECRET                 │   │
│  │   └── OAuth Credentials          │   │
│  └──────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
    ┌─────────┐  ┌──────────┐  ┌──────────┐
    │ MySQL   │  │ S3       │  │ LLM      │
    │ Database│  │ Storage  │  │ APIs     │
    └─────────┘  └──────────┘  └──────────┘
```

## Performance Optimization

### Frontend Optimization
- Code splitting with React Router
- Lazy loading of components
- Memoization of expensive computations
- Virtual scrolling for large message lists
- Image optimization with WebP

### Backend Optimization
- Database query optimization with indexes
- Connection pooling for MySQL
- Caching layer for frequently accessed data
- Batch processing for bulk operations
- Compression for API responses

### LLM Optimization
- Streaming responses to reduce latency
- Token optimization for cost efficiency
- Caching of common queries
- Rate limiting to prevent abuse

## Scalability Strategy

### Horizontal Scaling
- Stateless application design
- Load balancing across multiple instances
- Database replication for read scaling
- S3 for distributed file storage

### Vertical Scaling
- Optimize database queries
- Implement caching strategies
- Use connection pooling
- Monitor and optimize memory usage

### Database Scaling
- Implement sharding by userId
- Archive old data
- Use read replicas
- Optimize indexes

## Monitoring and Logging

```
Application Logs
    ├── Server Logs (.manus-logs/devserver.log)
    ├── Browser Console Logs (.manus-logs/browserConsole.log)
    ├── Network Requests (.manus-logs/networkRequests.log)
    └── Session Replay (.manus-logs/sessionReplay.log)

Metrics
    ├── API Response Times
    ├── Error Rates
    ├── Database Query Performance
    ├── LLM API Latency
    └── User Activity

Alerts
    ├── High Error Rate
    ├── Slow API Responses
    ├── Database Connection Issues
    └── LLM API Failures
```

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS 4 |
| State Management | tRPC + React Query |
| Backend | Express.js, tRPC 11 |
| Database | MySQL, Drizzle ORM |
| Authentication | Manus OAuth |
| File Storage | S3-compatible (Manus Storage) |
| LLM Integration | Claude/OpenAI APIs |
| Voice | Whisper API |
| Deployment | Manus Cloud (Node.js) |
| Development | Vite, TypeScript, Vitest |
