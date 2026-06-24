# OmniMind AI - Production-Ready AI Chatbot

A cyberpunk-themed, full-stack AI chatbot platform with advanced features including real-time streaming chat, RAG-powered document analysis, voice I/O, code generation, and admin management.

## 🌟 Features

### Core Chat Features
- **Real-time Streaming Chat**: Experience instant AI responses with streaming chat completions
- **Chat History**: Persistent chat storage with easy retrieval
- **New Chat Creation**: Start fresh conversations anytime
- **Chat Deletion**: Remove conversations with confirmation

### AI Capabilities
- **Code Generation**: Generate code in multiple programming languages
- **Text Summarization**: Quickly summarize long texts and documents
- **Document Analysis**: AI-powered analysis of uploaded documents
- **RAG (Retrieval-Augmented Generation)**: Answer questions from uploaded documents

### File Management
- **Multi-Format Support**: Upload PDF, DOCX, and TXT files
- **Drag-and-Drop Upload**: Intuitive file upload interface
- **S3 Storage**: Secure cloud storage for all documents
- **Document Extraction**: Automatic text extraction from documents

### Voice Features
- **Speech-to-Text**: Transcribe voice input using Whisper API
- **Text-to-Speech**: Listen to AI responses (coming soon)
- **Voice Recording**: Built-in microphone recording UI

### User Management
- **OAuth Authentication**: Secure login via Manus OAuth
- **User Profiles**: View and edit user information
- **Role-Based Access**: Admin and user roles with different permissions

### Admin Dashboard
- **User Management**: View all users, assign roles, delete accounts
- **Analytics Dashboard**: Track system metrics and user activity
- **System Monitoring**: Monitor total messages, documents, and active users

### Design
- **Cyberpunk Theme**: Neon pink/cyan colors with HUD-style elements
- **Dark/Light Mode**: Full support for both themes
- **Responsive UI**: Works seamlessly on mobile and desktop
- **Modern Aesthetics**: Bold geometric fonts and minimalist design

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **tRPC** - Type-safe API client
- **Wouter** - Lightweight routing

### Backend
- **Express.js** - Web framework
- **tRPC 11** - Type-safe RPC
- **Node.js** - Runtime

### Database
- **MySQL** - Primary database
- **Drizzle ORM** - Database management

### External Services
- **Manus OAuth** - Authentication
- **Manus Storage (S3)** - File storage
- **Claude/OpenAI API** - LLM integration
- **Whisper API** - Voice transcription

### Development
- **Vite** - Build tool
- **TypeScript** - Type checking
- **Vitest** - Testing framework
- **ESBuild** - Production bundling

## 📋 Prerequisites

- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL 8.0+
- Manus account with OAuth configured

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/omnimind-ai.git
cd omnimind-ai
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/omnimind_ai

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Manus OAuth
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/oauth

# LLM API
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key

# Owner Info
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### 4. Set Up Database

```bash
# Generate migrations
pnpm drizzle-kit generate

# Run migrations
pnpm drizzle-kit migrate
```

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📦 Project Structure

```
omnimind-ai/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Chat.tsx            # Chat interface
│   │   │   ├── AdminDashboard.tsx  # Admin panel
│   │   │   ├── Profile.tsx         # User profile
│   │   │   └── NotFound.tsx        # 404 page
│   │   ├── components/             # Reusable components
│   │   │   ├── FileUploadDialog.tsx
│   │   │   ├── VoiceInput.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── contexts/               # React contexts
│   │   ├── hooks/                  # Custom hooks
│   │   ├── lib/                    # Utilities
│   │   ├── cyberpunk.css           # Cyberpunk theme
│   │   ├── index.css               # Global styles
│   │   ├── App.tsx                 # Main app component
│   │   └── main.tsx                # Entry point
│   ├── public/                     # Static assets
│   └── index.html                  # HTML template
│
├── server/                          # Backend application
│   ├── _core/                      # Core infrastructure
│   │   ├── index.ts                # Server entry point
│   │   ├── trpc.ts                 # tRPC setup
│   │   ├── context.ts              # Request context
│   │   ├── llm.ts                  # LLM integration
│   │   ├── voiceTranscription.ts   # Voice API
│   │   ├── oauth.ts                # OAuth handling
│   │   └── ...                     # Other core files
│   ├── chat.router.ts              # Chat endpoints
│   ├── llm.router.ts               # LLM endpoints
│   ├── file.router.ts              # File upload endpoints
│   ├── voice.router.ts             # Voice endpoints
│   ├── admin.router.ts             # Admin endpoints
│   ├── routers.ts                  # Main router
│   ├── db.ts                       # Database helpers
│   └── storage.ts                  # Storage helpers
│
├── drizzle/                         # Database schema
│   ├── schema.ts                   # Table definitions
│   ├── relations.ts                # Table relations
│   └── migrations/                 # Migration files
│
├── shared/                          # Shared types and constants
│   ├── const.ts                    # Constants
│   └── types.ts                    # TypeScript types
│
├── references/                      # Integration guides
│   ├── llm-integration.md
│   ├── voice-transcription.md
│   ├── file-storage.md
│   └── ...
│
├── API_DOCUMENTATION.md            # API reference
├── ER_DIAGRAM.md                   # Database schema diagram
├── SYSTEM_ARCHITECTURE.md          # Architecture overview
├── DEPLOYMENT_GUIDE.md             # Deployment instructions
├── VIVA_QUESTIONS.md               # Interview Q&A
├── PROJECT_ABSTRACT.md             # Project summary
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── README.md                       # This file
```

## 🔧 Development

### Running Tests

```bash
pnpm test
```

### Type Checking

```bash
pnpm check
```

### Formatting Code

```bash
pnpm format
```

### Building for Production

```bash
pnpm build
```

### Starting Production Server

```bash
pnpm start
```

## 📚 API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Example API Calls

#### Create a Chat
```typescript
const chat = await trpc.chat.createChat.mutate({
  title: 'My Chat'
});
```

#### Send a Message
```typescript
const response = await trpc.llm.streamChat.mutate({
  chatId: chat.id,
  message: 'Hello AI'
});
```

#### Upload a Document
```typescript
const document = await trpc.file.uploadDocument.mutate({
  chatId: chat.id,
  filename: 'document.pdf',
  fileType: 'application/pdf',
  fileSize: 102400,
  fileData: base64EncodedData
});
```

#### Transcribe Audio
```typescript
const result = await trpc.voice.transcribeAudio.mutate({
  audioData: base64EncodedAudio,
  audioFormat: 'webm',
  language: 'en'
});
```

## 🗄️ Database Schema

See [ER_DIAGRAM.md](./ER_DIAGRAM.md) for complete database schema and relationships.

### Key Tables
- **users** - User accounts and authentication
- **chats** - Chat sessions
- **messages** - Chat messages
- **documents** - Uploaded files for RAG
- **admin_logs** - Admin action audit trail

## 🏗️ System Architecture

See [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) for detailed architecture diagrams and component descriptions.

## 🚢 Deployment

### Deploying to Manus

1. Create a checkpoint in the Manus UI
2. Click the "Publish" button
3. Configure custom domain (optional)
4. System will deploy automatically

### Environment Variables for Production

Set these in the Manus Settings → Secrets panel:
- `DATABASE_URL` - Production MySQL connection
- `JWT_SECRET` - Secure random string
- `BUILT_IN_FORGE_API_KEY` - LLM API key
- All other environment variables from `.env.local`

### Database Migrations in Production

Migrations are applied automatically during deployment. For manual migration:

```bash
pnpm drizzle-kit migrate
```

## 🔐 Security

### Authentication
- OAuth 2.0 via Manus
- HTTP-only cookies for session management
- CSRF protection

### Authorization
- Role-based access control (RBAC)
- Protected procedures for admin-only operations
- User data isolation

### Data Protection
- Encrypted file storage in S3
- HTTPS for all communications
- SQL injection prevention via ORM

## 📊 Analytics

The admin dashboard provides real-time analytics:
- Total users count
- Total messages sent
- Total documents uploaded
- Active users (last 30 days)

## 🎨 Customization

### Changing the Theme

Edit `client/src/cyberpunk.css` to modify:
- Neon colors (pink, cyan)
- Font sizes and weights
- Border styles
- Shadow effects

### Adding New Features

1. Update database schema in `drizzle/schema.ts`
2. Generate migration: `pnpm drizzle-kit generate`
3. Create new router in `server/`
4. Add routes to `server/routers.ts`
5. Create UI components in `client/src/pages/` or `client/src/components/`
6. Wire components to tRPC hooks

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL format
mysql://user:password@host:3306/database

# Test connection
mysql -u user -p -h host database
```

### OAuth Not Working
- Verify `VITE_APP_ID` is correct
- Check OAuth redirect URL in Manus dashboard
- Clear browser cookies and try again

### LLM API Errors
- Verify `BUILT_IN_FORGE_API_KEY` is valid
- Check API rate limits
- Review logs in `.manus-logs/devserver.log`

### File Upload Issues
- Check file size (max 10MB)
- Verify file type (PDF, DOCX, TXT)
- Ensure S3 storage is configured

## 📖 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [ER Diagram](./ER_DIAGRAM.md) - Database schema
- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Architecture overview
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment
- [Viva Questions](./VIVA_QUESTIONS.md) - Interview preparation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💼 Author

Created as a production-ready AI chatbot for final-year Computer Engineering students and professionals.

## 🙏 Acknowledgments

- Manus team for hosting and OAuth infrastructure
- Claude/OpenAI for LLM capabilities
- Whisper API for voice transcription
- shadcn/ui for component library
- Tailwind CSS for styling framework

## 📞 Support

For support, please contact:
- Email: support@omnimind.ai
- Documentation: https://omnimind.ai/docs
- GitHub Issues: https://github.com/yourusername/omnimind-ai/issues

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Core chat functionality
- RAG document analysis
- Voice I/O
- Admin dashboard
- Cyberpunk theme

---

**Made with ❤️ for AI enthusiasts and developers**
