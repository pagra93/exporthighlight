"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tag as TagIcon, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TagInput } from './TagInput';
import { TagBadge } from './TagBadge';
import { getHighlightTags, addTagToHighlight, removeTagFromHighlight } from '@/lib/tags-helpers';
import type { Tag } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ManageTagsDropdownProps {
  highlightId: string;
  onTagsChange?: () => void;
}

/**
 * Dropdown para gestionar las etiquetas de un highlight
 * Permite añadir y quitar etiquetas (máximo 10)
 */
export function ManageTagsDropdown({ highlightId, onTagsChange }: ManageTagsDropdownProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Cargar etiquetas del highlight
  useEffect(() => {
    if (isOpen) {
      loadTags();
    }
  }, [isOpen, highlightId]);

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const highlightTags = await getHighlightTags(highlightId);
      setTags(highlightTags);
    } catch (error) {
      console.error('Error loading tags:', error);
      toast({
        title: t.common?.error || 'Error',
        description: t.tags?.errors?.loadTags || 'Could not load tags',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async (tag: Tag) => {
    // Verificar límite de 10
    if (tags.length >= 10) {
      toast({
        title: t.tags?.limitReached || 'Limit reached',
        description: t.tags?.maxTagsPerHighlight || 'Maximum 10 tags per highlight',
        variant: "destructive",
      });
      return;
    }

    try {
      await addTagToHighlight(highlightId, tag.id);
      setTags([...tags, tag]);
      onTagsChange?.();
      toast({
        title: t.tags?.tagAdded || 'Tag added',
        description: `"${tag.name}" ${t.tags?.tagAddedDescription || 'added to highlight'}`,
      });
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: t.common?.error || 'Error',
        description: error instanceof Error ? error.message : t.tags?.couldNotAddTag || 'Could not add tag',
        variant: "destructive",
      });
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    try {
      await removeTagFromHighlight(highlightId, tagId);
      setTags(tags.filter(t => t.id !== tagId));
      onTagsChange?.();
      toast({
        title: t.tags?.tagRemoved || 'Tag removed',
        description: tag ? `"${tag.name}" ${t.tags?.tagRemovedDescription || 'removed from highlight'}` : undefined,
      });
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: t.common?.error || 'Error',
        description: t.tags?.couldNotRemoveTag || 'Could not remove tag',
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
        >
          <TagIcon className="h-3.5 w-3.5" />
          {tags.length > 0 ? (
            <span>{tags.length} {tags.length === 1 ? t.tags?.tag || 'tag' : t.tags?.tags || 'tags'}</span>
          ) : (
            <span>{t.tags?.addTag || 'Add tag'}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-0" align="start" sideOffset={8}>
        <div className="flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-muted/30">
            <h4 className="font-semibold text-sm">{t.tags?.manageTags || 'Manage tags'}</h4>
          </div>

          {/* Input para añadir/buscar etiqueta - Siempre visible arriba */}
          {tags.length < 10 && (
            <div className="px-4 py-3 border-b bg-background sticky top-0 z-10">
              <TagInput
                onTagSelect={handleAddTag}
                excludeTagIds={tags.map(t => t.id)}
                placeholder={t.tags?.searchOrCreateTag || 'Search or create tag...'}
              />
            </div>
          )}

          {/* Etiquetas actuales */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : tags.length > 0 ? (
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-3">
                  {t.tags?.appliedTags || 'Applied tags'} ({tags.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <TagBadge
                      key={tag.id}
                      name={tag.name}
                      removable
                      onRemove={() => handleRemoveTag(tag.id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center py-8">
                <p className="text-sm text-muted-foreground">
                  {t.tags?.noTagsYet || 'No tags yet'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.tags?.searchOrCreateAbove || 'Search or create a tag above'}
                </p>
              </div>
            )}
          </div>

          {/* Footer con límite si está cerca */}
          {tags.length >= 8 && (
            <div className="px-4 py-2 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                {10 - tags.length} {10 - tags.length === 1 ? t.tags?.tagRemaining || 'tag remaining' : t.tags?.tagsRemaining || 'tags remaining'}
              </p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

