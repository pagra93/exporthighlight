"use client";

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();
  
  const user = session?.user ? {
    id: (session.user as any).id,
    email: session.user.email,
    ...session.user,
  } : null;

  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: '/' });
  };

  return {
    user,
    loading: status === 'loading',
    isAuthenticated: !!user,
    signOut,
    session,
  };
}


