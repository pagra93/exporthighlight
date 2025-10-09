"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import {
  Mail,
  Loader2,
  X,
  Lock,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  RotateCcw
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
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: t.common.error,
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: t.common.error,
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // REGISTRO: Intentar con confirmación de email primero
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });

        if (error) {
          // Si falla por usuario ya existente
          if (error.message.includes('User already registered')) {
            throw new Error('Este email ya está registrado. Inicia sesión.');
          }
          
          // Si falla por email de confirmación, intentar login directo
          if (error.message.includes('email') || error.message.includes('confirmation') || error.message.includes('mailer') || error.message.includes('500')) {
            console.log('Error de SMTP detectado, intentando login directo...');
            
            // Esperar un momento para que el usuario se cree
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Intentar login (por si el usuario se creó pero falló el email)
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            
            if (loginError) {
              // Si login también falla, el usuario no se creó
              throw new Error('No se pudo crear la cuenta. Intenta con otro email.');
            }
            
            // Si login funciona, el usuario se creó correctamente
            toast({
              title: "¡Registro exitoso!",
              description: "Tu cuenta ha sido creada y has iniciado sesión.",
            });
            
            router.push('/account');
            onClose();
            if (onSuccess) onSuccess();
            return;
          }
          
          // Si falla por otra razón
          throw error;
        }

        // Si signUp funcionó correctamente
        if (data.user) {
          // Intentar login inmediatamente después del registro
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (loginError) {
            // Si login falla, mostrar mensaje pero el usuario se creó
            toast({
              title: "¡Registro exitoso!",
              description: "Tu cuenta ha sido creada. Por favor inicia sesión.",
            });
            
            // Cambiar a modo login
            setMode('login');
            return;
          }

          // Si login funciona, entrar directamente
          toast({
            title: "¡Registro exitoso!",
            description: "Tu cuenta ha sido creada y has iniciado sesión.",
          });
          
          router.push('/account');
          onClose();
          if (onSuccess) onSuccess();
        }

      } else if (mode === 'login') {
        // Login normal
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente.",
          });
          
          router.push('/account');
          onClose();
          if (onSuccess) onSuccess();
        }
      } else if (mode === 'forgot-password') {
        // Olvidé mi contraseña: enviar enlace de reseteo
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-callback`,
        });

        if (error) throw error;

        toast({
          title: "¡Enlace enviado!",
          description: "Revisa tu email para restablecer tu contraseña.",
        });
        onClose();
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      let errorMessage = error.message;
      
      // Mensajes de error más amigables
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = mode === 'login' 
          ? 'Email o contraseña incorrectos' 
          : 'Este email ya está registrado. Inicia sesión.';
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'Este email ya está registrado. Inicia sesión.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor confirma tu email antes de iniciar sesión';
      } else if (error.message.includes('No se pudo crear la cuenta')) {
        errorMessage = 'No se pudo crear la cuenta. Intenta con otro email.';
      } else if (error.message.includes('email') || error.message.includes('mailer')) {
        errorMessage = mode === 'signup' 
          ? 'Error al crear la cuenta. Intenta de nuevo.' 
          : 'Error de conexión. Intenta de nuevo.';
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

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Iniciar Sesión';
      case 'signup': return 'Crear Cuenta';
      case 'forgot-password': return 'Recuperar Contraseña';
      default: return 'Iniciar Sesión';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Ingresa con tu email y contraseña';
      case 'signup': return 'Crea tu cuenta para empezar';
      case 'forgot-password': return 'Te enviaremos un enlace para restablecer tu contraseña';
      default: return 'Ingresa con tu email y contraseña';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'login': return 'Iniciar Sesión';
      case 'signup': return 'Crear Cuenta';
      case 'forgot-password': return 'Enviar Enlace';
      default: return 'Iniciar Sesión';
    }
  };

  const Icon = (() => {
    switch (mode) {
      case 'login': return LogIn;
      case 'signup': return UserPlus;
      case 'forgot-password': return RotateCcw;
      default: return LogIn;
    }
  })();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header con gradiente mejorado */}
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-indigo-700/90"></div>
              <div className="relative z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </Button>
                
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">{getTitle()}</h2>
                <p className="text-white/90 text-lg">{getSubtitle()}</p>
              </div>
            </div>

            {/* Formulario */}
            <div className="p-8 bg-white dark:bg-gray-900">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 text-lg"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Campo Contraseña */}
                {(mode === 'login' || mode === 'signup') && (
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Contraseña
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 text-lg"
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Botón Principal */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Icon className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                      {getButtonText()}
                    </>
                  )}
                </Button>

                {/* Enlaces de navegación */}
                <div className="text-center space-y-3 pt-4">
                  {mode === 'login' && (
                    <>
                      <p className="text-gray-600 dark:text-gray-400">
                        ¿No tienes cuenta?{' '}
                        <Button 
                          variant="link" 
                          type="button"
                          onClick={() => setMode('signup')} 
                          className="p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-lg"
                        >
                          Crear cuenta
                        </Button>
                      </p>
                      <p>
                        <Button 
                          variant="link" 
                          type="button"
                          onClick={() => setMode('forgot-password')} 
                          className="p-0 h-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
                        >
                          ¿Olvidaste tu contraseña?
                        </Button>
                      </p>
                    </>
                  )}
                  
                  {mode === 'signup' && (
                    <p className="text-gray-600 dark:text-gray-400">
                      ¿Ya tienes cuenta?{' '}
                      <Button 
                        variant="link" 
                        type="button"
                        onClick={() => setMode('login')} 
                        className="p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-lg"
                      >
                        Iniciar sesión
                      </Button>
                    </p>
                  )}
                  
                  {mode === 'forgot-password' && (
                    <p>
                      <Button 
                        variant="link" 
                        type="button"
                        onClick={() => setMode('login')} 
                        className="p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                      >
                        ← Volver al inicio de sesión
                      </Button>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
