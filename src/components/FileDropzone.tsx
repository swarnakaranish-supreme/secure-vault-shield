import { useCallback, useState } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface FileDropzoneProps {
  files: File[];
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
}

export function FileDropzone({ files, onFilesSelected, maxFiles = 10, accept }: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { t } = useLanguage();
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFilesSelected([...files, ...droppedFiles].slice(0, maxFiles));
  }, [files, onFilesSelected, maxFiles]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onFilesSelected([...files, ...selectedFiles].slice(0, maxFiles));
    }
  };
  
  const removeFile = (index: number) => {
    onFilesSelected(files.filter((_, i) => i !== index));
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="space-y-4">
      <Card
        className={cn(
          'border-2 border-dashed p-4 sm:p-8 text-center transition-colors touch-manipulation',
          isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          'hover:border-primary/50 hover:bg-primary/5 active:border-primary active:bg-primary/10'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold">{t('choose_files')}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {t('drag_drop_files')}
            </p>
          </div>
          
          <input
            type="file"
            multiple={maxFiles > 1}
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <Button asChild variant="outline" size="lg" className="touch-manipulation min-h-12">
            <label htmlFor="file-input" className="cursor-pointer">
              Browse Files
            </label>
          </Button>
        </div>
      </Card>
      
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            {files.length} {files.length === 1 ? t('file_selected') : t('files_selected')}
          </h4>
          {files.map((file, index) => (
            <Card key={index} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <FileIcon className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-destructive hover:text-destructive shrink-0 touch-manipulation min-h-10 min-w-10"
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}