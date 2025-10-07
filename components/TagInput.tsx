"use client";

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { searchTags, createTag } from '@/lib/tags-helpers';
import type { Tag } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TagInputProps {
  onTagSelect: (tag: Tag) => void;
  excludeTagIds?: string[];
  placeholder?: string;
}

/**
 * Input con autocompletado para buscar y crear etiquetas
 */
export function TagInput({ onTagSelect, excludeTagIds = [], placeholder = "Buscar o crear etiqueta..." }: TagInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Buscar etiquetas mientras el usuario escribe
  useEffect(() => {
    // Solo buscar si el dropdown está visible
    if (!showSuggestions) return;

    const search = async () => {
      setIsLoading(true);
      try {
        // Si no hay query, mostrar todas las etiquetas
        const searchQuery = query.trim().length === 0 ? '' : query;
        const results = await searchTags(searchQuery);
        // Filtrar las etiquetas ya seleccionadas
        const filtered = results.filter(tag => !excludeTagIds.includes(tag.id));
        setSuggestions(filtered);
      } catch (error) {
        console.error('Error searching tags:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Sin debounce si el campo está vacío (búsqueda inicial)
    if (query.trim().length === 0) {
      search();
    } else {
      const debounce = setTimeout(search, 300);
      return () => clearTimeout(debounce);
    }
  }, [query, excludeTagIds, showSuggestions]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTag = (tag: Tag) => {
    onTagSelect(tag);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleCreateTag = async () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0 || trimmedQuery.length > 50) {
      return;
    }

    setIsCreating(true);
    try {
      const newTag = await createTag(trimmedQuery);
      handleSelectTag(newTag);
    } catch (error) {
      console.error('Error creating tag:', error);
      alert(error instanceof Error ? error.message : 'Could not create tag');
    } finally {
      setIsCreating(false);
    }
  };

  const exactMatch = suggestions.some(tag => tag.name.toLowerCase() === query.toLowerCase());
  const showCreateOption = query.trim().length > 0 && !exactMatch && !isLoading;

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className="pl-9"
          maxLength={50}
        />
      </div>

      {/* Dropdown de sugerencias */}
      {showSuggestions && (suggestions.length > 0 || showCreateOption || (query.length === 0 && !isLoading)) && (
        <div
          ref={dropdownRef}
          className="absolute z-[100] w-full mt-1 bg-popover border border-border rounded-lg shadow-xl max-h-64 overflow-y-auto"
          style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
        >
          {/* Sugerencias existentes */}
          {suggestions.length > 0 && (
            <div className="py-1">
              {suggestions.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleSelectTag(tag)}
                  className="w-full px-4 py-2.5 text-left hover:bg-accent transition-colors flex items-center justify-between group border-b border-border/50 last:border-0"
                >
                  <span className="font-medium text-sm">{tag.name}</span>
                  {tag.highlight_count !== undefined && tag.highlight_count > 0 && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {tag.highlight_count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Opción para crear nueva */}
          {showCreateOption && (
            <div className={cn("py-1", suggestions.length > 0 && "border-t border-border bg-muted/30")}>
              <button
                onClick={handleCreateTag}
                disabled={isCreating}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-2",
                  "text-primary font-medium text-sm",
                  isCreating && "opacity-50 cursor-not-allowed"
                )}
              >
                <Plus className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Crear "{query.trim()}"</span>
              </button>
            </div>
          )}

          {/* Mensajes informativos - Solo mostrar si NO hay opción de crear */}
          {!showCreateOption && (
            <>
              {isLoading && suggestions.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-muted-foreground">Buscando etiquetas...</p>
                </div>
              )}
              
              {!isLoading && suggestions.length === 0 && query.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-muted-foreground">No tienes etiquetas aún</p>
                  <p className="text-xs text-muted-foreground mt-1">Escribe para crear una nueva</p>
                </div>
              )}
              
              {!isLoading && suggestions.length === 0 && query.length > 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-muted-foreground">No se encontraron etiquetas con ese nombre</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

