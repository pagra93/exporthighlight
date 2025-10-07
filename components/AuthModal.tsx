"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Mail, 
  Loader2, 
  X, 
  Lock, 
  UserPlus, 
  KeyRound, 
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
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
  const [mode, setMode] = useState<'login' | 'signup' | 'magic-link' | 'forgot-password'>('login');
  const [showPassword, setShowPassword] = useState(false);
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

    if ((mode === 'login' || mode === 'signup') && !password) {
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
      } else if (mode === 'forgot-password') {
        // Recuperar contraseña
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`,
        });

        if (error) throw error;

        setMagicLinkSent(true);
        toast({
          title: t.common?.success || 'Success',
          description: t.auth?.passwordResetSent || 'Se ha enviado un enlace para restablecer tu contraseña',
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full relative my-8 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative">
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    {mode === 'signup' ? (
                      <UserPlus className="h-8 w-8" />
                    ) : mode === 'forgot-password' ? (
                      <RotateCcw className="h-8 w-8" />
                    ) : mode === 'magic-link' ? (
                      <Mail className="h-8 w-8" />
                    ) : (
                      <Lock className="h-8 w-8" />
                    )}
                  </motion.div>
                  
                  <motion.h2
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold mb-2"
                  >
                    {mode === 'signup' 
                      ? (t.auth?.signupTitle || 'Crear cuenta')
                      : mode === 'forgot-password'
                      ? (t.auth?.forgotPasswordTitle || 'Recuperar contraseña')
                      : (t.auth?.title || 'Iniciar sesión')
                    }
                  </motion.h2>
                  
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-blue-100 text-sm"
                  >
                    {mode === 'signup' 
                      ? (t.auth?.signupSubtitle || 'Crea tu cuenta para guardar y exportar todos tus highlights')
                      : mode === 'forgot-password'
                      ? (t.auth?.forgotPasswordSubtitle || 'Te enviaremos un enlace para restablecer tu contraseña')
                      : (t.auth?.subtitle || 'Accede a tu cuenta para exportar todos tus highlights')
                    }
                  </motion.p>
                </div>
              </div>

              <div className="p-8">
                {!magicLinkSent ? (
                  <>
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t.auth?.email || 'Email'}
                        </label>
                        <div className="relative">
                          <input
                            id="email"
                            type="email"
                            placeholder={t.auth.emailPlaceholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                            required
                          />
                        </div>
                      </div>

                      {(mode === 'login' || mode === 'signup') && (
                        <div className="space-y-2">
                          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {t.auth?.password || 'Password'}
                          </label>
                          <div className="relative">
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              disabled={isLoading}
                              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              {t.auth?.sending || 'Sending...'}
                            </>
                          ) : mode === 'magic-link' ? (
                            <>
                              <Mail className="h-5 w-5 mr-2" />
                              {t.auth?.sendMagicLink || 'Send Magic Link'}
                            </>
                          ) : mode === 'forgot-password' ? (
                            <>
                              <RotateCcw className="h-5 w-5 mr-2" />
                              {t.auth?.sendResetLink || 'Send Reset Link'}
                            </>
                          ) : mode === 'signup' ? (
                            <>
                              <UserPlus className="h-5 w-5 mr-2" />
                              {t.auth?.createAccount || 'Create Account'}
                            </>
                          ) : (
                            <>
                              <Lock className="h-5 w-5 mr-2" />
                              {t.auth?.login || 'Sign In'}
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>

                    {/* Navigation Links */}
                    <div className="mt-6 text-center space-y-2">
                      {mode === 'login' ? (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <button
                              type="button"
                              onClick={() => setMode('signup')}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              Create account
                            </button>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <button
                              type="button"
                              onClick={() => setMode('forgot-password')}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              Forgot your password?
                            </button>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <button
                              type="button"
                              onClick={() => setMode('magic-link')}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              Sign in with Magic Link
                            </button>
                          </p>
                        </>
                      ) : mode === 'signup' ? (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <button
                              type="button"
                              onClick={() => setMode('login')}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              Sign in
                            </button>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <button
                              type="button"
                              onClick={() => setMode('magic-link')}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              Sign in with Magic Link
                            </button>
                          </p>
                        </>
                      ) : mode === 'forgot-password' ? (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Remember your password?{' '}
                            <button
                              type="button"
                              onClick={() => setMode('login')}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              Sign in
                            </button>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <button
                              type="button"
                              onClick={() => setMode('magic-link')}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              Sign in with Magic Link
                            </button>
                          </p>
                        </>
                      ) : mode === 'magic-link' ? (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <button
                              type="button"
                              onClick={() => setMode('login')}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              Sign in with password
                            </button>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <button
                              type="button"
                              onClick={() => setMode('signup')}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              Create account
                            </button>
                          </p>
                        </>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6"
                    >
                      <Mail className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </motion.div>
                    
                    <motion.h3
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-xl font-bold mb-3 text-gray-900 dark:text-white"
                    >
                      {t.auth?.checkEmail || 'Revisa tu email'}
                    </motion.h3>
                    
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-600 dark:text-gray-400 mb-6"
                    >
                      Te hemos enviado un enlace a <strong className="text-gray-900 dark:text-white">{email}</strong>
                    </motion.p>
                    
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button 
                        onClick={onClose} 
                        variant="outline"
                        className="px-8 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      >
                        {t.auth?.close || 'Cerrar'}
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}