"use client";

import { Book, Highlight, Collection } from '@/lib/types';
import { BookOpen, FileText, Download, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { exportBookAsMarkdown } from '@/lib/markdown';
import { useExportLimit } from '@/contexts/ExportLimitContext';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getBookCollections } from '@/lib/collections-helpers';
import { useLanguage } from '@/contexts/LanguageContext';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  isSelected?: boolean;
  highlights?: Highlight[];
  isAuthenticated?: boolean;
}

export function BookCard({ book, onClick, isSelected = false, highlights, isAuthenticated = false }: BookCardProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { canExport, incrementCount } = useExportLimit();
  const [isExporting, setIsExporting] = useState(false);
  const [bookCollections, setBookCollections] = useState<Collection[]>([]);

  const handleQuickExport = (e: React.MouseEvent) => {
    e.stopPropagation(); // No trigger onClick del card
    
    if (!highlights || highlights.length === 0) {
      toast({
        title: t.export?.singleBook?.errorTitle || "Sin notas",
        description: t.export?.singleBook?.errorDescription || "Este libro no tiene notas para exportar",
        variant: "destructive",
      });
      return;
    }

    // Verificar límite si no está autenticado
    if (!isAuthenticated && !canExport) {
      toast({
        title: t.export?.singleBook?.limitReached || 'Limit reached',
        description: t.export?.singleBook?.limitDescription || 'Sign up for unlimited exports',
        variant: "destructive",
      });
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
        title: t.export?.singleBook?.exported || 'Exported!',
        description: `${book.title} ${t.export?.singleBook?.exportedDescription || 'downloaded'}`,
      });
    } catch (error) {
      toast({
        title: t.export?.singleBook?.error || 'Error',
        description: t.export?.singleBook?.errorDescription || 'Could not export',
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const canExportBook = isAuthenticated || canExport;

  // Cargar colecciones del libro solo si está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadBookCollections();
    }
    
    // Escuchar eventos globales de cambio de colecciones
    const handleCollectionsUpdate = () => {
      if (isAuthenticated) {
        loadBookCollections();
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('collectionsUpdated', handleCollectionsUpdate);
      return () => {
        window.removeEventListener('collectionsUpdated', handleCollectionsUpdate);
      };
    }
  }, [book.id, isAuthenticated]);

  const loadBookCollections = async () => {
    try {
      const collections = await getBookCollections(book.id);
      console.log(`📁 Colecciones para libro "${book.title}":`, collections);
      setBookCollections(collections);
    } catch (error) {
      console.error(`❌ Error cargando colecciones para ${book.title}:`, error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-lg border-2 p-6 transition-all hover:shadow-lg",
        isSelected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-border bg-card hover:border-primary/50"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Cover image or placeholder */}
        <div className={cn(
          "flex w-16 h-24 flex-shrink-0 items-center justify-center rounded-lg overflow-hidden",
          isSelected ? "bg-primary/20" : "bg-secondary"
        )}>
          {book.coverUrl ? (
            <img 
              src={book.coverUrl} 
              alt={`Portada de ${book.title}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Si la imagen falla al cargar, mostrar el ícono placeholder
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <BookOpen className={cn(
            "h-8 w-8",
            isSelected ? "text-primary" : "text-muted-foreground",
            book.coverUrl ? "hidden" : ""
          )} />
        </div>
        
        {/* Book info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">
            {book.title}
          </h3>
          {book.author && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
              {book.author}
            </p>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-primary">
                  {book.count ?? 0} {(book.count ?? 0) === 1 ? t.export?.singleBook?.note || 'nota' : t.export?.singleBook?.notes || 'notas'}
                </span>
              </div>
              
              {/* Botón de exportación - Integrado en el diseño */}
              <Button
                onClick={handleQuickExport}
                disabled={!canExportBook || isExporting}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                title={!canExportBook ? t.export?.singleBook?.limitReached || "Limit reached - Sign up" : t.export?.singleBook?.exportButton || "Export notes"}
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Mostrar colecciones si está autenticado */}
            {isAuthenticated && bookCollections.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Folder className="h-3 w-3" />
                <span className="truncate">
                  {bookCollections.map(c => c.name).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

    </motion.div>
  );
}

