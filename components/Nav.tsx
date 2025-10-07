"use client";

import { useState } from 'react';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { AuthModal } from '@/components/AuthModal';
import { Logo } from '@/components/Logo';
import { createPortal } from 'react-dom';

export function Nav() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: t.common.success,
        description: t.nav.logout,
      });
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.common.error,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <Logo />
          </Link>
          
          <div className="flex items-center gap-2">
            <LanguageSelector />
            {isAuthenticated ? (
              <>
                <Link href="/account">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t.nav.myAccount}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t.nav.logout}</span>
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAuthModal(true)}
              >
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t.nav.login}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
            {/* Auth Modal - Renderizado como Portal */}
            {typeof window !== 'undefined' && createPortal(
              <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => {
                  setShowAuthModal(false);
                  toast({
                    title: t.common?.success || 'Success',
                    description: t.auth?.sessionStarted || 'Session started successfully!',
                  });
                }}
              />,
              document.body
            )}
    </nav>
  );
}

