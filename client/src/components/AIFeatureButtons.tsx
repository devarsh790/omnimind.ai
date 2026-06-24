import { useState } from 'react';
import { Code2, FileText, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AIFeatureButtonsProps {
  onCodeGenerate?: (prompt: string, language: string) => void;
  onDocumentAnalysis?: (question: string) => void;
  onSummarize?: (text: string) => void;
  isLoading?: boolean;
}

export function AIFeatureButtons({
  onCodeGenerate,
  onDocumentAnalysis,
  onSummarize,
  isLoading = false,
}: AIFeatureButtonsProps) {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [codePrompt, setCodePrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [docQuestion, setDocQuestion] = useState('');
  const [textToSummarize, setTextToSummarize] = useState('');

  const handleCodeGenerate = () => {
    if (codePrompt.trim() && onCodeGenerate) {
      onCodeGenerate(codePrompt, selectedLanguage);
      setCodePrompt('');
      setActiveDialog(null);
    }
  };

  const handleDocAnalysis = () => {
    if (docQuestion.trim() && onDocumentAnalysis) {
      onDocumentAnalysis(docQuestion);
      setDocQuestion('');
      setActiveDialog(null);
    }
  };

  const handleSummarize = () => {
    if (textToSummarize.trim() && onSummarize) {
      onSummarize(textToSummarize);
      setTextToSummarize('');
      setActiveDialog(null);
    }
  };

  return (
    <>
      {/* Feature Buttons */}
      <div className="flex gap-2 flex-wrap">
        {/* Code Generation Button */}
        <Button
          onClick={() => setActiveDialog('code')}
          disabled={isLoading}
          className="group relative overflow-hidden bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 hover:from-neon-pink/30 hover:to-neon-cyan/30 border border-neon-pink/50 text-neon-pink hover:text-neon-pink transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-neon-cyan opacity-0 group-hover:opacity-10 transition-opacity" />
          <Code2 className="w-4 h-4 mr-2" />
          <span className="relative">Generate Code</span>
        </Button>

        {/* RAG Document Analysis Button */}
        <Button
          onClick={() => setActiveDialog('doc')}
          disabled={isLoading}
          className="group relative overflow-hidden bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 hover:from-neon-cyan/30 hover:to-neon-pink/30 border border-neon-cyan/50 text-neon-cyan hover:text-neon-cyan transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-pink opacity-0 group-hover:opacity-10 transition-opacity" />
          <FileText className="w-4 h-4 mr-2" />
          <span className="relative">Analyze Document</span>
        </Button>

        {/* Summarize Button */}
        <Button
          onClick={() => setActiveDialog('summarize')}
          disabled={isLoading}
          className="group relative overflow-hidden bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 hover:from-neon-pink/30 hover:to-neon-cyan/30 border border-neon-pink/50 text-neon-pink hover:text-neon-pink transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-neon-cyan opacity-0 group-hover:opacity-10 transition-opacity" />
          <Sparkles className="w-4 h-4 mr-2" />
          <span className="relative">Summarize</span>
        </Button>
      </div>

      {/* Code Generation Dialog */}
      <Dialog open={activeDialog === 'code'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="bg-[#0a0e27] border border-neon-cyan/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-neon-cyan flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Generate Code
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neon-pink mb-2">
                What code do you want to generate?
              </label>
              <Textarea
                placeholder="e.g., Create a React component for a todo list..."
                value={codePrompt}
                onChange={(e) => setCodePrompt(e.target.value)}
                className="bg-[#1a1f3a] border border-neon-cyan/30 text-foreground placeholder-foreground/50 focus:border-neon-cyan/60 focus:ring-neon-cyan/20"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neon-cyan mb-2">
                Programming Language
              </label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="bg-[#1a1f3a] border border-neon-cyan/30 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0e27] border border-neon-cyan/30">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setActiveDialog(null)}
                className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCodeGenerate}
                disabled={!codePrompt.trim() || isLoading}
                className="bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-semibold hover:shadow-lg hover:shadow-neon-pink/50"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Analysis Dialog */}
      <Dialog open={activeDialog === 'doc'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="bg-[#0a0e27] border border-neon-cyan/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-neon-cyan flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Analyze Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neon-pink mb-2">
                Ask a question about your uploaded document
              </label>
              <Textarea
                placeholder="e.g., What are the main points discussed in this document?..."
                value={docQuestion}
                onChange={(e) => setDocQuestion(e.target.value)}
                className="bg-[#1a1f3a] border border-neon-cyan/30 text-foreground placeholder-foreground/50 focus:border-neon-cyan/60 focus:ring-neon-cyan/20"
                rows={4}
              />
            </div>
            <div className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg p-3">
              <p className="text-sm text-neon-cyan">
                💡 Tip: Upload a document first in the chat to enable RAG analysis. The AI will search through your documents to answer questions.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setActiveDialog(null)}
                className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDocAnalysis}
                disabled={!docQuestion.trim() || isLoading}
                className="bg-gradient-to-r from-neon-cyan to-neon-pink text-black font-semibold hover:shadow-lg hover:shadow-neon-cyan/50"
              >
                <Zap className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Summarize Dialog */}
      <Dialog open={activeDialog === 'summarize'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="bg-[#0a0e27] border border-neon-cyan/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-neon-cyan flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Summarize Text
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neon-pink mb-2">
                Paste the text you want to summarize
              </label>
              <Textarea
                placeholder="Paste your text here..."
                value={textToSummarize}
                onChange={(e) => setTextToSummarize(e.target.value)}
                className="bg-[#1a1f3a] border border-neon-cyan/30 text-foreground placeholder-foreground/50 focus:border-neon-cyan/60 focus:ring-neon-cyan/20"
                rows={6}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setActiveDialog(null)}
                className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSummarize}
                disabled={!textToSummarize.trim() || isLoading}
                className="bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-semibold hover:shadow-lg hover:shadow-neon-pink/50"
              >
                <Zap className="w-4 h-4 mr-2" />
                Summarize
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
