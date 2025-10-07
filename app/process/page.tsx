"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, FileText } from 'lucide-react';
import { get as idbGet, del as idbDel } from 'idb-keyval';
import { motion } from 'framer-motion';
import type { ParseResult, Book, Highlight } from '@/lib/types';
import { BooksGrid } from '@/components/BooksGrid';
import { HighlightsTable } from '@/components/HighlightsTable';
import { ExportBar } from '@/components/ExportBar';
import { MetadataEnricher } from '@/components/MetadataEnricher';
import { formatNumber } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { saveToAccount } from '@/lib/supabase-helpers';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExportLimit } from '@/contexts/ExportLimitContext';
import { ExportLimitBanner } from '@/components/ExportLimitBanner';
import { ExportLimitModal } from '@/components/ExportLimitModal';
import { AuthModal } from '@/components/AuthModal';
import { createPortal } from 'react-dom';

export default function ProcessPage() {
  const router = useRouter();
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showMetadataEnricher, setShowMetadataEnricher] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { canExport, incrementCount, isLimitReached, remainingExports } = useExportLimit();

  const handleEnrichedBooks = (enrichedBooks: Book[]) => {
    if (parseResult) {
      setParseResult({
        ...parseResult,
        books: enrichedBooks,
      });
      setShowMetadataEnricher(false);
    }
  };

  useEffect(() => {
    const loadResult = async () => {
      try {
        const result = await idbGet<ParseResult>('parseResult');
        if (!result) {
          router.push('/');
          return;
        }
        setParseResult(result);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading parse result:', error);
        router.push('/');
      }
    };

    loadResult();
  }, [router]);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
  };

  const handleBack = () => {
    // Limpiar datos
    idbDel('parseResult');
    router.push('/');
  };

  const handleSaveToAccount = async () => {
    if (!parseResult || !isAuthenticated) return;

    setIsSaving(true);
    try {
      const stats = await saveToAccount(parseResult);
      
      // Crear mensaje detallado
      const parts = [];
      if (stats.newBooks > 0) {
        parts.push(`${stats.newBooks} ${stats.newBooks === 1 ? 'libro nuevo' : 'libros nuevos'}`);
      }
      if (stats.existingBooks > 0) {
        parts.push(`${stats.existingBooks} ${stats.existingBooks === 1 ? 'libro actualizado' : 'libros actualizados'}`);
      }
      parts.push(`${stats.newHighlights} ${stats.newHighlights === 1 ? 'highlight nuevo' : 'highlights nuevos'}`);
      
      if (stats.duplicateHighlights > 0) {
        parts.push(`${stats.duplicateHighlights} duplicados ignorados`);
      }
      
      toast({
        title: '✅ ' + t.process.saveSuccess,
        description: parts.join(', '),
        duration: 5000,
      });
    } catch (error) {
      console.error('Error saving to account:', error);
      toast({
        title: t.process.saveError,
        description: error instanceof Error ? error.message : t.common.error,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">{t.common.loading}</p>
      </div>
    );
  }

  if (!parseResult) {
    return null;
  }

  const selectedHighlights = selectedBook
    ? parseResult.highlights.filter(h => h.bookId === selectedBook.id)
    : [];

  return (
    <>
      {/* Banner de límite de exportaciones - Solo para NO registrados */}
      {!isAuthenticated && (
        <ExportLimitBanner onRegisterClick={() => setShowAuthModal(true)} />
      )}

      {/* Modal de límite */}
      <ExportLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onRegister={() => {
          setShowLimitModal(false);
          setShowAuthModal(true);
        }}
        trigger="after-export"
      />

      {/* Modal de autenticación */}
      {typeof window !== 'undefined' && !isAuthenticated && showAuthModal && createPortal(
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            toast({
              title: "Bienvenido",
              description: "Ahora tienes exportaciones ilimitadas",
            });
          }}
        />,
        document.body
      )}

      <div className="container mx-auto px-4 py-12 pb-32">
      {/* Header - Solo cuando NO hay libro seleccionado */}
      {!selectedBook && (
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.process.backToHome}
          </Button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            {t.process.title}
          </h1>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{formatNumber(parseResult.stats.books)}</p>
                <p className="text-sm text-muted-foreground">
                  {t.process.foundBooks}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{formatNumber(parseResult.stats.highlights)}</p>
                <p className="text-sm text-muted-foreground">
                  {t.process.totalHighlights}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      )}

      {/* Metadata Enricher - Solo para usuarios registrados */}
      {showMetadataEnricher && !selectedBook && isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <MetadataEnricher 
            books={parseResult.books}
            onEnriched={handleEnrichedBooks}
          />
        </motion.div>
      )}

      {/* Content */}
      {!selectedBook ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6">
            {t.process.selectBook}
          </h2>
          <BooksGrid
            books={parseResult.books}
            highlights={parseResult.highlights}
            onBookSelect={handleBookSelect}
            isAuthenticated={isAuthenticated}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Book header - Limpio sin stats */}
          <div className="mb-4">
            <Button variant="ghost" onClick={() => setSelectedBook(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.nav?.backToBooks || 'Volver a todos los libros'}
            </Button>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{selectedBook.title}</h2>
              {selectedBook.author && (
                <p className="text-lg text-muted-foreground mb-4">
                  {selectedBook.author}
                </p>
              )}
            </div>
          </div>

          {/* Highlights */}
          <HighlightsTable highlights={selectedHighlights} />
          
          {/* Export bar */}
          <ExportBar
            book={selectedBook}
            highlights={selectedHighlights}
            isAuthenticated={isAuthenticated}
          />
        </motion.div>
      )}

      {/* Export bar para todos los libros (cuando no hay libro seleccionado) */}
      {!selectedBook && parseResult && (
        <ExportBar
          parseResult={parseResult}
          isAuthenticated={isAuthenticated}
          onSaveToAccount={handleSaveToAccount}
        />
      )}
      </div>
    </>
  );
}

