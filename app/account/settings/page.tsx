'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Eye, FileText, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExportSettings } from '@/contexts/ExportSettingsContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { settings, updateSettings } = useExportSettings();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t.settings?.title || 'Configuración'}</h1>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">{t.settings?.language?.title || 'Idioma'}</h2>
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            {t.settings?.language?.description || 'Cambia el idioma de la interfaz'}
          </p>
          <LanguageSelector />
        </motion.div>

        {/* Highlight Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">{t.settings?.display?.title || 'Visualización de Highlights'}</h2>
          </div>
          <p className="text-muted-foreground mb-6 text-sm">
            {t.settings?.display?.description || 'Configura cómo se muestran tus highlights'}
          </p>

          <div className="space-y-4">
            <div>
              <Label className="mb-3 block font-medium">{t.settings?.display?.style?.label || 'Estilo de visualización'}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => updateSettings({ highlightStyle: 'compact' })}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    settings.highlightStyle === 'compact'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium mb-2">{t.settings?.display?.style?.compact?.title || 'Compacto'}</p>
                  <p className="text-xs text-muted-foreground mb-4">{t.settings?.display?.style?.compact?.description || 'Muestra solo el texto'}</p>
                  
                  {/* Ejemplo visual compacto */}
                  <div className="bg-muted/30 rounded-md p-3 space-y-2">
                    <div className="text-sm font-medium text-primary">📖 El Quijote</div>
                    <div className="text-sm leading-relaxed">
                      "En un lugar de la Mancha, de cuyo nombre no quiero acordarme..."
                    </div>
                    <div className="text-sm leading-relaxed">
                      {t.settings?.examples?.libertadQuote || 'Liberty, Sancho, is one of the most precious gifts that heaven has bestowed upon men...'}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => updateSettings({ highlightStyle: 'detailed' })}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    settings.highlightStyle === 'detailed'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium mb-2">{t.settings?.display?.style?.detailed?.title || 'Detallado'}</p>
                  <p className="text-xs text-muted-foreground mb-4">{t.settings?.display?.style?.detailed?.description || 'Incluye ubicación y fecha'}</p>
                  
                  {/* Ejemplo visual detallado */}
                  <div className="bg-muted/30 rounded-md p-3 space-y-3">
                    <div className="text-sm font-medium text-primary">📖 El Quijote</div>
                    <div className="space-y-3">
                      <div className="border-l-2 border-primary/30 pl-3">
                        <div className="text-sm leading-relaxed mb-2">
                          "En un lugar de la Mancha, de cuyo nombre no quiero acordarme..."
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            📍 Ubicación 123
                          </div>
                          <div className="flex items-center gap-1">
                            📅 15 Mar 2024
                          </div>
                        </div>
                      </div>
                      <div className="border-l-2 border-primary/30 pl-3">
                        <div className="text-sm leading-relaxed mb-2">
                          {t.settings?.examples?.libertadQuote || 'Liberty, Sancho, is one of the most precious gifts that heaven has bestowed upon men...'}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            📍 Ubicación 456
                          </div>
                          <div className="flex items-center gap-1">
                            📅 16 Mar 2024
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <Label className="mb-3 block font-medium">{t.settings?.display?.order?.label || 'Orden de highlights'}</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateSettings({ sortOrder: 'date' })}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    settings.sortOrder === 'date'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium mb-1">{t.settings?.display?.order?.byDate?.title || 'Por fecha'}</p>
                  <p className="text-xs text-muted-foreground">{t.settings?.display?.order?.byDate?.description || 'Más recientes primero'}</p>
                </button>
                <button
                  onClick={() => updateSettings({ sortOrder: 'location' })}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    settings.sortOrder === 'location'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium mb-1">{t.settings?.display?.order?.byLocation?.title || 'Por ubicación'}</p>
                  <p className="text-xs text-muted-foreground">{t.settings?.display?.order?.byLocation?.description || 'Orden del libro'}</p>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Export Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">{t.settings?.export?.title || 'Exportación'}</h2>
          </div>
          <p className="text-muted-foreground mb-6 text-sm">
            {t.settings?.export?.description || 'Preferencias para exportar tus highlights'}
          </p>

          <div className="space-y-6">
            {/* Opciones de contenido */}
            <div>
              <Label className="mb-3 block font-medium">{t.settings?.export?.content?.label || 'Contenido a incluir'}</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <label htmlFor="personal-notes" className="flex-1 cursor-pointer">
                    {t.settings?.export?.content?.personalNotes || 'Incluir notas personales'}
                  </label>
                  <input 
                    id="personal-notes"
                    type="checkbox" 
                    checked={settings.includePersonalNotes}
                    onChange={(e) => updateSettings({ includePersonalNotes: e.target.checked })}
                    className="h-4 w-4" 
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <label htmlFor="include-location" className="flex-1 cursor-pointer">
                    {t.settings?.export?.content?.location || 'Incluir ubicación'}
                  </label>
                  <input 
                    id="include-location"
                    type="checkbox" 
                    checked={settings.includeLocation}
                    onChange={(e) => updateSettings({ includeLocation: e.target.checked })}
                    className="h-4 w-4" 
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <label htmlFor="include-date" className="flex-1 cursor-pointer">
                    {t.settings?.export?.content?.date || 'Incluir fecha'}
                  </label>
                  <input 
                    id="include-date"
                    type="checkbox" 
                    checked={settings.includeDate}
                    onChange={(e) => updateSettings({ includeDate: e.target.checked })}
                    className="h-4 w-4" 
                  />
                </div>
              </div>
            </div>

            {/* Estilo de exportación */}
            <div>
              <Label className="mb-3 block font-medium">{t.settings?.export?.style?.label || 'Estilo de exportación'}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => updateSettings({ exportStyle: 'compact' })}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    settings.exportStyle === 'compact'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium mb-2">{t.settings?.export?.style?.compact?.title || 'Compacto'}</p>
                  <p className="text-xs text-muted-foreground mb-4">{t.settings?.export?.style?.compact?.description || 'Todo en una línea'}</p>
                  
                  {/* Ejemplo dinámico compacto */}
                  <div className="bg-muted/30 rounded-md p-3">
                    <div className="text-sm font-medium text-primary mb-2">📖 El Quijote</div>
                    <div className="text-sm leading-relaxed">
                      "En un lugar de la Mancha, de cuyo nombre no quiero acordarme..."
                      {(settings.includeLocation || settings.includeDate) && (
                        <span className="text-xs text-muted-foreground ml-2">
                          [{settings.includeLocation && '📍123'}{settings.includeLocation && settings.includeDate && ' • '}{settings.includeDate && '📅15 Mar 2024'}]
                        </span>
                      )}
                    </div>
                    {settings.includePersonalNotes && (
                      <div className="text-xs italic text-muted-foreground mt-1">
                        💭 Nota personal aquí...
                      </div>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={() => updateSettings({ exportStyle: 'detailed' })}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    settings.exportStyle === 'detailed'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium mb-2">{t.settings?.export?.style?.detailed?.title || 'Detallado'}</p>
                  <p className="text-xs text-muted-foreground mb-4">{t.settings?.export?.style?.detailed?.description || 'Información separada'}</p>
                  
                  {/* Ejemplo dinámico detallado */}
                  <div className="bg-muted/30 rounded-md p-3">
                    <div className="text-sm font-medium text-primary mb-2">📖 El Quijote</div>
                    <div className="text-sm leading-relaxed mb-2">
                      "En un lugar de la Mancha, de cuyo nombre no quiero acordarme..."
                    </div>
                    {(settings.includeLocation || settings.includeDate) && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-2">
                        {settings.includeLocation && (
                          <div className="flex items-center gap-1">
                            📍 Ubicación: 123
                          </div>
                        )}
                        {settings.includeDate && (
                          <div className="flex items-center gap-1">
                            {t.settings?.examples?.date || '📅 Date: March 15, 2024'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Vista previa completa */}
            <div>
              <Label className="mb-3 block font-medium">{t.settings?.export?.preview?.label || 'Vista previa del export'}</Label>
              <div className="bg-muted/30 rounded-md p-4 border">
                <div className="text-sm font-medium text-primary mb-3">{t.settings?.examples?.quijoteTitle || '📖 Don Quixote - Miguel de Cervantes'}</div>
                
                <div className="space-y-3">
                  <div className="border-l-2 border-primary/30 pl-3">
                    <div className="text-sm leading-relaxed mb-2">
                      {t.settings?.examples?.quijoteQuote || 'In a village of La Mancha, the name of which I have no desire to call to mind, there lived not long since one of those gentlemen...'}
                    </div>
                    {settings.includePersonalNotes && (
                      <div className="text-sm italic text-muted-foreground mb-2">
                        {t.settings?.examples?.quijoteNote || '💭 Note: Classic beginning of Spanish literature'}
                      </div>
                    )}
                    {(settings.includeLocation || settings.includeDate) && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {settings.includeLocation && (
                          <div className="flex items-center gap-1">
                            {t.settings?.examples?.location || '📍 Location: 123-125'}
                          </div>
                        )}
                        {settings.includeDate && (
                          <div className="flex items-center gap-1">
                            {t.settings?.examples?.date || '📅 Date: March 15, 2024'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="border-l-2 border-primary/30 pl-3">
                    <div className="text-sm leading-relaxed mb-2">
                      {t.settings?.examples?.libertadQuote || 'Liberty, Sancho, is one of the most precious gifts that heaven has bestowed upon men...'}
                    </div>
                    {(settings.includeLocation || settings.includeDate) && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {settings.includeLocation && (
                          <div className="flex items-center gap-1">
                            📍 Ubicación: 456-458
                          </div>
                        )}
                        {settings.includeDate && (
                          <div className="flex items-center gap-1">
                            📅 Fecha: 16 de marzo de 2024
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8">
          <Button 
            size="lg"
            className="w-full"
            variant={isSaved ? "secondary" : "default"}
            onClick={() => {
              setIsSaved(true);
              toast({
                title: "Configuración guardada",
                description: "Tus preferencias se han aplicado correctamente",
              });
              setTimeout(() => setIsSaved(false), 3000);
            }}
          >
            {isSaved ? (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardado
              </>
            ) : (
              'Guardar cambios'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

