"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useExportLimit } from '@/contexts/ExportLimitContext';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExportLimitBannerProps {
  onRegisterClick: () => void;
}

export function ExportLimitBanner({ onRegisterClick }: ExportLimitBannerProps) {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { count, limit, remainingExports, isLimitReached } = useExportLimit();
  const [isDismissed, setIsDismissed] = useState(false);

  // Verificación de seguridad para las traducciones
  if (!t || !t.exportLimits) {
    return null;
  }

  // No mostrar si está autenticado o si fue cerrado
  if (isAuthenticated || isDismissed) return null;

  // Determinar el estado y el estilo
  const getBannerStyle = () => {
    if (isLimitReached) {
      return {
        bg: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
        icon: '🔒',
        title: t.exportLimits.banner.limitReached.title,
        message: t.exportLimits.banner.limitReached.message,
        showCTA: true,
        canDismiss: false,
      };
    } else if (remainingExports === 1) {
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900',
        icon: '⚠️',
        title: t.exportLimits.banner.lastExport.title,
        message: t.exportLimits.banner.lastExport.message,
        showCTA: true,
        canDismiss: true,
      };
    } else {
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
        icon: 'ℹ️',
        title: t.exportLimits.banner.default.title,
        message: t.exportLimits.banner.default.message,
        showCTA: false,
        canDismiss: true,
      };
    }
  };

  const style = getBannerStyle();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`sticky top-0 z-40 ${style.bg} border-b px-4 py-3`}
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">{style.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm">{style.title}</p>
              <p className="text-xs text-muted-foreground">{style.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {style.showCTA && (
              <Button
                onClick={onRegisterClick}
                size="sm"
                className="whitespace-nowrap"
              >
                {t.exportLimits.banner.registerButton}
              </Button>
            )}
            {style.canDismiss && (
              <button
                onClick={() => setIsDismissed(true)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                aria-label={t.exportLimits.banner.closeButton}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

