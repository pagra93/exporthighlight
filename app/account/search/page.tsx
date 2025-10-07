'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, BookOpen } from 'lucide-react';
import { getLibrary } from '@/lib/supabase-helpers';
import type { Book, Highlight } from '@/lib/types';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SearchPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const library = await getLibrary();
      setBooks(library.books);
      setHighlights(library.highlights);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHighlights = highlights.filter(h =>
    h.text.toLowerCase().includes(query.toLowerCase()) ||
    h.note?.toLowerCase().includes(query.toLowerCase())
  );

  const getBookTitle = (bookId: string) => {
    return books.find(b => b.id === bookId)?.title || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">{t.search?.loading || 'Cargando...'}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t.search?.title || 'Buscar en tus highlights'}</h1>

        {/* Search Input */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.search?.placeholder || "Busca por texto, nota, libro..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-14 text-lg"
          />
        </div>

        {/* Results */}
        {query && (
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredHighlights.length} {filteredHighlights.length === 1 ? t.search?.result || 'resultado' : t.search?.results || 'resultados'}
          </div>
        )}

        <div className="space-y-4">
          {!query ? (
            <div className="text-center py-12 text-muted-foreground">
              <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t.search?.noResults || 'Escribe algo para buscar en tu biblioteca'}</p>
            </div>
          ) : filteredHighlights.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>{t.search?.noResults || 'No se encontraron resultados'}</p>
            </div>
          ) : (
            filteredHighlights.map((highlight) => (
              <motion.div
                key={highlight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <BookOpen className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">{getBookTitle(highlight.bookId)}</h3>
                    {highlight.location && (
                      <p className="text-xs text-muted-foreground">
                        Ubicación {highlight.location}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-foreground leading-relaxed">{highlight.text}</p>
                {highlight.note && (
                  <div className="mt-3 pl-4 border-l-2 border-primary">
                    <p className="text-sm text-muted-foreground italic">{highlight.note}</p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

