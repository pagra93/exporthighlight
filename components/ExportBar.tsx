"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Lock, AlertCircle, Save, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportBookAsMarkdown } from '@/lib/markdown';
import { exportAllBooks } from '@/lib/exportZip';
import { AuthModal } from './AuthModal';
import type { Book, Highlight, ParseResult } from '@/lib/types';
import { useExportLimit } from '@/contexts/ExportLimitContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExportBarProps {
  book?: Book;
  highlights?: Highlight[];
  isAuthenticated?: boolean;
  parseResult?: ParseResult;
  onSaveToAccount?: () => void;
}

function ExportBarComponent({ 
  book, 
  highlights, 
  isAuthenticated = false,
  parseResult,
  onSaveToAccount,
}: ExportBarProps) {
  const { t } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();
  const { canExport, incrementCount } = useExportLimit();

  // Verificación de seguridad para parseResult
  if (parseResult && (!parseResult.books || !parseResult.highlights || !Array.isArray(parseResult.books) || !Array.isArray(parseResult.highlights))) {
    return null;
  }

  // Verificación adicional: si parseResult existe pero no tiene la estructura correcta
  if (parseResult && typeof parseResult !== 'object') {
    return null;
  }

  const handleExportSingle = () => {
    if (!book || !highlights) return;

    // Verificar límite si no está autenticado
    if (!isAuthenticated && !canExport) {
      setShowAuthModal(true);
      return;
    }

    try {
      setIsExporting(true);
      exportBookAsMarkdown(book, highlights);
      
      // Incrementar contador solo si no está autenticado
      if (!isAuthenticated) {
        incrementCount();
      }
      
      toast({
        title: t.export?.singleBook?.successTitle || 'Exported successfully!',
        description: `${book.title} ${t.export?.singleBook?.successDescription || 'has been downloaded as Markdown.'}`,
      });
    } catch (error) {
      toast({
        title: t.export?.singleBook?.errorTitle || 'Export error',
        description: error instanceof Error ? error.message : t.export?.singleBook?.errorDescription || 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAll = async () => {
    if (!parseResult || !parseResult.books || !parseResult.highlights) return;

    // Solo para registrados
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      setIsExporting(true);
      await exportAllBooks(parseResult.books, parseResult.highlights);
      
      toast({
        title: t.export?.allBooks?.successTitle || 'Exported successfully!',
        description: `${parseResult.books.length} ${t.export?.allBooks?.successDescription || 'books exported in a ZIP file.'}`,
      });
    } catch (error) {
      toast({
        title: t.export?.allBooks?.errorTitle || 'Export error',
        description: error instanceof Error ? error.message : t.export?.allBooks?.errorDescription || 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Vista para un solo libro
  if (book && highlights) {
    return (
      <>
        <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-muted-foreground">
                {highlights.length} {highlights.length === 1 ? t.export?.singleBook?.note || 'note' : t.export?.singleBook?.notes || 'notes'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="lg"
                onClick={handleExportSingle}
                disabled={isExporting}
                className="gap-2"
              >
                <Download className="h-5 w-5" />
                {t.export?.singleBook?.exportButton || 'Export MD'}
              </Button>
            </div>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  // Vista para todos los libros
  if (parseResult && parseResult.books && parseResult.highlights && Array.isArray(parseResult.books) && Array.isArray(parseResult.highlights)) {
    // Verificación adicional de seguridad
    const booksCount = parseResult.books?.length || 0;
    const highlightsCount = parseResult.highlights?.length || 0;
    
    return (
      <>
        <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <h3 className="font-semibold">
                {booksCount} {booksCount === 1 ? t.export?.allBooks?.book || 'book' : t.export?.allBooks?.books || 'books'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {highlightsCount} {t.export?.allBooks?.totalNotes || 'total notes'}
              </p>
            </div>

            <div className="flex gap-2">
              {isAuthenticated && onSaveToAccount && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onSaveToAccount}
                  disabled={isExporting}
                  className="gap-2"
                >
                  <Save className="h-5 w-5" />
                  {t.export?.allBooks?.saveToAccount || 'Save to my account'}
                </Button>
              )}
              
              <Button
                size="lg"
                onClick={handleExportAll}
                disabled={isExporting}
                className="gap-2"
              >
                {isAuthenticated ? (
                  <>
                    <Archive className="h-5 w-5" />
                    {t.export?.allBooks?.exportAllZip || 'Export all (ZIP)'}
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    {t.export?.allBooks?.loginToExport || 'Login to export all'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return null;
}

// Wrapper con Error Boundary
export function ExportBar(props: ExportBarProps) {
  try {
    return <ExportBarComponent {...props} />;
  } catch (error) {
    console.error('Error in ExportBar:', error);
    return null;
  }
}

