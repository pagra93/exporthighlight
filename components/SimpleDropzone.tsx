"use client";

import { useRef, useState } from 'react';
import { Upload, FileCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SimpleDropzoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
  selectedFileName?: string;
}

export function SimpleDropzone({ onFileAccepted, disabled = false, selectedFileName }: SimpleDropzoneProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileAccepted(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        onFileAccepted(file);
      } else {
        alert('Por favor, selecciona un archivo .txt');
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200
          ${disabled 
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60' 
            : isDragging
            ? 'border-primary bg-primary/20 scale-105'
            : selectedFileName
            ? 'border-green-500 bg-green-50'
            : 'border-primary/50 bg-primary/5 hover:border-primary hover:bg-primary/10'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".txt,text/plain"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        
        {selectedFileName ? (
          <>
            <FileCheck className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <div className="text-lg font-medium mb-2 text-green-700">
              ✅ Archivo seleccionado
            </div>
            <div className="text-sm text-green-600 font-mono bg-white px-4 py-2 rounded inline-block">
              {selectedFileName}
            </div>
            <div className="text-xs text-muted-foreground mt-4">
              {t.upload.processFile}
            </div>
          </>
        ) : (
          <>
            <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-primary animate-bounce' : 'text-primary'}`} />
            
            <div className="text-lg font-medium mb-2">
              {isDragging ? t.upload.dragActive : (
                <>{t.upload.dragDrop}</>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {t.upload.orClick}
            </div>
            
            <div className="text-xs text-muted-foreground mt-6 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t.upload.privacy}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

