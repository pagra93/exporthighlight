"use client";

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  name: string;
  onRemove?: () => void;
  className?: string;
  removable?: boolean;
}

/**
 * Badge simple para mostrar una etiqueta
 * Sin colores ni emojis, solo nombre
 */
export function TagBadge({ name, onRemove, className, removable = false }: TagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium",
        "bg-secondary text-secondary-foreground border border-border",
        "transition-colors hover:bg-secondary/80",
        className
      )}
    >
      {name}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-sm hover:bg-muted p-0.5 transition-colors"
          aria-label={`Remove tag ${name}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

