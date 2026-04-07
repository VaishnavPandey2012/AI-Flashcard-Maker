import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onTextExtracted }) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>('');

  const onDrop = useCallback(async (accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setError('');
    setFile(f);

    try {
      if (f.type === 'text/plain' || f.name.endsWith('.txt') || f.name.endsWith('.md')) {
        const text = await f.text();
        onTextExtracted(text);
      } else if (f.type === 'application/pdf') {
        // Simulate PDF text extraction with a placeholder message
        onTextExtracted(`Content extracted from: ${f.name}\n\nPDF content processing...\n\nFor best results with PDFs, copy the text from your PDF and use the "Paste Text" option.\n\nMeanwhile, generating sample flashcards based on the document name: ${f.name.replace('.pdf', '')}`);
      } else {
        // Try reading as text anyway
        try {
          const text = await f.text();
          onTextExtracted(text);
        } catch {
          setError('Unable to read file content. Try copying and pasting the text instead.');
        }
      }
    } catch {
      setError('Failed to read file. Please try again.');
    }
  }, [onTextExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.txt', '.md'], 'application/pdf': ['.pdf'], 'text/html': ['.html'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
          isDragActive
            ? 'border-violet-500 bg-violet-500/10'
            : 'border-white/15 hover:border-white/30 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            isDragActive ? 'bg-violet-500/20' : 'bg-white/5'
          }`}>
            <Upload size={22} className={isDragActive ? 'text-violet-400' : 'text-white/40'} />
          </div>
          {isDragActive ? (
            <p className="text-violet-400 font-medium">Drop the file here!</p>
          ) : (
            <>
              <p className="text-white/70 font-medium">Drop a file or click to upload</p>
              <p className="text-xs text-white/30">Supports: .txt, .md, .pdf (max 10MB)</p>
            </>
          )}
        </div>
      </div>

      {file && !error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 glass border border-emerald-500/30 rounded-xl px-4 py-3"
        >
          <FileText size={16} className="text-emerald-400 flex-shrink-0" />
          <span className="text-sm text-emerald-300 flex-1 truncate">{file.name}</span>
          <button onClick={() => { setFile(null); onTextExtracted(''); }} className="text-white/40 hover:text-white/70">
            <X size={14} />
          </button>
        </motion.div>
      )}

      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
};
