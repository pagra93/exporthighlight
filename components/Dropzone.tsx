"use client";

import { useState, useRef } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css';
import { Upload } from 'lucide-react';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

export function Dropzone({ onFileAccepted, disabled = false }: DropzoneProps) {
  const [files, setFiles] = useState<any[]>([]);
  const pondRef = useRef<FilePond>(null);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <FilePond
        ref={pondRef}
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        maxFiles={1}
        acceptedFileTypes={['text/plain']}
        maxFileSize="50MB"
        name="file"
        disabled={disabled}
        labelIdle={`
          <div class="flex flex-col items-center justify-center py-12">
            <svg class="w-16 h-16 mb-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <div class="text-lg font-medium mb-2">Arrastra tu <strong>My Clippings.txt</strong> aquí</div>
            <div class="text-sm text-muted-foreground">o haz clic para seleccionar</div>
            <div class="text-xs text-muted-foreground mt-4">
              <span class="inline-flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Todo ocurre en tu navegador. No subimos tu archivo.
              </span>
            </div>
          </div>
        `}
        onaddfile={(error, file) => {
          if (!error && file.file) {
            onFileAccepted(file.file as File);
          }
        }}
        credits={false}
      />
    </div>
  );
}

