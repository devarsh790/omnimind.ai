import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentList } from './DocumentList';

interface Chat {
  id: number;
  title: string;
  createdAt: Date;
}

interface Document {
  id: number;
  filename: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: Date;
}

interface ChatSidebarProps {
  chats: Chat[];
  documents: Document[];
  currentChatId: number | null;
  onChatSelect: (chatId: number) => void;
  onNewChat: () => void;
  onDocumentSelect?: (document: Document) => void;
  onDocumentDelete?: (documentId: number) => void;
}

export function ChatSidebar({
  chats,
  documents,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDocumentSelect,
  onDocumentDelete,
}: ChatSidebarProps) {
  const [showDocuments, setShowDocuments] = useState(true);

  return (
    <div className="w-64 bg-[#0a0e27] border-r border-neon-cyan/20 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neon-cyan/20">
        <h1 className="text-lg font-bold text-neon-cyan mb-4 flex items-center gap-2">
          <span className="text-neon-pink">⚡</span> OmniMind AI
        </h1>
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-semibold hover:shadow-lg hover:shadow-neon-pink/50"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chats Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-neon-cyan/70 uppercase tracking-wider mb-2">
            Chats
          </h2>
          <div className="space-y-2">
            {chats.length === 0 ? (
              <p className="text-xs text-foreground/50 py-2">No chats yet</p>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
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
              ))
            )}
          </div>
        </div>

        {/* Documents Section */}
        <div className="border-t border-neon-cyan/20 pt-4">
          <button
            onClick={() => setShowDocuments(!showDocuments)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-neon-cyan/70 uppercase tracking-wider hover:text-neon-cyan transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Documents
            </span>
            {showDocuments ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {showDocuments && (
            <div className="mt-2">
              <DocumentList
                documents={documents}
                onDocumentSelect={onDocumentSelect}
                onDocumentDelete={onDocumentDelete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
