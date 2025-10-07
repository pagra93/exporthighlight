import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Sanitizar nombres de archivo para export
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-') // Caracteres inválidos en Windows/Unix
    .replace(/\s+/g, ' ') // Espacios múltiples
    .trim()
    .substring(0, 200); // Límite de longitud
}

// Formatear números con separadores de miles
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-ES').format(num);
}

// Formatear fecha legible
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Fecha desconocida';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
