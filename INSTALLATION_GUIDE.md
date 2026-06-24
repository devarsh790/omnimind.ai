# OmniMind AI - Installation & Setup Guide

## 📋 Prerequisites

Before installing OmniMind AI, ensure you have the following:

- **Node.js**: Version 18 or higher
- **pnpm**: Version 8 or higher (package manager)
- **MySQL**: Version 8 or higher
- **Git**: For version control
- **API Keys**: 
  - Manus OAuth credentials
  - LLM API key (Claude/OpenAI)
  - Whisper API key (for voice transcription)
  - S3 credentials (for file storage)

### Check Your Installation

```bash
# Check Node.js version
node --version  # Should be v18.0.0 or higher

# Check pnpm version
pnpm --version  # Should be 8.0.0 or higher

# Check MySQL version
mysql --version  # Should be 8.0.0 or higher
```

---

## 🚀 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/YOUR_USERNAME/omnimind-ai.git

# Navigate to project directory
cd omnimind-ai
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
pnpm install

# This will install both frontend and backend dependencies
```

### Step 3: Set Up Environment Variables

```bash
# Copy example environment file
cp .env.example .env.local

# Edit the environment file with your credentials
nano .env.local  # or use your preferred editor
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/omnimind

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-key-here

# OAuth (get from Manus dashboard)
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://app.manus.im

# Owner Info
OWNER_OPEN_ID=your-open-id
OWNER_NAME=Your Name

# LLM API (get from Manus)
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge
BUILT_IN_FORGE_API_KEY=your-api-key

# Frontend API
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/forge
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### Step 4: Set Up Database

```bash
# Generate database migration files
pnpm drizzle-kit generate

# Review the generated SQL file (optional)
# cat drizzle/migrations/*.sql

# Apply migrations to your database
pnpm drizzle-kit migrate

# Verify tables were created
mysql -u user -p omnimind -e "SHOW TABLES;"
```

### Step 5: Start Development Server

```bash
# Start the development server
pnpm dev

# The app will be available at http://localhost:3000
```

### Step 6: Verify Installation

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the OmniMind AI landing page
3. Click "Open Chat" to start using the application
4. Create a new chat and send a test message

---

## 🐳 Docker Installation (Optional)

If you prefer to use Docker:

```bash
# Build the Docker image
docker build -t omnimind-ai:latest .

# Run with docker-compose
docker-compose up -d

# The app will be available at http://localhost:3000
```

### Docker Compose Services

- **App**: Main application (port 3000)
- **MySQL**: Database (port 3306)
- **Redis**: Cache (port 6379)

---

## 🔧 Configuration

### Database Configuration

The database schema includes the following tables:

- **users**: User accounts and authentication
- **chats**: Chat sessions
- **messages**: Chat messages
- **documents**: Uploaded files
- **admin_logs**: Admin activity logs

### API Keys Configuration

#### Manus OAuth

1. Go to [Manus Dashboard](https://dashboard.manus.im)
2. Create a new application
3. Copy the App ID and OAuth URL
4. Add to `.env.local`

#### LLM API

1. Get API key from Manus
2. Add `BUILT_IN_FORGE_API_KEY` to `.env.local`
3. Verify with: `curl -H "Authorization: Bearer YOUR_KEY" https://api.manus.im/forge/models`

#### Whisper API

1. Whisper is included in Manus Forge API
2. Use the same API key as LLM

#### S3 Storage

1. Configure S3 credentials in `.env.local`
2. Or use Manus-provided S3 endpoint

---

## 📝 Development Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test chat.router.test.ts

# Generate coverage report
pnpm test --coverage
```

### Linting and Formatting

```bash
# Check for linting errors
pnpm run check

# Format code automatically
pnpm run format

# Type check
pnpm run check
```

### Building for Production

```bash
# Build frontend and backend
pnpm build

# Output will be in the `dist` directory
```

### Starting Production Server

```bash
# Start the production server
pnpm start

# The app will be available at http://localhost:3000
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**
- Ensure MySQL is running: `mysql -u root -p`
- Check DATABASE_URL in `.env.local`
- Verify MySQL credentials

#### 2. Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 pnpm dev
```

#### 3. Missing Dependencies

```
Error: Cannot find module 'react'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 4. API Key Issues

```
Error: Invalid API key
```

**Solution:**
- Verify API key in `.env.local`
- Check that API key has correct permissions
- Ensure API endpoint is correct

#### 5. TypeScript Errors

```
error TS2307: Cannot find module
```

**Solution:**
```bash
# Clear TypeScript cache
rm -rf .tsbuildinfo

# Rebuild
pnpm run check
```

---

## 📚 Next Steps

After installation, you can:

1. **Explore the codebase**
   - Read `README.md` for project overview
   - Check `SYSTEM_ARCHITECTURE.md` for architecture details
   - Review `API_DOCUMENTATION.md` for API reference

2. **Start developing**
   - Create a feature branch: `git checkout -b feature/my-feature`
   - Make changes and test locally
   - Submit a pull request

3. **Deploy to production**
   - See `DEPLOYMENT_GUIDE.md` for deployment instructions
   - Configure CI/CD pipeline
   - Set up monitoring and logging

4. **Contribute**
   - Read `CONTRIBUTING.md` for contribution guidelines
   - Report bugs or suggest features
   - Help improve documentation

---

## 🆘 Getting Help

If you encounter issues:

1. **Check the documentation**
   - README.md
   - API_DOCUMENTATION.md
   - DEPLOYMENT_GUIDE.md

2. **Search existing issues**
   - [GitHub Issues](https://github.com/YOUR_USERNAME/omnimind-ai/issues)

3. **Create a new issue**
   - Include error message and steps to reproduce
   - Provide your environment details
   - Attach screenshots if applicable

4. **Join the community**
   - [GitHub Discussions](https://github.com/YOUR_USERNAME/omnimind-ai/discussions)
   - Discord server (if available)

---

## ✅ Installation Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm 8+ installed
- [ ] MySQL 8+ running
- [ ] Repository cloned
- [ ] Dependencies installed with `pnpm install`
- [ ] `.env.local` configured with all required keys
- [ ] Database migrations applied with `pnpm drizzle-kit migrate`
- [ ] Development server started with `pnpm dev`
- [ ] Application accessible at `http://localhost:3000`
- [ ] Can create a new chat and send messages
- [ ] Tests passing with `pnpm test`

---

## 🎉 You're All Set!

Congratulations! You've successfully installed OmniMind AI. Start exploring the application and building amazing features!

**Happy coding! 🚀**
