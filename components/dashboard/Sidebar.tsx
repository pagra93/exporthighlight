'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Search, User, Settings, Plus, Tag as TagIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { getUserCollections } from '@/lib/collections-helpers';
import { getUserTags } from '@/lib/tags-helpers';
import { CollectionModal } from '@/components/CollectionModal';
import type { Collection, Tag } from '@/lib/types';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  const menuItems = [
    {
      icon: BookOpen,
      label: t.nav.myBooks,
      href: '/account',
      active: pathname === '/account' || pathname === '/account/books',
    },
    {
      icon: TagIcon,
      label: t.nav.tags,
      href: '/account/tags',
      active: pathname === '/account/tags',
    },
    {
      icon: Search,
      label: t.nav.search,
      href: '/account/search',
      active: pathname === '/account/search',
    },
    {
      icon: User,
      label: t.nav.myProfile,
      href: '/account/profile',
      active: pathname === '/account/profile',
    },
    {
      icon: Settings,
      label: t.nav.settings,
      href: '/account/settings',
      active: pathname === '/account/settings',
    },
  ];

  // Cargar colecciones y etiquetas
  useEffect(() => {
    loadCollections();
    loadTags();
  }, []);

  const loadCollections = async () => {
    try {
      setIsLoadingCollections(true);
      const data = await getUserCollections();
      setCollections(data);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setIsLoadingCollections(false);
    }
  };

  const loadTags = async () => {
    try {
      setIsLoadingTags(true);
      const data = await getUserTags();
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleCollectionSuccess = () => {
    loadCollections(); // Recargar lista
  };

  // Exponer función para recargar desde fuera
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).reloadSidebarCollections = loadCollections;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).reloadSidebarCollections;
      }
    };
  }, []);


  return (
    <aside className="w-64 border-r border-border bg-card h-screen sticky top-0 flex flex-col">

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Colecciones */}
      <div className="px-4 pb-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t.nav.collections}
          </h3>
          <button
            onClick={() => setShowCollectionModal(true)}
            className="h-6 w-6 rounded flex items-center justify-center hover:bg-muted transition-colors"
            title={t.nav.newCollection}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {isLoadingCollections ? (
          <div className="text-xs text-muted-foreground px-4 py-2">
            {t.common.loading}
          </div>
        ) : collections.length === 0 ? (
          <button
            onClick={() => setShowCollectionModal(true)}
            className="w-full text-left text-xs text-muted-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            Crear primera colección
          </button>
        ) : (
          <div className="space-y-1">
            {collections.map((collection) => {
              const isActive = pathname === '/account' && typeof window !== 'undefined' && 
                new URLSearchParams(window.location.search).get('collection') === collection.id;
              return (
                <Link
                  key={collection.id}
                  href={`/account?collection=${collection.id}&name=${encodeURIComponent(collection.name)}`}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: collection.color + '20' }}
                  >
                    {collection.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{collection.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {collection.book_count || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Etiquetas */}
      <div className="px-4 pb-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t.nav.tags}
          </h3>
          <button
            onClick={() => router.push('/account/tags')}
            className="h-6 w-6 rounded flex items-center justify-center hover:bg-muted transition-colors"
            title={t.nav.manageTags}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {isLoadingTags ? (
          <div className="text-xs text-muted-foreground px-4 py-2">
            {t.common.loading}
          </div>
        ) : tags.length === 0 ? (
          <button
            onClick={() => router.push('/account/tags')}
            className="w-full text-left text-xs text-muted-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            Crear primera etiqueta
          </button>
        ) : (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {tags.slice(0, 10).map((tag) => {
              const isActive = pathname === '/account/tags' && typeof window !== 'undefined' && 
                new URLSearchParams(window.location.search).get('tag') === tag.id;
              return (
                <Link
                  key={tag.id}
                  href={`/account/tags?tag=${tag.id}`}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="truncate text-sm font-medium">{tag.name}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {tag.highlight_count || 0}
                  </span>
                </Link>
              );
            })}
            {tags.length > 10 && (
              <button
                onClick={() => router.push('/account/tags')}
                className="w-full text-center text-xs text-primary px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                Ver todas ({tags.length})
              </button>
            )}
          </div>
        )}
      </div>


      {/* Modal de colecciones */}
      <CollectionModal
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        onSuccess={handleCollectionSuccess}
      />
    </aside>
  );
}

