import { z } from 'zod';

// Esquemas Zod para validación
export const HighlightSchema = z.object({
  id: z.string(),
  bookId: z.string(),
  text: z.string(),
  note: z.string().optional(),
  location: z.string().optional(),
  page: z.number().nullable().optional(),
  addedAt: z.union([z.string(), z.date()]).nullable().optional(),
  hash: z.string().optional(), // Hacer opcional por si acaso
});

export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  asin: z.string().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  count: z.number().optional(),
});

export const CollectionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  color: z.string().default('#3B82F6'),
  icon: z.string().default('📚'),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional(),
  book_count: z.number().optional(), // Calculado en queries
});

export const CollectionBookSchema = z.object({
  id: z.string(),
  collection_id: z.string(),
  book_id: z.string(),
  added_at: z.string().or(z.date()).optional(),
});

export const TagSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string().max(50),
  created_at: z.string().or(z.date()).optional(),
  highlight_count: z.number().optional(), // Calculado en queries
});

export const HighlightTagSchema = z.object({
  id: z.string(),
  highlight_id: z.string(),
  tag_id: z.string(),
  created_at: z.string().or(z.date()).optional(),
});

export const ParseResultSchema = z.object({
  books: z.array(BookSchema),
  highlights: z.array(HighlightSchema),
  stats: z.object({
    books: z.number(),
    highlights: z.number(),
  }),
});

// Tipos TypeScript derivados
export type Highlight = z.infer<typeof HighlightSchema>;
export type Book = z.infer<typeof BookSchema>;
export type ParseResult = z.infer<typeof ParseResultSchema>;
export type Collection = z.infer<typeof CollectionSchema>;
export type CollectionBook = z.infer<typeof CollectionBookSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type HighlightTag = z.infer<typeof HighlightTagSchema>;

// Estados de procesamiento
export type ProcessingState = 
  | { status: 'idle' }
  | { status: 'processing'; progress: number }
  | { status: 'completed'; result: ParseResult }
  | { status: 'error'; error: string };

// Mensajes del Web Worker
export type WorkerMessage = 
  | { type: 'progress'; progress: number; message?: string }
  | { type: 'completed'; result: ParseResult }
  | { type: 'error'; error: string };

