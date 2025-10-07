/**
 * Sistema de gating para controlar export sin login
 * Sin login: solo 1 libro por sesión
 * Con login: export ilimitado
 */

const STORAGE_KEY = 'kindle_exported_books';

export interface GatingStatus {
  canExport: boolean;
  exportedCount: number;
  maxExports: number;
  requiresLogin: boolean;
}

/**
 * Verifica si el usuario puede exportar más libros
 */
export function checkExportStatus(isAuthenticated: boolean): GatingStatus {
  if (isAuthenticated) {
    return {
      canExport: true,
      exportedCount: 0,
      maxExports: Infinity,
      requiresLogin: false,
    };
  }
  
  // Usuario no autenticado: límite de 1 libro
  const exportedCount = getExportedBooksCount();
  const maxExports = 1;
  
  return {
    canExport: exportedCount < maxExports,
    exportedCount,
    maxExports,
    requiresLogin: exportedCount >= maxExports,
  };
}

/**
 * Registra que se exportó un libro
 */
export function recordExport(bookId: string): void {
  try {
    const exported = getExportedBooks();
    if (!exported.includes(bookId)) {
      exported.push(bookId);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(exported));
    }
  } catch (error) {
    console.error('Error al registrar export:', error);
  }
}

/**
 * Obtiene la lista de libros exportados en esta sesión
 */
function getExportedBooks(): string[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Obtiene el número de libros exportados
 */
function getExportedBooksCount(): number {
  return getExportedBooks().length;
}

/**
 * Limpia el registro de exports (útil después de login)
 */
export function resetExportGating(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error al limpiar gating:', error);
  }
}

/**
 * Verifica si un libro específico ya fue exportado
 */
export function hasExported(bookId: string): boolean {
  return getExportedBooks().includes(bookId);
}

