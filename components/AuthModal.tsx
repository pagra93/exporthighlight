"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Mail, 
  Loader2, 
  X, 
  UserPlus, 
  KeyRound, 
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [mode, setMode] = useState<'login' | 'forgot-password'>('login');
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: t.common.error,
        description: t.auth.emailPlaceholder,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // NextAuth siempre usa signIn con provider "email"
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/account',
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      setMagicLinkSent(true);
      toast({
        title: t.common.success,
        description: t.auth.checkEmail,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: t.common.error,
        description: error.message || t.common.error,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'forgot-password':
        return t.auth?.forgotPasswordTitle || 'Recuperar contraseña';
      default:
        return t.auth.title;
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'forgot-password':
        return t.auth?.forgotPasswordSubtitle || 'Te enviaremos un enlace para restablecer tu contraseña';
      default:
        return t.auth.subtitle;
    }
  };

  const getButtonText = () => {
    if (mode === 'forgot-password') {
      return t.auth?.sendResetLink || 'Enviar enlace';
    }
    return t.auth.sendMagicLink;
  };

  const getButtonIcon = () => {
    if (mode === 'forgot-password') return KeyRound;
    return Mail;
  };

  if (!isOpen) return null;

  const Icon = getButtonIcon();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header con gradiente */}
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-2">{getTitle()}</h2>
              <p className="text-blue-100 text-sm">{getSubtitle()}</p>
            </motion.div>
          </div>

          {/* Body */}
          <div className="p-8">
            {magicLinkSent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t.auth.checkEmail}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hemos enviado un enlace mágico a <strong>{email}</strong>
                  </p>
                </div>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  Entendido
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {t.auth.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.auth.emailPlaceholder}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Icon className="w-5 h-5 mr-2" />
                      {getButtonText()}
                    </>
                  )}
                </Button>

                {/* Links de navegación */}
                <div className="text-center space-y-2">
                  {mode === 'login' ? (
                    <button
                      type="button"
                      onClick={() => setMode('forgot-password')}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors flex items-center justify-center gap-1 mx-auto"
                    >
                      <KeyRound className="w-4 h-4" />
                      {t.auth?.forgotPassword || '¿Olvidaste tu contraseña?'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setMagicLinkSent(false);
                      }}
                      className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium transition-colors flex items-center justify-center gap-1 mx-auto"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Volver al inicio de sesión
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-600 dark:text-gray-400">
              Al continuar, aceptas nuestros{' '}
              <a href="/terminos" className="text-blue-600 hover:underline dark:text-blue-400">
                Términos de Servicio
              </a>{' '}
              y{' '}
              <a href="/privacidad" className="text-blue-600 hover:underline dark:text-blue-400">
                Política de Privacidad
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
