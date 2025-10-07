"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { createCollection, updateCollection } from '@/lib/collections-helpers';
import type { Collection } from '@/lib/types';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  collection?: Collection; // Si existe, es edición
}

const ICON_OPTIONS = ['📚', '📖', '📕', '📗', '📘', '📙', '💼', '🎨', '🔬', '⚡', '⭐', '🎯', '💡', '🚀'];
const COLOR_OPTIONS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
];

export function CollectionModal({ isOpen, onClose, collection, onSuccess }: CollectionModalProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [selectedIcon, setSelectedIcon] = useState(collection?.icon || '📚');
  const [selectedColor, setSelectedColor] = useState(collection?.color || '#3B82F6');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: t.common?.error || "Error",
        description: t.modals?.collection?.nameRequired || "El nombre es obligatorio",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (collection) {
        // Editar
        await updateCollection(collection.id, {
          name,
          description: description || undefined,
          color: selectedColor,
          icon: selectedIcon,
        });
        toast({
          title: t.modals?.collection?.success?.updated || "Colección actualizada",
          description: `"${name}" se ha actualizado correctamente`,
        });
      } else {
        // Crear
        await createCollection(name, description || undefined, selectedColor, selectedIcon);
        toast({
          title: t.modals?.collection?.success?.created || "Colección creada",
          description: `"${name}" se ha creado correctamente`,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: t.common?.error || "Error",
        description: error instanceof Error ? error.message : t.modals?.collection?.errors?.save || "Error al guardar colección",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 bg-background border border-border rounded-lg shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {collection ? t.modals?.collection?.editTitle || 'Editar colección' : t.modals?.collection?.title || 'Nueva colección'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            aria-label={t.modals?.collection?.close || "Cerrar"}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <Label htmlFor="name">{t.modals?.collection?.name || 'Nombre'} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.modals?.collection?.namePlaceholder || "ej: Ficción, Negocios, Favoritos..."}
              maxLength={100}
              autoFocus
            />
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description">{t.modals?.collection?.description || 'Descripción (opcional)'}</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.modals?.collection?.descriptionPlaceholder || "Describe esta colección..."}
              maxLength={200}
            />
          </div>

          {/* Icono */}
          <div>
            <Label>{t.modals?.collection?.icon || 'Icono'}</Label>
            <div className="grid grid-cols-7 gap-2 mt-2">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`h-10 w-10 rounded-lg text-2xl flex items-center justify-center transition-all ${
                    selectedIcon === icon
                      ? 'bg-primary/20 ring-2 ring-primary scale-110'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <Label>{t.modals?.collection?.color || 'Color'}</Label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-10 w-10 rounded-lg transition-all ${
                    selectedColor === color
                      ? 'ring-2 ring-offset-2 ring-primary scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-2">{t.modals?.collection?.preview || 'Vista previa:'}</p>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: selectedColor + '20' }}
              >
                {selectedIcon}
              </div>
              <div>
                <p className="font-semibold">{name || t.modals?.collection?.previewName || 'Nombre de la colección'}</p>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              {t.modals?.collection?.cancel || 'Cancelar'}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? 'Guardando...' : (collection ? t.modals?.collection?.update || 'Actualizar' : t.modals?.collection?.create || 'Crear')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

