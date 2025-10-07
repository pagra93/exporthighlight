/**
 * Web Worker for parsing Kindle clippings
 * Provides real-time progress updates
 */

import { parseKindleClippings, RobustParseResult } from './robust-parser';

export interface WorkerMessage {
  type: 'parse';
  content: string;
}

export interface WorkerResponse {
  type: 'progress' | 'complete' | 'error';
  progress?: number;
  phase?: 'reading' | 'detecting' | 'parsing' | 'organizing';
  result?: RobustParseResult;
  error?: string;
  currentEntry?: number;
  totalEntries?: number;
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  try {
    const { content } = e.data;
    
    // Phase 1: Reading - mostrar el proceso de lectura
    postProgress(2, 'reading');
    await sleep(randomDelay(600, 1000));
    postProgress(5, 'reading');
    await sleep(randomDelay(400, 700));
    
    // Phase 2: Detecting language - hacer más dramático
    postProgress(10, 'detecting');
    await sleep(randomDelay(800, 1200));
    postProgress(15, 'detecting');
    await sleep(randomDelay(500, 800));
    
    // Phase 3: Parsing - fase más larga para mostrar el trabajo
    postProgress(20, 'parsing');
    
    // Split into entries to track progress
    const entries = content.split('==========').filter(e => e.trim());
    const totalEntries = entries.length;
    
    // Parse with progress tracking (más lento y visible)
    const result = await parseWithProgress(content, totalEntries);
    
    // Phase 4: Organizing - mostrar organización
    postProgress(90, 'organizing');
    await sleep(randomDelay(800, 1200));
    postProgress(95, 'organizing');
    await sleep(randomDelay(600, 900));
    
    // Complete - pausa final para que vean el 100%
    postProgress(100, 'organizing');
    await sleep(400);
    
    self.postMessage({
      type: 'complete',
      result,
    } as WorkerResponse);
    
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    } as WorkerResponse);
  }
};

/**
 * Parse with progress updates - más lento para mejor UX
 */
async function parseWithProgress(content: string, totalEntries: number): Promise<RobustParseResult> {
  // For now, we parse all at once
  // In a future optimization, we could parse in chunks
  const result = parseKindleClippings(content);
  
  // Simulate progress for better UX - más chunks para que se vea mejor
  const chunks = 15;
  const progressPerChunk = 70 / chunks; // 20% to 90%
  
  for (let i = 0; i < chunks; i++) {
    // Delays variables para que se vea más natural
    await sleep(randomDelay(200, 500));
    const currentProgress = 20 + (i + 1) * progressPerChunk;
    const currentEntry = Math.floor((i + 1) * (totalEntries / chunks));
    
    postProgress(
      currentProgress, 
      'parsing',
      currentEntry,
      totalEntries
    );
  }
  
  return result;
}

function postProgress(
  progress: number, 
  phase: WorkerResponse['phase'],
  currentEntry?: number,
  totalEntries?: number
) {
  self.postMessage({
    type: 'progress',
    progress,
    phase,
    currentEntry,
    totalEntries,
  } as WorkerResponse);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Genera un delay aleatorio entre min y max ms
 * Para hacer el progreso más natural y visible
 */
function randomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

