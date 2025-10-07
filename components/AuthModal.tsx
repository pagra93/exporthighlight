"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'magic-link'>('login'); // Por defecto login
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

    if (mode === 'login' && !password) {
      toast({
        title: t.common?.error || 'Error',
        description: t.auth?.passwordRequired || 'Please enter your password',
        variant: "destructive",
      });
      return;
    }

    if (mode === 'signup' && !password) {
      toast({
        title: t.common?.error || 'Error',
        description: t.auth?.passwordRequired || 'Please enter your password',
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'magic-link') {
        // Magic Link
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        setMagicLinkSent(true);
        toast({
          title: t.common.success,
          description: t.auth.checkEmail,
        });
      } else if (mode === 'signup') {
        // Registro con Email + Password
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        toast({
          title: t.common?.success || 'Success',
          description: t.auth?.signupSuccess || '¡Cuenta creada! Revisa tu email para confirmar tu cuenta.',
        });
        
        // Cambiar a modo login después del registro
        setMode('login');
      } else {
        // Login con Email + Password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: t.common?.success || 'Success',
          description: t.auth?.sessionStarted || 'Session started successfully!',
        });
        
        // Redirigir a la página de cuenta
        router.push('/account');
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      let errorMessage = t.common.error;
      
      if (error instanceof Error) {
        if (error.message.includes('Supabase not configured')) {
          errorMessage = 'Error de configuración: Las credenciales de Supabase no están configuradas correctamente.';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor confirma tu email antes de iniciar sesión.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: t.common.error,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop - Fondo difuminado oscuro que cubre TODO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            style={{ backdropFilter: 'blur(8px)' }}
          />

          {/* Modal Container - Centrado perfectamente */}
          <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-8 relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - Mejorado */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              {!magicLinkSent ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-2">
                      {mode === 'signup' ? (t.auth?.signupTitle || 'Crear cuenta') : (t.auth?.title || 'Iniciar sesión')}
                    </h2>
                    <p className="text-muted-foreground">
                      {mode === 'signup' 
                        ? (t.auth?.signupSubtitle || 'Crea tu cuenta para guardar y exportar todos tus highlights')
                        : (t.auth?.subtitle || 'Accede a tu cuenta para exportar todos tus highlights')
                      }
                    </p>
                  </div>


                  {/* Mode Selector - Mejorado */}
                  <div className="flex gap-2 p-1 bg-muted/50 rounded-xl mb-6">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                        mode === 'login'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      🔑 {t.auth?.login || 'Iniciar sesión'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                        mode === 'signup'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      ✨ {t.auth?.signup || 'Crear cuenta'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('magic-link')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                        mode === 'magic-link'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      📧 {t.auth?.magicLink || 'Magic Link'}
                    </button>
                  </div>

                  {/* Email & Password Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        {t.auth?.email || 'Email'}
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder={t.auth.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    {(mode === 'login' || mode === 'signup') && (
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                          {t.auth?.password || 'Contraseña'}
                        </label>
                        <input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {t.auth?.sending || 'Enviando...'}
                        </>
                      ) : mode === 'magic-link' ? (
                        <>
                          <Mail className="h-5 w-5" />
                          {t.auth?.sendMagicLink || 'Enviar Magic Link'}
                        </>
                      ) : mode === 'signup' ? (
                        <>
                          ✨ {t.auth?.createAccount || 'Crear cuenta'}
                        </>
                      ) : (
                        <>
                          🔓 {t.auth?.login || 'Iniciar sesión'}
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    {mode === 'login' ? (
                      <>
                        ¿No tienes cuenta?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('signup')}
                          className="text-primary hover:underline font-medium"
                        >
                          Crear cuenta
                        </button>
                      </>
                    ) : mode === 'signup' ? (
                      <>
                        ¿Ya tienes cuenta?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('login')}
                          className="text-primary hover:underline font-medium"
                        >
                          Iniciar sesión
                        </button>
                      </>
                    ) : null}
                  </p>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {t.auth?.checkEmail || 'Check your email'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t.auth?.checkEmail || 'Check your email'} <strong>{email}</strong>
                  </p>
                  <Button onClick={onClose} variant="outline">
                    {t.auth?.close || 'Close'}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

