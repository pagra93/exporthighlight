"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FolderPlus, Check, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserCollections, addBookToCollection, removeBookFromCollection, getBookCollections } from '@/lib/collections-helpers';
import { CollectionModal } from '@/components/CollectionModal';
import type { Collection } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddToCollectionDropdownProps {
  bookId: string;
  bookTitle?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  onCollectionChange?: () => void; // Para recargar colecciones en el sidebar
}

export function AddToCollectionDropdown({ 
  bookId, 
  bookTitle,
  variant = 'outline',
  size = 'default',
  onCollectionChange
}: AddToCollectionDropdownProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [bookCollectionIds, setBookCollectionIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, bookId]);

  // Debug: mostrar info cuando cambian las colecciones del libro
  useEffect(() => {
    console.log('📚 BookCollections cargadas para libro:', bookId);
    console.log('📚 IDs de colecciones:', Array.from(bookCollectionIds));
  }, [bookCollectionIds]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [allCollections, bookColls] = await Promise.all([
        getUserCollections(),
        getBookCollections(bookId),
      ]);
      
      console.log('🔍 Todas las colecciones:', allCollections);
      console.log('🔍 Colecciones del libro:', bookColls);
      
      setCollections(allCollections);
      setBookCollectionIds(new Set(bookColls.map(c => c.id)));
    } catch (error) {
      console.error('❌ Error loading collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCollection = async (collectionId: string, isCurrentlyIn: boolean) => {
    try {
      if (isCurrentlyIn) {
        await removeBookFromCollection(collectionId, bookId);
        setBookCollectionIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(collectionId);
          return newSet;
        });
        toast({
          title: t.account?.removed || 'Removed',
          description: t.account?.removedDescription || 'Book removed from collection',
        });
      } else {
        await addBookToCollection(collectionId, bookId);
        setBookCollectionIds(prev => new Set([...prev, collectionId]));
        toast({
          title: t.account?.added || 'Added',
          description: t.account?.addedDescription || 'Book added to collection',
        });
      }
      
      // Recargar colecciones y notificar cambio
      loadData();
      if (onCollectionChange) {
        onCollectionChange();
      }
      
      // Disparar evento global para que las cards se actualicen
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('collectionsUpdated'));
      }
    } catch (error) {
      toast({
        title: t.common?.error || 'Error',
        description: error instanceof Error ? error.message : t.account?.errorUpdatingCollection || 'Error updating collection',
        variant: "destructive",
      });
    }
  };

  const handleNewCollectionSuccess = () => {
    loadData(); // Recargar lista
    if (onCollectionChange) {
      onCollectionChange();
    }
    
    // Disparar evento global
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('collectionsUpdated'));
    }
  };

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <FolderPlus className="h-4 w-4" />
        {t.account?.addToCollection || 'Add to collection'}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown content */}
          <div className="absolute right-0 top-full mt-2 w-72 bg-background border border-border rounded-lg shadow-xl z-50 overflow-hidden">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {t.account?.loading || 'Loading...'}
              </div>
            ) : collections.length === 0 ? (
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-3 text-center">
                  {t.account?.noCollectionsYet || 'You don\'t have collections yet'}
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    setShowNewCollectionModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.account?.createFirstCollection || 'Create first collection'}
                </Button>
              </div>
            ) : (
              <>
                <div className="max-h-80 overflow-y-auto p-2">
                  {collections.map((collection) => {
                    const isInCollection = bookCollectionIds.has(collection.id);
                    return (
                      <button
                        key={collection.id}
                        onClick={() => toggleCollection(collection.id, isInCollection)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                          style={{ backgroundColor: collection.color + '20' }}
                        >
                          {collection.icon}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-sm truncate">{collection.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {collection.book_count || 0} {t.account?.books || 'books'}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {isInCollection ? (
                            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded border-2 border-muted-foreground" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {/* Nueva colección */}
                <div className="border-t border-border p-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowNewCollectionModal(true);
                    }}
                    className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    {t.account?.newCollection || 'New collection'}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Modal de nueva colección */}
      <CollectionModal
        isOpen={showNewCollectionModal}
        onClose={() => setShowNewCollectionModal(false)}
        onSuccess={handleNewCollectionSuccess}
      />
    </div>
  );
}

