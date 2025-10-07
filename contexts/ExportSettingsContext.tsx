"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ExportSettings {
  includePersonalNotes: boolean;
  includeLocation: boolean;
  includeDate: boolean;
  exportStyle: 'compact' | 'detailed';
  highlightStyle: 'compact' | 'detailed';
  sortOrder: 'date' | 'location';
}

interface ExportSettingsContextType {
  settings: ExportSettings;
  updateSettings: (newSettings: Partial<ExportSettings>) => void;
}

const defaultSettings: ExportSettings = {
  includePersonalNotes: true,
  includeLocation: true,
  includeDate: true,
  exportStyle: 'detailed',
  highlightStyle: 'detailed',
  sortOrder: 'date',
};

const ExportSettingsContext = createContext<ExportSettingsContextType | undefined>(undefined);

export function ExportSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ExportSettings>(defaultSettings);

  // Cargar configuraciones del localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kindle-notes-export-settings');
      if (saved) {
        try {
          const parsedSettings = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsedSettings });
        } catch (error) {
          console.error('Error loading export settings:', error);
        }
      }
    }
  }, []);

  // Guardar configuraciones en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kindle-notes-export-settings', JSON.stringify(settings));
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<ExportSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <ExportSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ExportSettingsContext.Provider>
  );
}

export function useExportSettings() {
  const context = useContext(ExportSettingsContext);
  if (context === undefined) {
    throw new Error('useExportSettings must be used within an ExportSettingsProvider');
  }
  return context;
}
