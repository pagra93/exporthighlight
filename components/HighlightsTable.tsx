"use client";

import { useState, useEffect } from 'react';
import { Highlight, Tag } from '@/lib/types';
import { Search, MapPin, Calendar, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ManageTagsDropdown } from './ManageTagsDropdown';
import { TagBadge } from './TagBadge';
import { getHighlightTags } from '@/lib/tags-helpers';

interface HighlightsTableProps {
  highlights: Highlight[];
  onCopyMarkdown?: () => void;
  onDownloadMarkdown?: () => void;
  isCopied?: boolean;
  isAuthenticated?: boolean;
}

export function HighlightsTable({ highlights, onCopyMarkdown, onDownloadMarkdown, isCopied = false, isAuthenticated = false }: HighlightsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightTags, setHighlightTags] = useState<Record<string, Tag[]>>({});
  const [loadingTags, setLoadingTags] = useState(false);
  const { t } = useLanguage();

  // Cargar etiquetas de todos los highlights (solo si está autenticado)
  useEffect(() => {
    if (isAuthenticated && highlights.length > 0) {
      loadAllTags();
    }
  }, [highlights, isAuthenticated]);

  const loadAllTags = async () => {
    setLoadingTags(true);
    const tagsMap: Record<string, Tag[]> = {};
    
    try {
      await Promise.all(
        highlights.map(async (highlight) => {
          try {
            const tags = await getHighlightTags(highlight.id);
            tagsMap[highlight.id] = tags;
          } catch (error) {
            console.error(`Error loading tags for highlight ${highlight.id}:`, error);
            tagsMap[highlight.id] = [];
          }
        })
      );
      setHighlightTags(tagsMap);
    } catch (error) {
      console.error('Error loading all tags:', error);
    } finally {
      setLoadingTags(false);
    }
  };

  const handleTagsChange = () => {
    // Recargar tags cuando cambien
    loadAllTags();
  };

  const filtered = highlights.filter(h =>
    h.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (h.note && h.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Search bar con botones */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`${t.process?.table?.text || 'Search highlights'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Info y botones */}
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            {filtered.length} / {highlights.length} {t.export?.singleBook?.notes || 'highlights totales'}
          </p>
          
          {onCopyMarkdown && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyMarkdown}
              className="gap-2 whitespace-nowrap"
            >
              {isCopied ? (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t.export?.singleBook?.successTitle || 'Copiado'}
                </>
              ) : (
                <>{t.export?.singleBook?.exportButton || 'Copiar MD'}</>
              )}
            </Button>
          )}

          {onDownloadMarkdown && (
            <Button
              size="sm"
              onClick={onDownloadMarkdown}
              className="gap-2 whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              {t.export?.singleBook?.exportButton || 'Descargar MD'}
            </Button>
          )}
        </div>
      </div>

      {/* Highlights list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay libros disponibles
          </p>
        ) : (
          filtered.map((highlight, idx) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="rounded-lg border bg-card p-6 space-y-3"
            >
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {highlight.page && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{t.process?.table?.page || 'Página'} {highlight.page}</span>
                  </div>
                )}
                {highlight.location && !highlight.page && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{t.process?.table?.location || 'Ubicación'} {highlight.location}</span>
                  </div>
                )}
                {highlight.addedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(typeof highlight.addedAt === 'string' ? highlight.addedAt : highlight.addedAt.toISOString())}</span>
                  </div>
                )}
              </div>

              {/* Highlight text */}
              <blockquote className="border-l-4 border-primary pl-4 py-2">
                <p className="text-foreground leading-relaxed">
                  {highlight.text}
                </p>
              </blockquote>

              {/* Note if exists */}
              {highlight.note && (
                <div className="bg-secondary/50 rounded-md p-3">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t.process?.table?.note || 'Nota'}:
                  </p>
                  <p className="text-sm">{highlight.note}</p>
                </div>
              )}

              {/* Tags section (solo para usuarios registrados) */}
              {isAuthenticated && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  {/* Tags actuales */}
                  {highlightTags[highlight.id] && highlightTags[highlight.id].length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {highlightTags[highlight.id].map((tag) => (
                        <TagBadge key={tag.id} name={tag.name} />
                      ))}
                    </div>
                  )}
                  
                  {/* Botón para gestionar tags */}
                  <ManageTagsDropdown
                    highlightId={highlight.id}
                    onTagsChange={handleTagsChange}
                  />
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

