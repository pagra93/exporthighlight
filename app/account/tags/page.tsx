"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag as TagIcon, FileText, Trash2, Download, Plus, Loader2, Search, X, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { 
  getUserTags, 
  createTag, 
  deleteTag, 
  getHighlightsByTagGroupedByBook 
} from '@/lib/tags-helpers';
import type { Tag, Highlight, Book } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { formatNumber, sanitizeFilename } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TagBadge } from '@/components/TagBadge';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TagsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [highlightsByBook, setHighlightsByBook] = useState<{ book: Book; highlights: Highlight[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadTags();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const userTags = await getUserTags();
      setTags(userTags);
    } catch (error) {
      console.error('Error loading tags:', error);
      toast({
        title: t.tags?.errors?.loadTags || "Error al cargar etiquetas",
        description: error instanceof Error ? error.message : t.tags?.errors?.unknown || "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar etiqueta desde URL
  useEffect(() => {
    const tagIdFromUrl = searchParams.get('tag');
    if (tagIdFromUrl && tags.length > 0 && !selectedTag) {
      const tagToSelect = tags.find(t => t.id === tagIdFromUrl);
      if (tagToSelect) {
        // Auto-seleccionar la etiqueta de la URL
        setSelectedTag(tagToSelect);
        loadTagHighlights(tagToSelect.id);
      }
    }
  }, [searchParams, tags]);

  const loadTagHighlights = async (tagId: string) => {
    setIsLoading(true);
    try {
      const grouped = await getHighlightsByTagGroupedByBook(tagId);
      setHighlightsByBook(grouped);
    } catch (error) {
      console.error('Error loading highlights:', error);
      toast({
        title: t.tags?.errors?.loadHighlights || "Error al cargar highlights",
        description: error instanceof Error ? error.message : t.tags?.errors?.unknown || "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setIsCreating(true);
    try {
      await createTag(newTagName.trim());
      setNewTagName('');
      await loadTags();
      toast({
        title: t.tags?.success?.tagCreated || "Etiqueta creada",
        description: `La etiqueta "${newTagName.trim()}" ha sido creada`,
      });
    } catch (error) {
      toast({
        title: t.tags?.errors?.createTag || "Error al crear etiqueta",
        description: error instanceof Error ? error.message : t.tags?.errors?.unknown || "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTag = async (tagId: string, tagName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la etiqueta "${tagName}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteTag(tagId);
      await loadTags();
      if (selectedTag?.id === tagId) {
        setSelectedTag(null);
        setHighlightsByBook([]);
      }
      toast({
        title: t.tags?.success?.tagDeleted || "Etiqueta eliminada",
        description: `La etiqueta "${tagName}" ha sido eliminada`,
      });
    } catch (error) {
      toast({
        title: t.tags?.errors?.deleteTag || "Error al eliminar",
        description: error instanceof Error ? error.message : t.tags?.errors?.unknown || "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleTagClick = async (tag: Tag) => {
    setSelectedTag(tag);
    setSearchQuery(''); // Limpiar búsqueda al cambiar de tag
    await loadTagHighlights(tag.id);
    // Actualizar URL
    router.push(`/account/tags?tag=${tag.id}`);
  };

  const handleExportTagHighlights = async () => {
    if (!selectedTag || highlightsByBook.length === 0) return;

    setIsExporting(true);
    try {
      // Generar markdown
      let markdown = `# Highlights con etiqueta: ${selectedTag.name}\n\n`;
      markdown += `**${highlightsByBook.reduce((acc, group) => acc + group.highlights.length, 0)} highlights en ${highlightsByBook.length} libros**\n\n`;
      markdown += `---\n\n`;

      highlightsByBook.forEach((group) => {
        markdown += `## ${group.book.title}\n\n`;
        if (group.book.author) {
          markdown += `**Autor:** ${group.book.author}\n\n`;
        }

        group.highlights.forEach((highlight, index) => {
          let meta = '';
          
          if (highlight.page) {
            meta = `Página ${highlight.page}`;
          } else if (highlight.location) {
            meta = `Ubicación ${highlight.location}`;
          }
          
          if (highlight.addedAt) {
            const date = new Date(highlight.addedAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            meta += meta ? ` • ${date}` : date;
          }
          
          const metaLine = meta ? `**${meta}**\n\n` : '';
          const quote = `> ${highlight.text.trim()}\n\n`;
          const note = highlight.note ? `**Nota:** ${highlight.note.trim()}\n\n` : '';
          
          markdown += `### ${index + 1}\n\n${metaLine}${quote}${note}---\n\n`;
        });

        markdown += `\n\n`;
      });

      // Descargar archivo
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sanitizeFilename(`etiqueta-${selectedTag.name}`)}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "¡Exportado con éxito!",
        description: `${highlightsByBook.reduce((acc, group) => acc + group.highlights.length, 0)} highlights exportados a Markdown`,
      });
    } catch (error) {
      toast({
        title: t.tags?.errors?.export || "Error al exportar",
        description: error instanceof Error ? error.message : t.tags?.errors?.unknown || "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading && tags.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filtrar tags por búsqueda
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtrar highlights por búsqueda (cuando hay tag seleccionado)
  const filteredHighlightsByBook = selectedTag
    ? highlightsByBook.map(group => ({
        ...group,
        highlights: group.highlights.filter(h =>
          h.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (h.note && h.note.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(group => group.highlights.length > 0)
    : [];

  const totalHighlights = selectedTag
    ? highlightsByBook.reduce((acc, group) => acc + group.highlights.length, 0)
    : tags.reduce((acc, tag) => acc + (tag.highlight_count || 0), 0);

  const filteredHighlightsCount = filteredHighlightsByBook.reduce(
    (acc, group) => acc + group.highlights.length,
    0
  );

  return (
    <div className="p-8">
      {/* Header */}
      {!selectedTag && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t.tags?.myTags || 'Mis Etiquetas'}</h1>
              <p className="text-muted-foreground">
                {tags.length} {tags.length === 1 ? 'etiqueta' : 'etiquetas'} · {totalHighlights} {t.tags?.highlightsTagged || 'highlights etiquetados'}
              </p>
            </div>
          </div>

          {/* Formulario para crear nueva etiqueta */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-border mb-8"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {t.tags?.createNewTag || 'Crear nueva etiqueta'}
            </h2>
            <form onSubmit={handleCreateTag} className="flex gap-3">
              <Input
                type="text"
                placeholder={t.tags?.tagNamePlaceholder || "Nombre de la etiqueta (ej: Importante, Para revisar...)"}
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                maxLength={50}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isCreating || !newTagName.trim()}
                className="gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    {t.tags?.create || 'Crear'}
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Buscador */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t.tags?.searchTags || "Buscar etiquetas..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={t.tags?.clearSearch || "Limpiar búsqueda de etiquetas"}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Vista de tag seleccionado */}
      {selectedTag ? (
        <div className="space-y-6">
          {/* Header de tag seleccionado */}
          <div>
            <Button 
              variant="ghost" 
              onClick={() => {
                setSelectedTag(null);
                setHighlightsByBook([]);
                setSearchQuery('');
                router.push('/account/tags');
              }}
              className="mb-4 -ml-4"
            >
              ← {t.tags?.backToTags || 'Volver a todas las etiquetas'}
            </Button>
            
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <TagIcon className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold">{selectedTag.name}</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  {totalHighlights} {totalHighlights === 1 ? 'highlight' : 'highlights'} · {highlightsByBook.length} {highlightsByBook.length === 1 ? 'libro' : 'libros'}
                </p>

                {/* Buscador de highlights */}
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t.tags?.searchInHighlights || "Buscar en highlights..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={t.tags?.clearHighlightSearch || "Limpiar búsqueda"}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleExportTagHighlights}
                  disabled={isExporting || highlightsByBook.length === 0}
                  className="gap-2"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Exportando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      {t.tags?.exportTagHighlights || 'Exportar MD'}
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteTag(selectedTag.id, selectedTag.name)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {t.tags?.deleteTag || 'Eliminar etiqueta'}
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de highlights agrupados por libro */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredHighlightsByBook.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? 'No se encontraron highlights con ese término' : t.tags?.noHighlightsInTag || 'No hay highlights con esta etiqueta'}
            </div>
          ) : (
            <div className="space-y-8">
              {searchQuery && (
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredHighlightsCount} de {totalHighlights} highlights
                </p>
              )}
              
              {filteredHighlightsByBook.map((group) => (
                <motion.div
                  key={group.book.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm"
                >
                  {/* Libro header */}
                  <div className="flex items-start gap-4 mb-6 pb-4 border-b">
                    <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{group.book.title}</h3>
                      {group.book.author && (
                        <p className="text-muted-foreground">{group.book.author}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        {group.highlights.length} {group.highlights.length === 1 ? 'highlight' : 'highlights'}
                      </p>
                    </div>
                  </div>

                  {/* Highlights del libro */}
                  <div className="space-y-4">
                    {group.highlights.map((highlight, index) => (
                      <div 
                        key={highlight.id}
                        className="pl-4 border-l-2 border-primary/30 hover:border-primary transition-colors"
                      >
                        <blockquote className="text-base leading-relaxed mb-2">
                          "{highlight.text}"
                        </blockquote>
                        
                        {highlight.note && (
                          <p className="text-sm text-muted-foreground italic mb-2">
                            💭 {highlight.note}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {highlight.page && (
                            <span>Página {highlight.page}</span>
                          )}
                          {highlight.location && (
                            <span>Ubicación {highlight.location}</span>
                          )}
                          {highlight.addedAt && (
                            <>
                              {(highlight.page || highlight.location) && <span>·</span>}
                              <span>
                                {new Date(highlight.addedAt).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Vista de lista de etiquetas
        <>
          {filteredTags.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-12 text-center border-2 border-dashed border-primary/30"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <TagIcon className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {searchQuery ? 'No se encontraron etiquetas' : t.tags?.noTags || 'No tienes etiquetas aún'}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? 'Intenta con otro término de búsqueda'
                  : 'Crea tu primera etiqueta para organizar tus highlights por temas, proyectos o categorías'
                }
              </p>
              {searchQuery && (
                <Button 
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpiar búsqueda
                </Button>
              )}
            </motion.div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-6">{t.tags?.yourTags || 'Tus etiquetas'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTags.map((tag) => (
                  <motion.div
                    key={tag.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => handleTagClick(tag)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <TagIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {tag.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {tag.highlight_count || 0} {tag.highlight_count === 1 ? 'highlight' : 'highlights'}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTag(tag.id, tag.name);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {t.tags?.createdOn || 'Creada el'} {new Date(tag.created_at || '').toLocaleDateString('es-ES')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

