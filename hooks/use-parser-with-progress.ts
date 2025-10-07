/**
 * React hook for parsing with Web Worker and progress tracking
 */

import { useState, useCallback, useRef } from 'react';
import { RobustParseResult } from '@/lib/parser/robust-parser';
import type { WorkerResponse } from '@/lib/parser/parser.worker';

export interface ParserProgress {
  progress: number; // 0-100
  phase: 'idle' | 'reading' | 'detecting' | 'parsing' | 'organizing' | 'complete' | 'error';
  currentEntry?: number;
  totalEntries?: number;
  isProcessing: boolean;
}

export interface UseParserResult {
  parseFile: (file: File) => Promise<RobustParseResult>;
  progress: ParserProgress;
  cancel: () => void;
}

export function useParserWithProgress(): UseParserResult {
  const workerRef = useRef<Worker | null>(null);
  const [progress, setProgress] = useState<ParserProgress>({
    progress: 0,
    phase: 'idle',
    isProcessing: false,
  });

  const parseFile = useCallback(async (file: File): Promise<RobustParseResult> => {
    return new Promise((resolve, reject) => {
      // Reset progress
      setProgress({
        progress: 0,
        phase: 'reading',
        isProcessing: true,
      });

      // Read file
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        
        // Check if Web Workers are supported
        if (typeof Worker === 'undefined') {
          // Fallback: parse directly
          try {
            const { parseKindleClippings } = await import('@/lib/parser/robust-parser');
            const result = parseKindleClippings(content);
            setProgress({
              progress: 100,
              phase: 'complete',
              isProcessing: false,
            });
            resolve(result);
          } catch (error) {
            setProgress({
              progress: 0,
              phase: 'error',
              isProcessing: false,
            });
            reject(error);
          }
          return;
        }

        // Create worker
        try {
          workerRef.current = new Worker(
            new URL('@/lib/parser/parser.worker.ts', import.meta.url)
          );

          workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
            const data = e.data;

            if (data.type === 'progress') {
              setProgress({
                progress: data.progress || 0,
                phase: data.phase || 'parsing',
                currentEntry: data.currentEntry,
                totalEntries: data.totalEntries,
                isProcessing: true,
              });
            } else if (data.type === 'complete') {
              setProgress({
                progress: 100,
                phase: 'complete',
                isProcessing: false,
              });
              workerRef.current?.terminate();
              workerRef.current = null;
              resolve(data.result!);
            } else if (data.type === 'error') {
              setProgress({
                progress: 0,
                phase: 'error',
                isProcessing: false,
              });
              workerRef.current?.terminate();
              workerRef.current = null;
              reject(new Error(data.error || 'Unknown error'));
            }
          };

          workerRef.current.onerror = (error) => {
            setProgress({
              progress: 0,
              phase: 'error',
              isProcessing: false,
            });
            workerRef.current?.terminate();
            workerRef.current = null;
            reject(error);
          };

          // Start parsing
          workerRef.current.postMessage({
            type: 'parse',
            content,
          });
        } catch (error) {
          // Fallback if worker creation fails
          console.warn('Worker creation failed, falling back to direct parsing', error);
          try {
            const { parseKindleClippings } = await import('@/lib/parser/robust-parser');
            const result = parseKindleClippings(content);
            setProgress({
              progress: 100,
              phase: 'complete',
              isProcessing: false,
            });
            resolve(result);
          } catch (parseError) {
            setProgress({
              progress: 0,
              phase: 'error',
              isProcessing: false,
            });
            reject(parseError);
          }
        }
      };

      reader.onerror = () => {
        setProgress({
          progress: 0,
          phase: 'error',
          isProcessing: false,
        });
        reject(new Error('Error reading file'));
      };

      reader.readAsText(file);
    });
  }, []);

  const cancel = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setProgress({
      progress: 0,
      phase: 'idle',
      isProcessing: false,
    });
  }, []);

  return {
    parseFile,
    progress,
    cancel,
  };
}

