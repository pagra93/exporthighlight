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
  const [mode, setMode] = useState<'magic-link' | 'password'>('password'); // Por defecto password
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

    if (mode === 'password' && !password) {
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
      } else {
        // Email + Password
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: t.common.error,
        description: error instanceof Error ? error.message : t.common.error,
        variant: "destructive",
      });
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
                      {t.auth?.title || 'Sign in'}
                    </h2>
                    <p className="text-muted-foreground">
                      {t.auth?.subtitle || 'Access your account to export all your highlights'}
                    </p>
                  </div>

                  {/* Google Sign In */}
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full mb-4 gap-2"
                    size="lg"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    {t.auth?.google || 'Continue with Google'}
                  </Button>

                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        {t.auth?.orContinueWith || 'Or continue with'}
                      </span>
                    </div>
                  </div>

                  {/* Mode Selector - Mejorado */}
                  <div className="flex gap-2 p-1 bg-muted/50 rounded-xl mb-6">
                    <button
                      type="button"
                      onClick={() => setMode('password')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                        mode === 'password'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      🔑 {t.auth?.password || 'Password'}
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
                      ✨ {t.auth?.magicLink || 'Magic Link'}
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

                    {mode === 'password' && (
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                          {t.auth?.password || 'Password'}
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
                          {t.auth?.sending || 'Sending...'}
                        </>
                      ) : mode === 'magic-link' ? (
                        <>
                          <Mail className="h-5 w-5" />
                          {t.auth?.sendMagicLink || 'Send Magic Link'}
                        </>
                      ) : (
                        <>
                          🔓 {t.auth?.login || 'Sign in'}
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    {t.landing.footer.terms} & {t.landing.footer.privacy}
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

