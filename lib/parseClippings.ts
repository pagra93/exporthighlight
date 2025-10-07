/**
 * API del parser que gestiona el Web Worker
 */

import type { ParseResult, WorkerMessage } from './types';

export async function parseFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    // Leer el archivo
    const reader = new FileReader();
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.onload = () => {
      try {
        const fileContent = reader.result as string;
        
        // Crear Web Worker (Next.js 14 App Router)
        const worker = new Worker(
          new URL('./parseClippings.worker.ts', import.meta.url)
        );
        
        // Configurar timeout (30 segundos máximo)
        const timeout = setTimeout(() => {
          worker.terminate();
          reject(new Error('Timeout: El archivo tardó demasiado en procesarse'));
        }, 30000);
        
        // Escuchar mensajes del worker
        worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
          const message = e.data;
          
          if (message.type === 'completed') {
            clearTimeout(timeout);
            worker.terminate();
            resolve(message.result);
          } else if (message.type === 'error') {
            clearTimeout(timeout);
            worker.terminate();
            reject(new Error(message.error));
          } else if (message.type === 'progress') {
            // Podrías emitir eventos de progreso aquí si lo deseas
            console.log(`Progreso: ${message.progress}%`, message.message);
          }
        };
        
        worker.onerror = (error) => {
          clearTimeout(timeout);
          worker.terminate();
          reject(new Error(`Error en el worker: ${error.message}`));
        };
        
        // Enviar archivo al worker
        worker.postMessage({ fileContent });
        
      } catch (error) {
        reject(error);
      }
    };
    
    reader.readAsText(file);
  });
}

/**
 * Valida que el archivo sea válido
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Verificar nombre de archivo
  if (!file.name.toLowerCase().includes('clipping')) {
    return {
      valid: false,
      error: 'El archivo debe ser "My Clippings.txt" de tu Kindle',
    };
  }
  
  // Verificar tipo
  if (file.type && !file.type.includes('text')) {
    return {
      valid: false,
      error: 'El archivo debe ser de tipo texto (.txt)',
    };
  }
  
  // Verificar tamaño (máximo 50MB)
  if (file.size > 50 * 1024 * 1024) {
    return {
      valid: false,
      error: 'El archivo es demasiado grande (máximo 50MB)',
    };
  }
  
  // Verificar que no esté vacío
  if (file.size === 0) {
    return {
      valid: false,
      error: 'El archivo está vacío',
    };
  }
  
  return { valid: true };
}

