"use client";

import { Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">export.highlight</h3>
            <p className="text-sm text-muted-foreground">
              {t.landing.hero.subtitle}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Recursos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/como-funciona" className="hover:text-foreground transition-colors">
                  {t.howItWorks.title}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground transition-colors">
                  {t.landing.faq.title}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/privacidad" className="hover:text-foreground transition-colors">
                  {t.privacy.title}
                </a>
              </li>
              <li>
                <a href="/terminos" className="hover:text-foreground transition-colors">
                  {t.terms.title}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            {t.landing.footer.madeWith} <Heart className="h-4 w-4 text-red-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}

