"use client";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Helper para verificar si Supabase está configurado
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Cliente de Supabase (singleton)
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true, // Mantener sesión en localStorage
        autoRefreshToken: true, // Auto-refresh del token
        detectSessionInUrl: true, // Detectar sesión en URL (para callbacks)
      },
    })
  : {} as SupabaseClient;
