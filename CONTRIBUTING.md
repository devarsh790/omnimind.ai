# Contributing to OmniMind AI

Thank you for your interest in contributing to OmniMind AI! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Report issues professionally

## 🐛 Reporting Bugs

### Before Submitting a Bug Report

- Check if the bug has already been reported in [Issues](https://github.com/YOUR_USERNAME/omnimind-ai/issues)
- Try to reproduce the bug with the latest code
- Collect relevant information (OS, browser, Node version, etc.)

### How to Submit a Good Bug Report

1. **Use a clear, descriptive title**
   ```
   [BUG] Chat messages not displaying with syntax highlighting
   ```

2. **Describe the exact steps to reproduce**
   ```
   1. Upload a Python file
   2. Ask the AI to explain the code
   3. Notice that syntax highlighting is missing
   ```

3. **Describe the observed behavior**
   ```
   Code blocks display as plain text without colors
   ```

4. **Describe the expected behavior**
   ```
   Code blocks should display with Python syntax highlighting
   ```

5. **Include screenshots or GIFs**
   - Use tools like Gyazo or Loom to capture the issue

6. **Include your environment**
   ```
   - OS: macOS 13.1
   - Browser: Chrome 120
   - Node: 18.14.0
   - pnpm: 8.0.0
   ```

## 💡 Suggesting Enhancements

### Before Submitting an Enhancement Suggestion

- Check if the enhancement has already been suggested
- Provide a clear use case and rationale

### How to Submit a Good Enhancement Suggestion

1. **Use a clear, descriptive title**
   ```
   [FEATURE] Add markdown preview for chat messages
   ```

2. **Provide a detailed description**
   ```
   Currently, markdown formatting in chat messages is not rendered.
   Users should be able to see formatted text, links, and lists.
   ```

3. **Provide examples**
   ```
   Example input: "# Heading\n- List item"
   Expected output: Rendered HTML with styling
   ```

4. **Explain the benefit**
   ```
   This would improve readability and user experience significantly.
   ```

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- MySQL 8+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/omnimind-ai.git
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

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test chat.router.test.ts
```

### Linting and Formatting

```bash
# Check for linting errors
pnpm run check

# Format code
pnpm run format

# Type check
pnpm run check
```

## 📝 Making Changes

### Branch Naming Convention

```
feature/add-markdown-preview
fix/chat-message-streaming-bug
docs/update-api-documentation
refactor/extract-message-component
test/add-chat-router-tests
```

### Commit Message Convention

```
feat: Add markdown preview for chat messages
fix: Resolve chat message streaming delay
docs: Update API documentation
refactor: Extract EnhancedMessage component
test: Add unit tests for chat router
chore: Update dependencies
```

### Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Example Commit

```bash
git add .
git commit -m "feat: Add markdown preview for chat messages

- Implement markdown parser using remark
- Add preview toggle button in message display
- Update EnhancedMessage component
- Add unit tests for markdown rendering
- Update API documentation

Fixes #123"
```

## 🔄 Pull Request Process

### Before Submitting a PR

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests for new features
   - Update documentation

3. **Test your changes**
   ```bash
   pnpm test
   pnpm run check
   pnpm run format
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Related Issue
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested this change:
- [ ] Unit tests added
- [ ] Manual testing completed
- [ ] Tested on mobile
- [ ] Tested on different browsers

## Screenshots
Add screenshots if UI changes:
- Before: [screenshot]
- After: [screenshot]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings generated
```

### PR Review Process

1. **Automated checks**
   - CI/CD pipeline runs tests
   - Linting checks pass
   - Build succeeds

2. **Code review**
   - Maintainers review code quality
   - Functionality is verified
   - Documentation is checked

3. **Approval and merge**
   - PR is approved by maintainers
   - Branch is merged to main
   - Feature branch is deleted

## 📚 Documentation

### Updating Documentation

1. **README.md** - Project overview and setup
2. **API_DOCUMENTATION.md** - API endpoints and usage
3. **SYSTEM_ARCHITECTURE.md** - Architecture diagrams
4. **DEPLOYMENT_GUIDE.md** - Deployment instructions
5. **Inline comments** - Complex code logic

### Documentation Style

```markdown
# Section Title

Brief introduction to the section.

## Subsection

Detailed explanation with examples.

### Code Example

\`\`\`typescript
// Example code
const example = () => {
  return 'Hello, World!';
};
\`\`\`

**Important**: Note any important information.

> Quote important concepts or warnings.
```

## 🎯 Areas for Contribution

### High Priority
- [ ] Real-time token streaming for chat responses
- [ ] Document preview and analysis UI
- [ ] Text-to-speech API integration
- [ ] Performance optimization
- [ ] Mobile app (React Native)

### Medium Priority
- [ ] Advanced RAG with embeddings
- [ ] Model selection UI
- [ ] Conversation branching
- [ ] Export to PDF/Markdown
- [ ] Plugin system

### Low Priority
- [ ] UI/UX improvements
- [ ] Animation enhancements
- [ ] Accessibility improvements
- [ ] Internationalization (i18n)
- [ ] Dark mode refinements

## 🚀 Deployment

### Staging Deployment

```bash
# Deploy to staging environment
git push origin feature/your-feature:staging

# Staging URL: https://staging.omnimindai.com
```

### Production Deployment

```bash
# Merge to main (automatic deployment)
git push origin feature/your-feature:main

# Production URL: https://omnimindai.com
```

## 📞 Getting Help

- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/omnimind-ai/discussions)
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/omnimind-ai/issues)
- **Email**: your-email@example.com
- **Discord**: [Join our Discord](https://discord.gg/omnimind)

## 📄 License

By contributing to OmniMind AI, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for contributing to OmniMind AI! Your efforts help make this project better for everyone.

---

**Happy coding! 🚀**
