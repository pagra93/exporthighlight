'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Book, Sparkles, Image, CheckCircle2 } from 'lucide-react';
import { enrichBooksWithMetadata } from '@/lib/openLibrary';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Book as BookType } from '@/lib/types';

interface MetadataEnricherProps {
  books: BookType[];
  onEnriched: (enrichedBooks: BookType[]) => void;
}

export function MetadataEnricher({ books, onEnriched }: MetadataEnricherProps) {
  const [isEnriching, setIsEnriching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enrichedCount, setEnrichedCount] = useState(0);
  const [currentBook, setCurrentBook] = useState<string>('');
  const [foundBooks, setFoundBooks] = useState<string[]>([]);
  const [notFoundBooks, setNotFoundBooks] = useState<string[]>([]);
  const { t } = useLanguage();

  const handleEnrich = async () => {
    setIsEnriching(true);
    setProgress(0);
    setEnrichedCount(0);
    setFoundBooks([]);
    setNotFoundBooks([]);

    try {
      // Enrich books with metadata
      const metadataMap = await enrichBooksWithMetadata(
        books.map(b => ({ title: b.title, author: b.author })),
        (current, total) => {
          setProgress((current / total) * 100);
          if (current <= books.length) {
            setCurrentBook(books[current - 1]?.title || '');
          }
        }
      );

      // Update books with metadata
      const enrichedBooks = books.map(book => {
        const key = `${book.title}|||${book.author || ''}`;
        const metadata = metadataMap.get(key);
        
        if (metadata && metadata.coverUrl) {
          setEnrichedCount(prev => prev + 1);
          setFoundBooks(prev => [...prev, book.title]);
          return {
            ...book,
            coverUrl: metadata.coverUrl,
            author: metadata.author || book.author,
            asin: book.asin,
          };
        } else {
          setNotFoundBooks(prev => [...prev, book.title]);
        }
        
        return book;
      });

      onEnriched(enrichedBooks);
    } catch (error) {
      console.error('Error enriching metadata:', error);
    } finally {
      setIsEnriching(false);
    }
  };

  if (isEnriching) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
          >
            <Sparkles className="h-5 w-5 text-white" />
          </motion.div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Buscando portadas...</h3>
            <p className="text-sm text-muted-foreground">
              {Math.floor((progress / 100) * books.length)} de {books.length} libros procesados
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-2 mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground mb-3">
          <span>{Math.round(progress)}%</span>
          <span className="text-green-600 dark:text-green-400">✓ {foundBooks.length} encontrados</span>
        </div>

        {currentBook && (
          <motion.div
            key={currentBook}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-muted-foreground mt-3 truncate"
          >
            <span className="font-medium">Buscando:</span> {currentBook}
          </motion.div>
        )}
      </motion.div>
    );
  }

  if (enrichedCount > 0 || notFoundBooks.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Búsqueda completada</h3>
            <div className="space-y-2 text-sm">
              {enrichedCount > 0 && (
                <p className="text-green-700 dark:text-green-300">
                  ✓ Se encontraron {enrichedCount} portadas
                </p>
              )}
              {notFoundBooks.length > 0 && (
                <div>
                  <p className="text-amber-700 dark:text-amber-300 mb-1">
                    ⚠ {notFoundBooks.length} libros sin portada disponible:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                    {notFoundBooks.slice(0, 5).map((title, i) => (
                      <li key={i} className="truncate">• {title}</li>
                    ))}
                    {notFoundBooks.length > 5 && (
                      <li className="italic">...y {notFoundBooks.length - 5} más</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
          <Image className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">Enriquecer con metadata</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Busca automáticamente portadas, ISBNs y más información sobre tus libros usando la API de Open Library.
          </p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Book className="h-4 w-4" />
            <span>{books.length} {books.length === 1 ? 'libro' : 'libros'} para enriquecer</span>
          </div>

          <Button 
            onClick={handleEnrich}
            disabled={isEnriching}
            className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Sparkles className="h-4 w-4" />
            Enriquecer metadata
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

