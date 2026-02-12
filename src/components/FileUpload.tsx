import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet } from "lucide-react";

interface FileUploadProps {
  onFileLoaded: (data: string) => void;
}

const FileUpload = ({ onFileLoaded }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileLoaded(text);
      };
      reader.readAsText(file);
    },
    [onFileLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/5 glow-border"
          : fileName
          ? "border-primary/40 bg-card"
          : "border-border bg-card hover:border-primary/30 hover:bg-secondary/50"
      }`}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".csv,.txt,.tsv";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) handleFile(file);
        };
        input.click();
      }}
    >
      <div className="flex flex-col items-center gap-3">
        {fileName ? (
          <>
            <FileSpreadsheet className="h-10 w-10 text-primary" />
            <p className="font-mono text-sm text-primary">{fileName}</p>
            <p className="text-xs text-muted-foreground">Click or drag to replace</p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              Drop your CSV file here
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse • supports .csv, .txt, .tsv
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default FileUpload;
