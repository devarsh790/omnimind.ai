import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { EnhancedMessage } from '@/components/EnhancedMessage';
import { AIFeatureButtons } from '@/components/AIFeatureButtons';
import { FileUploadDialog } from '@/components/FileUploadDialog';
import { VoiceInput } from '@/components/VoiceInput';
import { Loader2, Trash2, Plus, Send, Mic, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface Chat {
  id: number;
  title: string;
  createdAt: Date;
}

export default function ChatEnhanced() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // tRPC hooks
  const listChatsQuery = trpc.chat.listChats.useQuery();
  const createChatMutation = trpc.chat.createChat.useMutation();
  const getMessagesQuery = trpc.chat.getMessages.useQuery(
    { chatId: currentChatId || 0 },
    { enabled: !!currentChatId }
  );
  const addMessageMutation = trpc.chat.addMessage.useMutation();
  const streamChatMutation = trpc.llm.streamChat.useMutation();
  const generateCodeMutation = trpc.llm.generateCode.useMutation();
  const analyzeDocMutation = trpc.llm.analyzeDocument.useMutation();
  const summarizeMutation = trpc.llm.summarizeText.useMutation();

  // Load chats
  useEffect(() => {
    if (listChatsQuery.data) {
      setChats(listChatsQuery.data);
      if (listChatsQuery.data.length > 0 && !currentChatId) {
        setCurrentChatId(listChatsQuery.data[0].id);
      }
    }
  }, [listChatsQuery.data]);

  // Load messages for current chat
  useEffect(() => {
    if (getMessagesQuery.data) {
      setMessages(getMessagesQuery.data);
      scrollToBottom();
    }
  }, [getMessagesQuery.data]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Create new chat
  const handleNewChat = async () => {
    try {
      const newChat = await createChatMutation.mutateAsync({
        title: `Chat ${new Date().toLocaleTimeString()}`,
      });
      setChats([newChat, ...chats]);
      setCurrentChatId(newChat.id);
      setMessages([]);
    } catch (error) {
      toast.error('Failed to create chat');
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentChatId || isLoading) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    try {
      // Add user message
      const savedMessage = await addMessageMutation.mutateAsync({
        chatId: currentChatId,
        role: 'user',
        content: userMessage,
        tokens: Math.ceil(userMessage.length / 4),
      });

      setMessages([...messages, savedMessage]);

      // Stream AI response
      setIsStreaming(true);
      const response = await streamChatMutation.mutateAsync({
        chatId: currentChatId,
        message: userMessage,
      });

      // Add assistant message
      const assistantMessage = await addMessageMutation.mutateAsync({
        chatId: currentChatId,
        role: 'assistant',
        content: response.content,
        tokens: Math.ceil(response.content.length / 4),
      });

      setMessages((prev) => [...prev, assistantMessage]);
      setIsStreaming(false);
    } catch (error) {
      toast.error('Failed to send message');
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice input
  const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
  };

  // Handle code generation
  const handleCodeGenerate = async (prompt: string, language: string) => {
    if (!currentChatId) {
      toast.error('Please create a chat first');
      return;
    }

    try {
      setIsLoading(true);
      const response = await generateCodeMutation.mutateAsync({
        chatId: currentChatId,
        prompt,
        language,
      });

      const message = await addMessageMutation.mutateAsync({
        chatId: currentChatId,
        role: 'assistant',
        content: `\`\`\`${language}\n${response.code}\n\`\`\``,
        tokens: Math.ceil(response.code.length / 4),
      });

      setMessages((prev) => [...prev, message]);
      toast.success('Code generated successfully');
    } catch (error) {
      toast.error('Failed to generate code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle document analysis
  const handleDocAnalysis = async (question: string) => {
    if (!currentChatId) {
      toast.error('Please create a chat first');
      return;
    }

    try {
      setIsLoading(true);
      const response = await analyzeDocMutation.mutateAsync({
        chatId: currentChatId,
        documentId: 1, // Would need to get actual document ID
        question,
      });

      const message = await addMessageMutation.mutateAsync({
        chatId: currentChatId,
        role: 'assistant',
        content: response.analysis,
        tokens: Math.ceil(response.analysis.length / 4),
      });

      setMessages((prev) => [...prev, message]);
      toast.success('Document analyzed successfully');
    } catch (error) {
      toast.error('Failed to analyze document');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle text summarization
  const handleSummarize = async (text: string) => {
    if (!currentChatId) {
      toast.error('Please create a chat first');
      return;
    }

    try {
      setIsLoading(true);
      const response = await summarizeMutation.mutateAsync({
        chatId: currentChatId,
        text,
      });

      const message = await addMessageMutation.mutateAsync({
        chatId: currentChatId,
        role: 'assistant',
        content: response.summary,
        tokens: Math.ceil(response.summary.length / 4),
      });

      setMessages((prev) => [...prev, message]);
      toast.success('Text summarized successfully');
    } catch (error) {
      toast.error('Failed to summarize text');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a0e27] border-r border-neon-cyan/20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-neon-cyan/20">
          <h1 className="text-lg font-bold text-neon-cyan mb-4 flex items-center gap-2">
            <span className="text-neon-pink">⚡</span> OmniMind AI
          </h1>
          <Button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-semibold hover:shadow-lg hover:shadow-neon-pink/50"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                currentChatId === chat.id
                  ? 'bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan'
                  : 'hover:bg-neon-cyan/10 border border-transparent text-foreground/70 hover:text-foreground'
              }`}
            >
              <p className="text-sm truncate">{chat.title}</p>
              <p className="text-xs text-foreground/50 mt-1">
                {new Date(chat.createdAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-4">✨</div>
                <h2 className="text-2xl font-bold text-neon-cyan mb-2">Welcome to OmniMind AI</h2>
                <p className="text-foreground/60 max-w-md">
                  Start a conversation, generate code, analyze documents, or summarize text. Use the feature buttons below to get started!
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <EnhancedMessage
              key={message.id}
              role={message.role}
              content={message.content}
              isStreaming={isStreaming && message.role === 'assistant'}
            />
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50">
                AI
              </div>
              <div className="flex items-center gap-2 text-neon-cyan">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* AI Feature Buttons */}
        <div className="px-6 py-4 border-t border-neon-cyan/20">
          <AIFeatureButtons
            onCodeGenerate={handleCodeGenerate}
            onDocumentAnalysis={handleDocAnalysis}
            onSummarize={handleSummarize}
            isLoading={isLoading}
          />
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-neon-cyan/20 bg-[#0a0e27]">
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading || !currentChatId}
                className="flex-1 bg-[#1a1f3a] border border-neon-cyan/30 text-foreground placeholder-foreground/50 focus:border-neon-cyan/60 focus:ring-neon-cyan/20"
              />
              <VoiceInput onTranscript={handleVoiceInput} disabled={isLoading} />
              <Button
                onClick={() => setIsUploadOpen(true)}
                disabled={isLoading || !currentChatId}
                variant="outline"
                className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
              >
                <Upload className="w-4 h-4" />
              </Button>
              <FileUploadDialog
                open={isUploadOpen}
                onOpenChange={setIsUploadOpen}
                chatId={currentChatId || 0}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim() || !currentChatId}
                className="bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-semibold hover:shadow-lg hover:shadow-neon-pink/50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-foreground/50">
              💡 Tip: Use the feature buttons above to generate code, analyze documents, or summarize text
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
