"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2, Lock } from 'lucide-react';
import { useExportLimit } from '@/contexts/ExportLimitContext';

interface ExportLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
  trigger: 'after-export' | 'limit-reached';
}

export function ExportLimitModal({ isOpen, onClose, onRegister, trigger }: ExportLimitModalProps) {
  const { remainingExports, isLimitReached } = useExportLimit();

  if (!isOpen) return null;

  const isAfterExport = trigger === 'after-export';
  const isLimitModal = trigger === 'limit-reached';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              {isAfterExport && (
                <button
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isLimitModal 
                    ? 'bg-red-100 dark:bg-red-900/20' 
                    : remainingExports === 1
                    ? 'bg-yellow-100 dark:bg-yellow-900/20'
                    : 'bg-green-100 dark:bg-green-900/20'
                }`}>
                  {isLimitModal ? (
                    <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
                  ) : (
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  )}
                </div>
              </div>

              {/* Content */}
              {isAfterExport && !isLimitReached ? (
                <>
                  <h2 className="text-2xl font-bold text-center mb-2">
                    Exportado correctamente
                  </h2>
                  <p className="text-center text-muted-foreground mb-6">
                    Te {remainingExports === 1 ? 'queda' : 'quedan'} <strong>{remainingExports}</strong> exportación{remainingExports !== 1 ? 'es' : ''} gratis.
                  </p>
                  <p className="text-center text-sm mb-6">
                    ¿Quieres guardar tu biblioteca y tener exportaciones ilimitadas?
                  </p>

                  {/* Benefits */}
                  <div className="bg-muted rounded-lg p-4 mb-6 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Exportaciones ilimitadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Biblioteca guardada permanentemente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Fusión automática de archivos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Búsqueda avanzada (próximamente)</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Más tarde
                    </Button>
                    <Button
                      onClick={onRegister}
                      className="flex-1"
                    >
                      Registrarse gratis
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-center mb-2">
                    Límite alcanzado
                  </h2>
                  <p className="text-center text-muted-foreground mb-6">
                    Has usado tus 2 exportaciones gratis
                  </p>

                  {/* Benefits */}
                  <div className="bg-muted rounded-lg p-4 mb-6 space-y-2 text-sm">
                    <p className="font-semibold mb-3">Regístrate para obtener:</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Exportaciones ilimitadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Guardar tu biblioteca permanentemente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Fusionar archivos automáticamente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Buscar en todos tus highlights</span>
                    </div>
                  </div>

                  <Button
                    onClick={onRegister}
                    className="w-full"
                    size="lg"
                  >
                    Registrarse gratis
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Registro en 30 segundos con email o Google
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

