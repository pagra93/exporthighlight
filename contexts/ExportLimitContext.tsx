"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface ExportLimitState {
  count: number;
  limit: number;
  canExport: boolean;
  remainingExports: number;
  incrementCount: () => void;
  resetCount: () => void;
  isLimitReached: boolean;
}

const ExportLimitContext = createContext<ExportLimitState | undefined>(undefined);

const EXPORT_LIMIT = 2;
const STORAGE_KEY = 'kindle-notes-export-count';

export function ExportLimitProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const { isAuthenticated } = useAuth();

  // Cargar contador del localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setCount(parseInt(saved, 10));
        } catch (error) {
          console.error('Error loading export count:', error);
        }
      }
    }
  }, [isAuthenticated]);

  // Guardar contador en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, count.toString());
    }
  }, [count, isAuthenticated]);

  // Resetear contador al registrarse
  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      setCount(0);
    }
  }, [isAuthenticated]);

  const incrementCount = () => {
    if (!isAuthenticated && count < EXPORT_LIMIT) {
      setCount(prev => prev + 1);
    }
  };

  const resetCount = () => {
    setCount(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const canExport = isAuthenticated || count < EXPORT_LIMIT;
  const remainingExports = isAuthenticated ? Infinity : Math.max(0, EXPORT_LIMIT - count);
  const isLimitReached = !isAuthenticated && count >= EXPORT_LIMIT;

  return (
    <ExportLimitContext.Provider 
      value={{ 
        count, 
        limit: EXPORT_LIMIT, 
        canExport, 
        remainingExports,
        incrementCount, 
        resetCount,
        isLimitReached
      }}
    >
      {children}
    </ExportLimitContext.Provider>
  );
}

export function useExportLimit() {
  const context = useContext(ExportLimitContext);
  if (context === undefined) {
    throw new Error('useExportLimit must be used within an ExportLimitProvider');
  }
  return context;
}

