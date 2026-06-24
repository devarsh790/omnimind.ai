import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { EnhancedMessage } from '@/components/EnhancedMessage';
import { AIFeatureButtons } from '@/components/AIFeatureButtons';
import { FileUploadDialog } from '@/components/FileUploadDialog';
import { VoiceInput } from '@/components/VoiceInput';
import { DocumentList } from '@/components/DocumentList';
import { Loader2, Trash2, Plus, Send, Mic, Upload, Menu, X, Home, Settings, LogOut, Zap, FileText } from 'lucide-react';
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

export default function ChatPremium() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDocuments, setShowDocuments] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // tRPC hooks
  const listChatsQuery = trpc.chat.listChats.useQuery();
  const createChatMutation = trpc.chat.createChat.useMutation();
  const deleteChatMutation = trpc.chat.deleteChat.useMutation();
  const getMessagesQuery = trpc.chat.getMessages.useQuery(
    { chatId: currentChatId || 0 },
    { enabled: !!currentChatId }
  );
  const addMessageMutation = trpc.chat.addMessage.useMutation();
  const streamChatMutation = trpc.llm.streamChat.useMutation();

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

  useEffect(() => {
    scrollToBottom();
  }, [isStreaming]);

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
      setShowDocuments(false);
      toast.success('New chat created');
    } catch (error) {
      toast.error('Failed to create chat');
    }
  };

  // Delete chat
  const handleDeleteChat = async (chatId: number) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;

    try {
      await deleteChatMutation.mutateAsync({ chatId });
      setChats(chats.filter((c) => c.id !== chatId));
      if (currentChatId === chatId) {
        const remaining = chats.filter((c) => c.id !== chatId);
        setCurrentChatId(remaining.length > 0 ? remaining[0].id : null);
        setMessages([]);
      }
      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentChatId || isLoading) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);

    try {
      // Add user message
      const savedMessage = await addMessageMutation.mutateAsync({
        chatId: currentChatId,
        role: 'user',
        content: userMessage,
      });

      setMessages([...messages, savedMessage]);

      // Get AI response
      const response = await streamChatMutation.mutateAsync({
        chatId: currentChatId,
        message: userMessage,
      });

      if (response.content) {
        const assistantMessage = await addMessageMutation.mutateAsync({
          chatId: currentChatId,
          role: 'assistant',
          content: response.content,
        });
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#ff00ff]" />
          <p className="text-muted-foreground dark:text-[#00ffff]/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background dark:bg-[#0a0e27] flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-card dark:bg-[#050812]/80 border-r border-[#00ffff]/20 backdrop-blur transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#00ffff]/20">
          <Button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-[#ff00ff] to-[#ff1493] text-white hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground dark:text-[#00ffff]/60">No chats yet</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setCurrentChatId(chat.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all group ${
                  currentChatId === chat.id
                    ? 'bg-gradient-to-r from-[#ff00ff]/20 to-[#00ffff]/20 border border-[#ff00ff]/50'
                    : 'hover:bg-[#00ffff]/10 border border-[#00ffff]/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground dark:text-white truncate">
                    {chat.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-[#ff00ff]" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[#00ffff]/20 p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-[#00ffff] hover:bg-[#00ffff]/10"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[#00ffff] hover:bg-[#00ffff]/10"
            onClick={() => navigate('/profile')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Profile
          </Button>
          {user.role === 'admin' && (
            <Button
              variant="ghost"
              className="w-full justify-start text-[#ff00ff] hover:bg-[#ff00ff]/10"
              onClick={() => navigate('/admin')}
            >
              <Zap className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-[#ff00ff] hover:bg-[#ff00ff]/10"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#00ffff]/20 bg-card/50 dark:bg-[#050812]/50 backdrop-blur p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#00ffff] hover:bg-[#00ffff]/10"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground dark:text-white">
                {currentChatId && chats.find((c) => c.id === currentChatId)?.title}
              </h1>
              <p className="text-xs text-muted-foreground dark:text-[#00ffff]/60">
                Chat with OmniMind AI
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDocuments(!showDocuments)}
            className="text-[#00ffff] hover:bg-[#00ffff]/10"
            title="Toggle documents"
          >
            <FileText className="w-5 h-5" />
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex gap-4 overflow-hidden p-4">
          {/* Messages */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="w-16 h-16 text-[#ff00ff]/30 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-2">
                      Start a Conversation
                    </h2>
                    <p className="text-muted-foreground dark:text-[#00ffff]/60 max-w-md">
                      Ask me anything! I can help with code generation, document analysis, text summarization, and more.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <EnhancedMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      isStreaming={isStreaming && message === messages[messages.length - 1] && message.role === 'assistant'}
                    />
                  ))}
                  {isStreaming && (
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-bounce delay-200" />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* AI Feature Buttons */}
            {currentChatId && <AIFeatureButtons />}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message... or use voice input"
                  disabled={isLoading}
                  className="flex-1 bg-card dark:bg-[#1a1f3a] border-[#00ffff]/30 dark:border-[#00ffff]/30 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#00ffff]/50 focus:border-[#ff00ff] dark:focus:border-[#ff00ff]"
                />

                <VoiceInput
                  onTranscript={(text: string) => setInput((prev) => prev + ' ' + text)}
                  disabled={isLoading}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsUploadOpen(true)}
                  disabled={isLoading}
                  className="border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/10"
                  title="Upload document"
                >
                  <Upload className="w-4 h-4" />
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-[#ff00ff] to-[#ff1493] text-white hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Documents Panel */}
          {showDocuments && currentChatId && (
            <div className="w-64 border-l border-[#00ffff]/20 bg-card/50 dark:bg-[#1a1f3a]/50 backdrop-blur p-4 overflow-y-auto">
              <div className="mb-4">
                <h3 className="font-bold text-foreground dark:text-white mb-2">Documents</h3>
                <Button
                  onClick={() => setIsUploadOpen(true)}
                  variant="outline"
                  className="w-full border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              {/* Document list would go here */}
            </div>
          )}
        </div>
      </div>

      {/* File Upload Dialog */}
      <FileUploadDialog
        open={isUploadOpen}
        onOpenChange={() => setIsUploadOpen(false)}
        chatId={currentChatId || 0}
      />
    </div>
  );
}
