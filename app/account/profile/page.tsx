'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, BookOpen, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getLibrary } from '@/lib/supabase-helpers';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ books: 0, highlights: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const library = await getLibrary();
      setStats({
        books: library.books.length,
        highlights: library.highlights.length,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const joinedDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Fecha desconocida';

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t.profile?.title || 'Mi Perfil'}</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.email?.split('@')[0]}</h2>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.books}</p>
                <p className="text-sm text-muted-foreground">{t.profile?.books || 'Libros'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.highlights}</p>
                <p className="text-sm text-muted-foreground">{t.profile?.highlights || 'Highlights'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h3 className="font-semibold mb-4">{t.profile?.accountInfo || 'Información de la cuenta'}</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t.profile?.memberSince || 'Miembro desde'}</p>
                  <p className="text-sm text-muted-foreground">{joinedDate}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t.profile?.email || 'Email'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                {t.profile?.change || 'Cambiar'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

