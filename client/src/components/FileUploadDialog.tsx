import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatId?: number;
  onSuccess?: (document: any) => void;
}

export function FileUploadDialog({ open, onOpenChange, chatId, onSuccess }: FileUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.file.uploadDocument.useMutation({
    onSuccess: (document) => {
      toast.success("File uploaded successfully");
      setSelectedFile(null);
      onOpenChange(false);
      onSuccess?.(document);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload file");
    },
  });

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, DOCX, and TXT files are supported");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      uploadMutation.mutate({
        chatId,
        filename: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        fileData: base64,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-[#1a1f3a] dark:border-[#00ffff]/30">
        <DialogHeader>
          <DialogTitle className="neon-text-pink">Upload Document</DialogTitle>
          <DialogDescription className="dark:text-[#00ffff]/60">
            Upload PDF, DOCX, or TXT files for AI analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-[#ff00ff] bg-[#ff00ff]/10"
                : "border-[#00ffff]/30 hover:border-[#00ffff]/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <Upload className="w-12 h-12 mx-auto mb-3 text-[#00ffff]" />
            <p className="text-sm font-medium neon-text mb-1">Drop your file here or click to browse</p>
            <p className="text-xs text-muted-foreground dark:text-[#00ffff]/60">PDF, DOCX, or TXT • Max 10MB</p>
          </div>

          {/* Selected File */}
          {selectedFile && (
            <div className="bg-muted dark:bg-[#0a0e27] p-4 rounded border border-[#00ffff]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#ff00ff]" />
                <div>
                  <p className="text-sm font-medium text-foreground dark:text-[#00ffff]">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground dark:text-[#00ffff]/60">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelectedFile(null)}
                className="dark:text-[#ff00ff] dark:hover:bg-[#ff00ff]/10"
              >
                <X size={18} />
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              className="flex-1 bg-accent dark:bg-[#ff00ff] text-white hover:bg-accent/90 dark:hover:bg-[#ff00ff]/90"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 dark:border-[#00ffff]/30 dark:text-[#00ffff] dark:hover:bg-[#00ffff]/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
