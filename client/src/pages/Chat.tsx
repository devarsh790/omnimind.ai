import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Plus, Trash2, Send, Paperclip, User } from "lucide-react";
import { toast } from "sonner";
import { FileUploadDialog } from "@/components/FileUploadDialog";
import { VoiceInput } from "@/components/VoiceInput";

export default function Chat() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chats
  const { data: chatsList } = trpc.chat.listChats.useQuery(undefined, {
    enabled: !!user,
  });

  // Fetch messages for current chat
  const { data: chatMessages } = trpc.chat.getMessages.useQuery(
    { chatId: currentChatId! },
    { enabled: !!currentChatId }
  );

  // Create chat mutation
  const createChatMutation = trpc.chat.createChat.useMutation({
    onSuccess: (chat) => {
      setChats([chat, ...chats]);
      setCurrentChatId(chat.id);
      toast.success("New chat created");
    },
    onError: () => toast.error("Failed to create chat"),
  });

  // Delete chat mutation
  const deleteChatMutation = trpc.chat.deleteChat.useMutation({
    onSuccess: () => {
      setChats(chats.filter(c => c.id !== currentChatId));
      setCurrentChatId(null);
      setMessages([]);
      toast.success("Chat deleted");
    },
    onError: () => toast.error("Failed to delete chat"),
  });

  // Send message mutation
  const sendMessageMutation = trpc.llm.streamChat.useMutation({
    onSuccess: (response) => {
      if (response.content) {
        setMessages([...messages, { role: "assistant", content: response.content }]);
      }
      setIsLoading(false);
    },
    onError: () => {
      toast.error("Failed to send message");
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (chatsList) {
      setChats(chatsList);
      if (chatsList.length > 0 && !currentChatId) {
        setCurrentChatId(chatsList[0].id);
      }
    }
  }, [chatsList]);

  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCreateChat = () => {
    createChatMutation.mutate({
      title: `Chat ${new Date().toLocaleTimeString()}`,
    });
  };

  const handleDeleteChat = () => {
    if (currentChatId) {
      deleteChatMutation.mutate({ chatId: currentChatId });
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentChatId || isLoading) return;

    const userMessage = { role: "user", content: inputValue };
    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    sendMessageMutation.mutate({
      chatId: currentChatId,
      message: inputValue,
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen neon-text">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background dark:bg-[#0a0e27] grid-bg">
      {/* Sidebar */}
      <div className="w-64 border-r border-border dark:border-[#00ffff]/20 bg-card dark:bg-[#050812] flex flex-col">
        <div className="p-4 border-b border-border dark:border-[#00ffff]/20 space-y-2">
          <Button
            onClick={handleCreateChat}
            className="w-full bg-accent dark:bg-[#ff00ff] text-white hover:bg-accent/90 dark:hover:bg-[#ff00ff]/90 flex items-center gap-2"
          >
            <Plus size={18} />
            New Chat
          </Button>
          <Button
            onClick={() => navigate("/profile")}
            variant="outline"
            className="w-full dark:border-[#00ffff]/30 dark:text-[#00ffff] dark:hover:bg-[#00ffff]/10 flex items-center gap-2"
          >
            <User size={18} />
            Profile
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              className={`p-3 cursor-pointer border-l-2 transition-all ${
                currentChatId === chat.id
                  ? "border-l-[#ff00ff] bg-[#ff00ff]/10 dark:bg-[#ff00ff]/10"
                  : "border-l-transparent hover:bg-muted dark:hover:bg-[#1a1f3a]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground dark:text-[#00ffff]">
                    {chat.title}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-[#00ffff]/60">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {currentChatId === chat.id && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat();
                    }}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChatId ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle size={48} className="mx-auto mb-4 text-muted-foreground dark:text-[#00ffff]/50" />
                    <p className="text-muted-foreground dark:text-[#00ffff]/60">Start a conversation</p>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <Card
                    className={`max-w-md p-4 ${
                      msg.role === "user"
                        ? "bg-accent dark:bg-[#ff00ff] text-white dark:text-white"
                        : "bg-muted dark:bg-[#1a1f3a] text-foreground dark:text-[#00ffff] border-[#00ffff]/30"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </Card>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <Card className="bg-muted dark:bg-[#1a1f3a] p-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-accent dark:bg-[#00ffff] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-accent dark:bg-[#00ffff] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-accent dark:bg-[#00ffff] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </Card>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border dark:border-[#00ffff]/20 p-4 bg-card dark:bg-[#050812]">
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setUploadDialogOpen(true)}
                  className="dark:border-[#00ffff]/30 dark:text-[#00ffff] dark:hover:bg-[#00ffff]/10"
                >
                  <Paperclip size={18} />
                </Button>
                <VoiceInput
                  onTranscript={(transcript) => setInputValue(transcript)}
                  disabled={isLoading}
                />
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="dark:bg-[#1a1f3a] dark:border-[#00ffff]/30 dark:text-[#00ffff] dark:placeholder-[#00ffff]/50"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-accent dark:bg-[#ff00ff] text-white hover:bg-accent/90 dark:hover:bg-[#ff00ff]/90"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>

            {/* File Upload Dialog */}
            <FileUploadDialog
              open={uploadDialogOpen}
              onOpenChange={setUploadDialogOpen}
              chatId={currentChatId || undefined}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle size={64} className="mx-auto mb-4 text-muted-foreground dark:text-[#00ffff]/50" />
              <p className="text-lg text-muted-foreground dark:text-[#00ffff]/60">No chat selected</p>
              <Button onClick={handleCreateChat} className="mt-4 bg-accent dark:bg-[#ff00ff]">
                Create New Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
