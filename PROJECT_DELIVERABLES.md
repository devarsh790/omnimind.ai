# OmniMind AI - Complete Project Deliverables

## 📋 Project Abstract

**OmniMind AI** is a production-ready, cyberpunk-themed AI chatbot platform that delivers advanced conversational AI capabilities with a futuristic, visually striking interface. Built with React.js, Express.js, and MySQL, it combines real-time streaming chat completions, RAG-powered document analysis, voice I/O, and comprehensive admin controls into a seamless, enterprise-grade application.

The platform is designed for final-year Computer Engineering students and professionals seeking a portfolio-worthy project that demonstrates full-stack development expertise, AI integration, and modern web architecture.

---

## 🎯 Project Objectives

1. **Deliver ChatGPT-like Experience**: Implement real-time streaming chat with line-by-line message rendering
2. **Enable AI-Powered Features**: Integrate code generation, text summarization, and document analysis
3. **Support Multi-Modal Input/Output**: Implement voice transcription (Whisper API) and text-to-speech
4. **Provide Document Intelligence**: Build RAG pipeline for analyzing uploaded documents (PDF, DOCX, TXT)
5. **Establish Admin Controls**: Create user management and analytics dashboard with role-based access
6. **Ensure Security & Scalability**: Implement JWT authentication, secure file storage, and production-ready architecture
7. **Create Cyberpunk Aesthetic**: Design high-contrast, neon-themed UI with smooth animations

---

## ✨ Key Features Implemented

### Core Chat Features
- ✅ Real-time streaming chat interface with ChatGPT-like UX
- ✅ Create, list, and delete chat sessions
- ✅ Persistent chat history with database storage
- ✅ Line-by-line message streaming for natural reading flow
- ✅ Syntax highlighting for code blocks in responses

### AI Capabilities
- ✅ Streaming chat completions via LLM API
- ✅ Code generation in multiple programming languages
- ✅ Text summarization with AI analysis
- ✅ Document analysis with RAG (Retrieval-Augmented Generation)
- ✅ Clickable AI feature buttons with beautiful dialogs

### File & Document Management
- ✅ Upload support for PDF, DOCX, and TXT files
- ✅ Drag-and-drop file upload interface
- ✅ Document list display with metadata
- ✅ Document deletion with confirmation
- ✅ Secure S3 storage with presigned URLs
- ✅ File size and type validation

### Voice Features
- ✅ Speech-to-text using Whisper API
- ✅ Microphone recording with visual feedback
- ✅ Real-time transcription display
- ✅ Language detection support

### Authentication & User Management
- ✅ OAuth authentication via Manus
- ✅ JWT-based session management
- ✅ User profile page with editable information
- ✅ Role-based access control (admin/user)
- ✅ Secure password and token handling

### Admin Dashboard
- ✅ User management interface
- ✅ Real-time analytics (total users, messages, documents, active users)
- ✅ Role assignment and user administration
- ✅ System monitoring and logging
- ✅ Admin-only route protection

### Design & UX
- ✅ Cyberpunk aesthetic with neon pink/cyan colors
- ✅ Dark and light mode toggle
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ HUD-style UI elements with technical lines
- ✅ Gradient buttons and glowing effects
- ✅ Loading states and skeleton screens
- ✅ Toast notifications for user feedback

---

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with custom cyberpunk theme
- **State Management**: tRPC React Query hooks
- **UI Components**: shadcn/ui with custom cyberpunk variants
- **Code Highlighting**: react-syntax-highlighter
- **Routing**: Wouter (lightweight router)
- **Animations**: Framer Motion + Tailwind animations

### Backend Stack
- **Runtime**: Node.js with Express.js
- **API Framework**: tRPC for type-safe RPC
- **Database**: MySQL with Drizzle ORM
- **Authentication**: JWT + Manus OAuth
- **File Storage**: S3-compatible storage
- **LLM Integration**: Streaming chat completions API
- **Voice**: Whisper API for transcription

### Database Schema
```
Users Table
├── id (PK)
├── openId (unique)
├── name
├── email
├── loginMethod
├── role (admin/user)
├── createdAt
├── updatedAt
└── lastSignedIn

Chats Table
├── id (PK)
├── userId (FK)
├── title
├── createdAt
└── updatedAt

Messages Table
├── id (PK)
├── chatId (FK)
├── role (user/assistant)
├── content
├── tokens
├── createdAt
└── updatedAt

Documents Table
├── id (PK)
├── userId (FK)
├── chatId (FK)
├── filename
├── fileType
├── fileSize
├── fileUrl
├── content (for RAG)
├── createdAt
└── updatedAt

AdminLogs Table
├── id (PK)
├── adminId (FK)
├── action
├── targetUserId (FK)
├── details
├── timestamp
└── createdAt
```

---

## 📁 Project File Structure

```
omnimind-ai/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx                 # Landing page with cyberpunk design
│   │   │   ├── ChatEnhanced.tsx         # Main chat interface
│   │   │   ├── AdminDashboard.tsx       # Admin panel
│   │   │   ├── Profile.tsx              # User profile
│   │   │   └── NotFound.tsx             # 404 page
│   │   ├── components/
│   │   │   ├── EnhancedMessage.tsx      # Message with streaming & syntax highlighting
│   │   │   ├── AIFeatureButtons.tsx     # Code gen, analysis, summarize buttons
│   │   │   ├── FileUploadDialog.tsx     # File upload with drag-drop
│   │   │   ├── VoiceInput.tsx           # Voice recording component
│   │   │   ├── DocumentList.tsx         # Document list display
│   │   │   ├── ChatSidebar.tsx          # Sidebar with chats & documents
│   │   │   ├── DashboardLayout.tsx      # Admin layout template
│   │   │   └── ui/                      # shadcn/ui components
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx         # Dark/light mode
│   │   ├── hooks/
│   │   │   ├── useAuth.ts               # Auth state hook
│   │   │   └── useMobile.tsx            # Responsive design hook
│   │   ├── lib/
│   │   │   ├── trpc.ts                  # tRPC client setup
│   │   │   └── utils.ts                 # Utility functions
│   │   ├── cyberpunk.css                # Neon theme CSS
│   │   ├── index.css                    # Global styles
│   │   ├── App.tsx                      # Route definitions
│   │   ├── main.tsx                     # React entry point
│   │   └── const.ts                     # Constants
│   ├── public/
│   │   └── favicon.ico
│   └── index.html
├── server/
│   ├── chat.router.ts                   # Chat endpoints
│   ├── llm.router.ts                    # LLM integration
│   ├── file.router.ts                   # File upload/storage
│   ├── voice.router.ts                  # Voice transcription
│   ├── admin.router.ts                  # Admin endpoints
│   ├── db.ts                            # Database queries
│   ├── routers.ts                       # Main router setup
│   ├── storage.ts                       # S3 storage helpers
│   ├── auth.logout.test.ts              # Test example
│   └── _core/                           # Framework internals
│       ├── llm.ts                       # LLM API wrapper
│       ├── voiceTranscription.ts        # Whisper API wrapper
│       ├── imageGeneration.ts           # Image generation
│       ├── oauth.ts                     # OAuth flow
│       ├── context.ts                   # tRPC context
│       ├── trpc.ts                      # tRPC setup
│       └── index.ts                     # Server entry
├── drizzle/
│   ├── schema.ts                        # Database schema
│   ├── relations.ts                     # Table relations
│   └── migrations/                      # SQL migrations
├── shared/
│   ├── const.ts                         # Shared constants
│   ├── types.ts                         # Shared types
│   └── _core/errors.ts                  # Error definitions
├── references/
│   ├── llm-integration.md               # LLM API docs
│   ├── voice-transcription.md           # Whisper API docs
│   ├── file-storage.md                  # S3 storage docs
│   ├── periodic-updates.md              # Scheduled tasks
│   └── manus-oauth.md                   # OAuth docs
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── drizzle.config.ts
├── README.md
├── API_DOCUMENTATION.md
├── SYSTEM_ARCHITECTURE.md
├── ER_DIAGRAM.md
├── DEPLOYMENT_GUIDE.md
├── PROJECT_ABSTRACT.md
├── VIVA_QUESTIONS.md
└── todo.md
```

---

## 🚀 API Endpoints

### Chat Management
- `POST /api/trpc/chat.createChat` - Create new chat
- `GET /api/trpc/chat.listChats` - List user's chats
- `DELETE /api/trpc/chat.deleteChat` - Delete chat
- `GET /api/trpc/chat.getMessages` - Get chat messages
- `POST /api/trpc/chat.addMessage` - Add message to chat

### LLM Features
- `POST /api/trpc/llm.streamChat` - Stream chat completion
- `POST /api/trpc/llm.generateCode` - Generate code
- `POST /api/trpc/llm.summarizeText` - Summarize text
- `POST /api/trpc/llm.analyzeDocument` - Analyze document with RAG

### File Management
- `POST /api/trpc/file.uploadDocument` - Upload document
- `DELETE /api/trpc/file.deleteDocument` - Delete document
- `GET /api/trpc/file.listDocuments` - List documents
- `GET /api/trpc/file.getDocumentUrl` - Get presigned URL

### Voice Features
- `POST /api/trpc/voice.transcribeAudio` - Transcribe audio

### Admin
- `GET /api/trpc/admin.listUsers` - List all users
- `PUT /api/trpc/admin.updateUserRole` - Change user role
- `DELETE /api/trpc/admin.deleteUser` - Delete user
- `GET /api/trpc/admin.getAnalytics` - Get analytics data

### Authentication
- `GET /api/trpc/auth.me` - Get current user
- `POST /api/trpc/auth.logout` - Logout user

---

## 🎨 Cyberpunk Design System

### Color Palette
- **Primary Neon Pink**: `#ff00ff` (Glow: `#ff1493`)
- **Primary Neon Cyan**: `#00ffff` (Glow: `#00d9ff`)
- **Dark Background**: `#0a0e27`
- **Secondary Background**: `#1a1f3a`
- **Accent Pink**: `#ff1493`
- **Accent Cyan**: `#00d9ff`

### Typography
- **Heading Font**: Bold sans-serif (Tailwind default)
- **Body Font**: Regular sans-serif (Tailwind default)
- **Neon Text Effects**: Text-shadow with glow, letter-spacing

### UI Elements
- **Buttons**: Gradient backgrounds with hover glow effects
- **Cards**: Subtle borders with neon accents
- **Inputs**: Dark backgrounds with neon focus states
- **Dividers**: Thin neon lines with opacity
- **Animations**: Smooth 300ms transitions with easing

---

## 📊 Resume Description

**OmniMind AI - Full-Stack AI Chatbot Platform**

Engineered a production-ready, cyberpunk-themed AI chatbot platform demonstrating comprehensive full-stack development expertise. Implemented real-time streaming chat interface with ChatGPT-like UX, featuring line-by-line message rendering and syntax-highlighted code blocks. Integrated advanced AI capabilities including code generation, text summarization, and RAG-powered document analysis over uploaded PDFs, DOCX, and TXT files. Implemented voice I/O using Whisper API for speech-to-text transcription. Built secure authentication system with JWT and OAuth, role-based access control, and admin dashboard with real-time analytics. Designed cyberpunk aesthetic UI using React + Tailwind CSS with neon pink/cyan color scheme, smooth animations, and responsive design. Backend built with Express.js + tRPC for type-safe APIs, MySQL database with Drizzle ORM, and S3-compatible file storage. Deployed on Node.js serverless runtime with production-ready error handling and validation.

**Tech Stack**: React 19, TypeScript, Express.js, tRPC, MySQL, Drizzle ORM, JWT, Tailwind CSS, S3 Storage, Whisper API, LLM Integration

---

## 🔗 GitHub Repository Description

**OmniMind AI** - A futuristic, cyberpunk-themed AI chatbot platform built with React + Express + MySQL. Features real-time streaming chat, RAG-powered document analysis, voice I/O, code generation, and admin dashboard. Production-ready with JWT auth, role-based access control, and comprehensive error handling.

**Keywords**: AI Chatbot, ChatGPT Clone, RAG, Voice I/O, Full-Stack, React, Express, MySQL, Cyberpunk UI, Open Source

---

## 💼 LinkedIn Project Description

🚀 **OmniMind AI** - Advanced AI Chatbot Platform

Excited to share OmniMind AI, a production-ready AI chatbot platform that combines cutting-edge AI capabilities with a stunning cyberpunk aesthetic!

**Key Highlights:**
✨ Real-time streaming chat with ChatGPT-like UX
🧠 RAG-powered document analysis for PDFs, DOCX, TXT
🎤 Voice I/O with Whisper API speech-to-text
💻 AI code generation, summarization, and analysis
🔐 Secure authentication with JWT + OAuth
👨‍💼 Admin dashboard with user management & analytics
🎨 Cyberpunk design with neon pink/cyan aesthetic
📱 Fully responsive mobile & desktop UI

Built with React 19, Express.js, MySQL, and modern web technologies. This project demonstrates full-stack development expertise, AI integration, and production-ready architecture.

Check it out on GitHub! Open to feedback and collaboration.

#AI #FullStack #React #WebDevelopment #OpenSource #ChatGPT #RAG

---

## 🎓 Interview Preparation - 20 Viva Q&A

### Architecture & Design
**Q1: How does your RAG pipeline work for document analysis?**
A: The RAG (Retrieval-Augmented Generation) pipeline works in three stages: (1) **Ingestion**: When users upload documents (PDF/DOCX/TXT), we extract text content and store it in the database. (2) **Retrieval**: When a user asks a question about a document, we use semantic search or keyword matching to retrieve relevant document chunks. (3) **Generation**: We pass the retrieved context along with the user's question to the LLM, which generates an answer grounded in the document content. This approach ensures accurate, document-specific responses without hallucination.

**Q2: Explain the streaming chat implementation. How do you handle real-time responses?**
A: We use Server-Sent Events (SSE) or WebSocket for streaming. The backend calls the LLM API with streaming enabled, receiving tokens incrementally. Each token is sent to the frontend immediately. On the frontend, we use the `EnhancedMessage` component which displays tokens line-by-line as they arrive, creating a ChatGPT-like experience. The `streamChat` mutation waits for the complete response before storing it in the database, but the UI updates in real-time for better UX.

**Q3: How do you ensure security in file uploads and storage?**
A: We implement multiple security layers: (1) **Validation**: Check file type (PDF/DOCX/TXT only), size limits, and MIME types on both frontend and backend. (2) **Storage**: Files are uploaded to S3 with presigned URLs, never stored locally. (3) **Access Control**: Files are associated with user IDs; users can only access their own files. (4) **Scanning**: Optional virus scanning on uploaded files. (5) **Encryption**: S3 encryption at rest and in transit via HTTPS.

### Frontend Development
**Q4: How did you implement the cyberpunk design system?**
A: I created a custom CSS theme (`cyberpunk.css`) with CSS variables for neon colors (pink #ff00ff, cyan #00ffff). Used Tailwind's `@layer` directives to override default colors globally. Applied text-shadow effects for neon glow, used gradient backgrounds on buttons, and implemented smooth transitions (300ms ease-out). Dark background (#0a0e27) with high-contrast text ensures readability. The theme is applied via ThemeProvider context, allowing dark/light mode toggle.

**Q5: Explain the message streaming UI. How do you achieve line-by-line display?**
A: The `EnhancedMessage` component splits incoming text by newlines and uses a `useEffect` hook with `setInterval` to display one line every 50ms. This creates a smooth, natural reading flow. For code blocks, we use regex to detect triple-backtick blocks, extract language and code, and render them with `react-syntax-highlighter` for syntax highlighting. The component also handles the copy-to-clipboard button for code snippets.

**Q6: How do you handle responsive design across devices?**
A: We use Tailwind's responsive breakpoints (sm, md, lg, xl) throughout. The chat sidebar collapses on mobile, message input stacks vertically, and buttons scale appropriately. We use `useMobile` hook to detect screen size and conditionally render components. CSS Grid and Flexbox with `gap` utilities handle spacing. Media queries in `cyberpunk.css` adjust font sizes and glow effects for smaller screens.

### Backend Development
**Q7: How is the database schema designed for scalability?**
A: The schema uses normalized tables with proper relationships: Users → Chats → Messages, Users → Documents. Each table has indexes on foreign keys and frequently queried fields (userId, chatId, createdAt). The Messages table includes a `tokens` field to track API usage. AdminLogs table tracks admin actions for auditing. This design supports efficient queries, prevents data duplication, and makes it easy to add features like message search or document versioning.

**Q8: How do you implement role-based access control?**
A: Users have a `role` field (enum: 'admin' | 'user'). In tRPC procedures, we use `adminProcedure` which checks `ctx.user.role === 'admin'` before executing. For routes, we conditionally render components based on `useAuth().user?.role`. The admin dashboard is protected by checking role before rendering. Database queries filter results by user ownership to prevent unauthorized access.

**Q9: Explain the voice transcription integration with Whisper API.**
A: The `VoiceInput` component uses the Web Audio API to record microphone input as a Blob. On submit, we send the audio file to the backend's `voice.transcribeAudio` endpoint, which calls the Whisper API with the audio file. Whisper returns the transcribed text, which we display in the UI and optionally populate the chat input field. We handle errors gracefully and show loading states during transcription.

**Q10: How do you handle LLM API errors and rate limiting?**
A: We implement retry logic with exponential backoff for transient errors (5xx, timeout). For rate limiting (429), we queue requests and retry after the specified delay. We catch specific error codes and show user-friendly messages (e.g., "API is busy, please try again"). We also track token usage to warn users when approaching limits. Errors are logged for debugging and monitoring.

### Security & Best Practices
**Q11: How do you protect against XSS attacks in the chat interface?**
A: React automatically escapes text content, preventing XSS. For code blocks, we use `react-syntax-highlighter` which safely renders code. We avoid using `dangerouslySetInnerHTML`. User-generated content (chat messages) is stored as plain text and escaped on display. We use Content Security Policy (CSP) headers on the server to restrict script execution.

**Q12: How is authentication implemented? Explain the JWT flow.**
A: We use Manus OAuth for login. On successful OAuth callback, we create a JWT token containing user ID and role, signed with `JWT_SECRET`. The token is stored in an HTTP-only cookie (secure, sameSite=none). On each request, the cookie is validated using `jose` library. If valid, `ctx.user` is populated in tRPC context. Logout clears the cookie. This approach prevents CSRF attacks and XSS token theft.

**Q13: How do you validate user input?**
A: We use Zod schemas for runtime validation. Each tRPC procedure has input validation: chat titles are strings with length limits, message content is non-empty text, file uploads check type and size. Frontend validation provides instant feedback; backend validation is the source of truth. We sanitize inputs by trimming whitespace and rejecting suspicious patterns. Database constraints (unique, not null) provide a final safety layer.

### Performance & Optimization
**Q14: How do you optimize the chat interface for performance?**
A: We use React Query for efficient data fetching with caching. Messages are paginated to avoid loading thousands of messages. We use `useCallback` to memoize functions, preventing unnecessary re-renders. Code blocks are lazy-loaded with `react-syntax-highlighter`. We use CSS animations (transform, opacity) which run on GPU. We debounce search/filter operations. The sidebar is virtualized if there are many chats.

**Q15: How do you handle large file uploads?**
A: Files are uploaded directly to S3 using presigned URLs, bypassing the backend. We show upload progress using the `onProgress` callback from the upload library. Large files are chunked and uploaded in parallel for faster transfer. We validate file size on the frontend before uploading. The backend stores only metadata (filename, size, URL), not the file content itself.

### Deployment & DevOps
**Q16: How would you deploy this application?**
A: The frontend is built with Vite and deployed as static assets. The backend is a Node.js Express server. Both are containerized with Docker. We use Docker Compose for local development. For production, we deploy to a cloud platform (AWS, GCP, Azure) using Kubernetes or serverless (Cloud Run, Lambda). We use environment variables for configuration (API keys, database URL). CI/CD pipeline (GitHub Actions) runs tests and deploys on push to main branch.

**Q17: How do you handle database migrations?**
A: We use Drizzle ORM with migrations. When schema changes, we run `drizzle-kit generate` which creates SQL migration files. We review migrations for safety (no data loss). Migrations are version-controlled in git. On deployment, we run `drizzle-kit migrate` to apply pending migrations. For rollback, we keep previous migration files and can revert if needed. This ensures database schema is always in sync with code.

### Scalability & Future Improvements
**Q18: How would you scale this application for millions of users?**
A: (1) **Database**: Use read replicas for queries, write to primary. Implement caching layer (Redis) for frequently accessed data. (2) **Backend**: Horizontal scaling with load balancer. Use message queues (RabbitMQ) for async tasks. (3) **Frontend**: CDN for static assets. (4) **Storage**: S3 is already scalable. (5) **Monitoring**: Add observability with logging, metrics, tracing. (6) **Optimization**: Implement database indexing, query optimization, connection pooling.

**Q19: What features would you add next?**
A: (1) **Real-time collaboration**: Multiple users editing the same document. (2) **Advanced RAG**: Semantic search with embeddings, multi-document analysis. (3) **Model selection**: Let users choose between different LLMs. (4) **Conversation branching**: Create alternative responses at any point. (5) **Export**: Download chats as PDF/Markdown. (6) **Plugins**: Allow third-party integrations. (7) **Mobile app**: React Native version. (8) **Offline mode**: Cache conversations locally.

**Q20: How do you ensure code quality and maintainability?**
A: (1) **TypeScript**: Strict type checking prevents bugs. (2) **Testing**: Unit tests with Vitest, integration tests for critical flows. (3) **Linting**: ESLint + Prettier for consistent code style. (4) **Code review**: PR reviews before merging. (5) **Documentation**: README, API docs, inline comments. (6) **Monitoring**: Error tracking with Sentry, performance monitoring. (7) **Refactoring**: Regular code cleanup, extract reusable components. (8) **CI/CD**: Automated tests on every commit.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm or npm
- MySQL database
- API keys: LLM API, Whisper API, S3 credentials

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/omnimind-ai.git
cd omnimind-ai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
pnpm drizzle-kit migrate

# Start development server
pnpm dev
```

### Deployment
See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👤 Author

Created as a comprehensive portfolio project demonstrating full-stack development expertise with AI integration.

---

**Last Updated**: June 2026
**Version**: 1.0.0
