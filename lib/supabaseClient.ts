"use client";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Helper para verificar si Supabase está configurado
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Factory para crear cliente Supabase con token de NextAuth
export function createSupabaseClient(accessToken?: string): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`,
      } : {},
    },
    auth: {
      persistSession: false, // NextAuth maneja la sesión
      autoRefreshToken: false,
    },
  });

  // Configurar Realtime con el token
  if (accessToken) {
    client.realtime.setAuth(accessToken);
  }

  return client;
}

// Cliente por defecto (sin token - solo queries públicas)
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createSupabaseClient()
  : {} as SupabaseClient;
