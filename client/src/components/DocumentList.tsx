import { useState } from 'react';
import { FileText, Trash2, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface Document {
  id: number;
  filename: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: Date;
}

interface DocumentListProps {
  documents: Document[];
  onDocumentSelect?: (document: Document) => void;
  onDocumentDelete?: (documentId: number) => void;
}

export function DocumentList({
  documents,
  onDocumentSelect,
  onDocumentDelete,
}: DocumentListProps) {
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deleteDocMutation = trpc.file.deleteDocument.useMutation({
    onSuccess: () => {
      toast.success('Document deleted');
      setDeletingId(null);
      onDocumentDelete?.(deletingId!);
    },
    onError: () => {
      toast.error('Failed to delete document');
      setDeletingId(null);
    },
  });

  const handleDelete = (docId: number) => {
    setDeletingId(docId);
    deleteDocMutation.mutate({ documentId: docId });
  };

  const handleDownload = (doc: Document) => {
    // Open the file URL directly
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      toast.error('File URL not available');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('text')) return '📋';
    return '📎';
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/50">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className={`p-3 cursor-pointer transition-all border ${
            selectedDocId === doc.id
              ? 'bg-neon-cyan/10 border-neon-cyan/50'
              : 'bg-[#1a1f3a] border-neon-cyan/20 hover:border-neon-cyan/50'
          }`}
          onClick={() => {
            setSelectedDocId(doc.id);
            onDocumentSelect?.(doc);
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{getFileIcon(doc.fileType)}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate text-sm">{doc.filename}</p>
              <div className="flex items-center gap-2 text-xs text-foreground/50 mt-1">
                <span>{formatFileSize(doc.fileSize)}</span>
                <span>•</span>
                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(doc);
                }}
                disabled={false}
                className="h-7 w-7 p-0 text-neon-cyan hover:bg-neon-cyan/10"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(doc.id);
                }}
                disabled={deletingId === doc.id}
                className="h-7 w-7 p-0 text-neon-pink hover:bg-neon-pink/10"
              >
                {deletingId === doc.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
