"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Trash2, Download, Plus, Upload, Lock, X, Folder } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { getLibrary, deleteBook } from '@/lib/supabase-helpers';
import { exportAllBooks } from '@/lib/exportZip';
import { BooksGrid } from '@/components/BooksGrid';
import { HighlightsTable } from '@/components/HighlightsTable';
import type { Book, Highlight, Collection } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useExportSettings } from '@/contexts/ExportSettingsContext';
import { useExportLimit } from '@/contexts/ExportLimitContext';
import { ExportLimitBanner } from '@/components/ExportLimitBanner';
import { ExportLimitModal } from '@/components/ExportLimitModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthModal } from '@/components/AuthModal';
import { createPortal } from 'react-dom';
import { AddToCollectionDropdown } from '@/components/AddToCollectionDropdown';
import { getCollectionBooks, getBookCollections } from '@/lib/collections-helpers';
import { getHighlightsByTag } from '@/lib/tags-helpers';
import { MetadataEnricher } from '@/components/MetadataEnricher';
import { supabase } from '@/lib/supabaseClient';

export default function AccountPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const [books, setBooks] = useState<Book[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitModalTrigger, setLimitModalTrigger] = useState<'after-export' | 'limit-reached'>('after-export');
  const { toast } = useToast();
  const { settings } = useExportSettings();
  const { canExport, incrementCount, isLimitReached, remainingExports } = useExportLimit();
  const [filteredCollectionId, setFilteredCollectionId] = useState<string | null>(null);
  const [filteredCollectionName, setFilteredCollectionName] = useState<string | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [filteredTagId, setFilteredTagId] = useState<string | null>(null);
  const [filteredTagName, setFilteredTagName] = useState<string | null>(null);
  const [filteredHighlights, setFilteredHighlights] = useState<Highlight[]>([]);
  const [selectedBookCollections, setSelectedBookCollections] = useState<Collection[]>([]);
  const [showMetadataEnricher, setShowMetadataEnricher] = useState(true);

  // Función para exportar un libro a Markdown con configuración del usuario
  const exportBookToMarkdown = (book: Book, bookHighlights: Highlight[]) => {
    let markdown = `# ${book.title}\n\n`;
    
    if (book.author) {
      markdown += `**Autor:** ${book.author}\n\n`;
    }
    
    markdown += `---\n\n`;
    
    bookHighlights.forEach((highlight, index) => {
      if (settings.exportStyle === 'compact') {
        // Estilo compacto: Todo en una línea
        markdown += `> ${highlight.text}`;
        
        const metadata = [];
        if (settings.includeLocation && highlight.location) {
          metadata.push(`📍${highlight.location}`);
        }
        if (settings.includeDate && highlight.addedAt) {
          const date = new Date(highlight.addedAt);
          metadata.push(`📅${date.toLocaleDateString('es-ES')}`);
        }
        
        if (metadata.length > 0) {
          markdown += ` [${metadata.join(' • ')}]`;
        }
        markdown += '\n\n';
        
        if (settings.includePersonalNotes && highlight.note) {
          markdown += `💭 *${highlight.note}*\n\n`;
        }
      } else {
        // Estilo detallado: Información separada
        markdown += `> ${highlight.text}\n\n`;
        
        if (settings.includePersonalNotes && highlight.note) {
          markdown += `**Nota:** *${highlight.note}*\n\n`;
        }
        
        const metadata = [];
        if (settings.includeLocation && highlight.location) {
          metadata.push(`**Ubicación:** ${highlight.location}`);
        }
        if (settings.includeDate && highlight.addedAt) {
          const date = new Date(highlight.addedAt);
          metadata.push(`**Fecha:** ${date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}`);
        }
        
        if (metadata.length > 0) {
          markdown += metadata.join(' • ') + '\n\n';
        }
        
        markdown += '---\n\n';
      }
    });
    
    return markdown;
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadLibrary();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Escuchar cambios en query params para filtros
  useEffect(() => {
    const tagId = searchParams.get('tag');
    const tagName = searchParams.get('name');
    const collectionId = searchParams.get('collection');
    const collectionName = searchParams.get('name');

    // Priorizar filtro por tag
    if (tagId && tagName) {
      setFilteredTagId(tagId);
      setFilteredTagName(decodeURIComponent(tagName));
      setFilteredCollectionId(null);
      setFilteredCollectionName(null);
      setFilteredBooks([]);
      loadTagHighlights(tagId);
    } else if (collectionId && collectionName) {
      setFilteredCollectionId(collectionId);
      setFilteredCollectionName(decodeURIComponent(collectionName));
      setFilteredTagId(null);
      setFilteredTagName(null);
      setFilteredHighlights([]);
      loadCollectionBooks(collectionId);
    } else {
      // Sin filtros
      setFilteredCollectionId(null);
      setFilteredCollectionName(null);
      setFilteredTagId(null);
      setFilteredTagName(null);
      setFilteredBooks([]);
      setFilteredHighlights([]);
    }
  }, [searchParams]);

  const loadCollectionBooks = async (collectionId: string) => {
    try {
      const collectionBooks = await getCollectionBooks(collectionId);
      setFilteredBooks(collectionBooks);
    } catch (error) {
      console.error('Error loading collection books:', error);
      toast({
        title: t.common?.error || "Error",
        description: t.account?.errors?.loadCollectionBooks || 'Could not load collection books',
        variant: "destructive",
      });
    }
  };

  const loadTagHighlights = async (tagId: string) => {
    try {
      const tagHighlights = await getHighlightsByTag(tagId);
      setFilteredHighlights(tagHighlights);
      
      // Extraer libros únicos de los highlights
      const uniqueBookIds = [...new Set(tagHighlights.map(h => h.bookId))];
      const tagBooks = books.filter(b => uniqueBookIds.includes(b.id));
      setFilteredBooks(tagBooks);
    } catch (error) {
      console.error('Error loading tag highlights:', error);
      toast({
        title: t.common?.error || "Error",
        description: t.account?.errors?.loadTagHighlights || "No se pudieron cargar los highlights de la etiqueta",
        variant: "destructive",
      });
    }
  };

  const clearFilter = () => {
    router.push('/account');
  };

  const loadLibrary = async () => {
    try {
      const library = await getLibrary();
      setBooks(library.books);
      setHighlights(library.highlights);
    } catch (error) {
      console.error('Error loading library:', error);
      toast({
        title: t.account?.errors?.loadLibrary || 'Error loading library',
        description: error instanceof Error ? error.message : t.account?.errors?.unknown || 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar colecciones del libro seleccionado
  useEffect(() => {
    if (selectedBook && isAuthenticated) {
      loadSelectedBookCollections();
    } else {
      setSelectedBookCollections([]);
    }
  }, [selectedBook, isAuthenticated]);

  const loadSelectedBookCollections = async () => {
    if (!selectedBook) return;
    try {
      const collections = await getBookCollections(selectedBook.id);
      setSelectedBookCollections(collections);
    } catch (error) {
      console.error('Error loading book collections:', error);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book and all its notes?')) {
      return;
    }

    try {
      await deleteBook(bookId);
      toast({
        title: t.account?.success?.bookDeleted || "Libro borrado",
        description: t.account?.success?.bookDeletedDescription || "El libro ha sido eliminado de tu biblioteca",
      });
      await loadLibrary();
      setSelectedBook(null);
    } catch (error) {
      toast({
        title: t.account?.errors?.deleteBook || 'Delete error',
        description: error instanceof Error ? error.message : t.account?.errors?.unknown || 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const handleExportAll = async () => {
    try {
      await exportAllBooks(books, highlights);
      toast({
        title: t.export?.singleBook?.successTitle || 'Exported successfully!',
        description: `${books.length} ${t.export?.allBooks?.books || 'books'} ${t.export?.allBooks?.successDescription || 'exported in a ZIP file.'}`,
      });
    } catch (error) {
      toast({
        title: t.account?.errors?.export || 'Export error',
        description: error instanceof Error ? error.message : t.account?.errors?.unknown || 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const handleEnrichedBooks = async (enrichedBooks: Book[]) => {
    try {
      // Actualizar en Supabase
      for (const book of enrichedBooks) {
        if (book.coverUrl) {
          await supabase
            .from('books')
            .update({ 
              cover_url: book.coverUrl,
              author: book.author
            })
            .eq('id', book.id)
            .eq('user_id', user?.id);
        }
      }

      // Actualizar estado local - FUSIONAR los cambios en lugar de reemplazar
      setBooks(prevBooks => {
        const updatedBooks = [...prevBooks];
        
        // Para cada libro enriquecido, actualizar el libro correspondiente en el estado
        enrichedBooks.forEach(enrichedBook => {
          const index = updatedBooks.findIndex(b => b.id === enrichedBook.id);
          if (index !== -1) {
            updatedBooks[index] = {
              ...updatedBooks[index],
              coverUrl: enrichedBook.coverUrl,
              author: enrichedBook.author
            };
          }
        });
        
        return updatedBooks;
      });
      
      setShowMetadataEnricher(false);
      
      toast({
        title: t.account?.success?.metadataUpdated || 'Metadata updated!',
        description: t.account?.success?.coversAdded || 'Covers have been added successfully',
      });
    } catch (error) {
      console.error('Error updating books:', error);
      toast({
        title: t.account?.errors?.update || 'Update error',
        description: t.account?.errors?.updateDescription || 'Could not save changes',
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">{t.account?.loadingLibrary || 'Loading library...'}</p>
      </div>
    );
  }

  const selectedHighlights = selectedBook
    ? highlights.filter(h => h.bookId === selectedBook.id)
    : [];

  // Determinar qué libros mostrar
  const displayBooks = filteredCollectionId ? filteredBooks : books;

  return (
    <>
      {/* Banner de límite de exportaciones */}
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
        trigger={limitModalTrigger}
      />

      {/* Modal de autenticación */}
      {typeof window !== 'undefined' && !isAuthenticated && showAuthModal && (
        <div className="fixed inset-0 z-[10000]">
          {require('react-dom').createPortal(
            <AuthModal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              onSuccess={() => {
                setShowAuthModal(false);
                toast({
                  title: t.account?.welcome || "Bienvenido",
                  description: t.account?.unlimitedExports || "Ahora tienes exportaciones ilimitadas",
                });
              }}
            />,
            document.body
          )}
        </div>
      )}

      <div className="p-8">
      {/* Header - Solo cuando NO hay libro seleccionado */}
      {!selectedBook && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t.account?.myBooks || 'My Books'}</h1>
              <p className="text-muted-foreground">
                {displayBooks.length} {displayBooks.length === 1 ? t.account?.stats?.books?.slice(0, -1) || 'book' : t.account?.stats?.books || 'books'} 
                {!filteredCollectionId && !filteredTagId && ` · ${highlights.length} ${t.account?.stats?.highlights || 'highlights'}`}
                {filteredTagId && ` · ${filteredHighlights.length} ${t.account?.stats?.highlights || 'highlights'} with this tag`}
              </p>
            </div>
            
            <Button 
              onClick={() => router.push('/')} 
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Upload className="h-5 w-5" />
              {t.account?.uploadNewFile || 'Subir nuevo archivo'}
            </Button>
          </div>

          {/* Metadata Enricher - Debajo del título */}
          {showMetadataEnricher && displayBooks.length > 0 && !filteredCollectionId && !filteredTagId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <MetadataEnricher 
                books={displayBooks}
                onEnriched={handleEnrichedBooks}
              />
            </motion.div>
          )}

          {/* Filtro activo badge */}
          {(filteredCollectionId || filteredTagId) && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between">
              <p className="text-sm">
                {filteredCollectionId ? (
                  <>{t.account?.filters?.showingCollection || 'Showing books from collection'} <span className="font-semibold">{filteredCollectionName}</span></>
                ) : (
                  <>{t.account?.filters?.showingTag || 'Showing highlights with tag'} <span className="font-semibold">{filteredTagName}</span></>
                )}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilter}
                className="gap-2 h-8"
              >
                <X className="h-4 w-4" />
                Ver todos
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Solo mostrar cuando NO hay libro seleccionado */}
      {!selectedBook && displayBooks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-12 text-center border-2 border-dashed border-primary/30"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t.account?.emptyLibrary?.title || 'Your library is empty'}</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {t.account?.emptyLibrary?.description || 'Sube tu primer archivo My Clippings.txt para comenzar a organizar tus notas de Kindle'}
          </p>
          <Button 
            onClick={() => router.push('/')}
            size="lg"
            className="gap-2"
          >
            <Upload className="h-5 w-5" />
            {t.account?.emptyLibrary?.uploadButton || 'Subir archivo'}
          </Button>
        </motion.div>
      ) : !selectedBook ? (
        <>
          {/* Stats - Solo cuando NO hay libro seleccionado */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-6 mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{formatNumber(displayBooks.length)}</p>
                <p className="text-sm text-muted-foreground">
                  {filteredCollectionId 
                    ? 'en esta colección' 
                    : filteredTagId 
                    ? `con esta etiqueta` 
                    : (displayBooks.length === 1 ? t.account?.stats?.books?.slice(0, -1) || 'Libro' : t.account?.stats?.books || 'Libros')}
                </p>
              </div>
            </div>
            
            {!filteredCollectionId && !filteredTagId && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{formatNumber(highlights.length)}</p>
                  <p className="text-sm text-muted-foreground">
                    {highlights.length === 1 ? t.account?.stats?.notes?.slice(0, -1) || 'Nota' : t.account?.stats?.notes || 'Notas'}
                  </p>
                </div>
              </div>
            )}

            {/* Contador de highlights filtrados por tag */}
            {filteredTagId && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{formatNumber(filteredHighlights.length)}</p>
                  <p className="text-sm text-muted-foreground">
                    {filteredHighlights.length === 1 ? t.account?.stats?.highlights?.slice(0, -1) || 'Highlight' : t.account?.stats?.highlights || 'Highlights'}
                  </p>
                </div>
              </div>
            )}

          </motion.div>

          {/* Lista de libros */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">{t.account?.yourBooks || 'Tus libros'}</h2>
              <Button 
                onClick={() => {
                  if (!canExport) {
                    setLimitModalTrigger('limit-reached');
                    setShowLimitModal(true);
                    return;
                  }

                  // Incrementar contador antes de exportar
                  if (!isAuthenticated) {
                    incrementCount();
                    
                    // Mostrar modal después de exportar
                    if (remainingExports <= 1) {
                      setTimeout(() => {
                        setLimitModalTrigger('after-export');
                        setShowLimitModal(true);
                      }, 1000);
                    }
                  }

                  handleExportAll();
                }}
                className="gap-2"
                disabled={!canExport}
                title={!canExport ? 'Límite alcanzado. Regístrate para exportaciones ilimitadas' : ''}
              >
                {!canExport ? (
                  <>
                    <Lock className="h-5 w-5" />
                    {t.account?.loginToExport || 'Límite alcanzado'}
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    {t.account?.exportAllZip || 'Exportar todos (ZIP)'}
                  </>
                )}
              </Button>
            </div>
            <BooksGrid
              books={displayBooks}
              onBookSelect={setSelectedBook}
              highlights={highlights}
            />
          </div>
        </>
      ) : (
        // Vista de libro individual
        <div className="space-y-6">
          {/* Book header - Limpio y simple */}
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedBook(null)}
              className="mb-4 -ml-4"
            >
              ← {t.nav?.backToBooks || 'Volver a todos los libros'}
            </Button>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{selectedBook.title}</h2>
                {selectedBook.author && (
                  <p className="text-lg text-muted-foreground mb-2">
                    {selectedBook.author}
                  </p>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {/* Colecciones */}
                  {selectedBookCollections.length > 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        <span>{selectedBookCollections.map(c => c.name).join(', ')}</span>
                      </div>
                      <span>·</span>
                    </>
                  )}
                  {/* Número de notas */}
                  <p>
                    {selectedHighlights.length} {selectedHighlights.length === 1 ? t.account?.stats?.notes?.slice(0, -1) || 'nota' : t.account?.stats?.notes || 'notas'}
                  </p>
                </div>
              </div>
              <AddToCollectionDropdown 
                bookId={selectedBook.id}
                bookTitle={selectedBook.title}
                onCollectionChange={() => {
                  // Recargar sidebar y colecciones del libro
                  loadSelectedBookCollections();
                  if (typeof window !== 'undefined' && (window as any).reloadSidebarCollections) {
                    (window as any).reloadSidebarCollections();
                  }
                }}
              />
            </div>
          </div>

          {/* Highlights Table con su propio buscador y botones */}
          <HighlightsTable 
            highlights={selectedHighlights}
            isAuthenticated={isAuthenticated}
            onCopyMarkdown={() => {
              const markdown = exportBookToMarkdown(selectedBook, selectedHighlights);
              navigator.clipboard.writeText(markdown);
              setIsCopied(true);
              toast({
                title: "¡Copiado!",
                description: t.account?.copyNotes || "Notas copiadas al portapapeles",
              });
              setTimeout(() => setIsCopied(false), 3000);
            }}
            onDownloadMarkdown={() => {
              const markdown = exportBookToMarkdown(selectedBook, selectedHighlights);
              const blob = new Blob([markdown], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${selectedBook.title.replace(/[^a-z0-9]/gi, '_')}.md`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              toast({
                title: "¡Descargado!",
                description: t.account?.downloadMarkdown || "Archivo Markdown descargado",
              });
            }}
            isCopied={isCopied}
          />

          {/* Botón de borrar al final - Menos peligroso */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-destructive mb-1">{t.account?.dangerousZone || 'Zona peligrosa'}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.account?.deleteBookDescription || 'Esta acción eliminará el libro y todas sus notas de forma permanente'}
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (confirm(`¿Estás seguro de que deseas borrar "${selectedBook.title}" y todas sus ${selectedHighlights.length} notas?\n\nEsta acción no se puede deshacer.`)) {
                    handleDeleteBook(selectedBook.id);
                  }
                }}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t.account?.deleteBook || 'Borrar libro completo'}
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

