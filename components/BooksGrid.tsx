"use client";

import { Book, Highlight } from '@/lib/types';
import { BookCard } from './BookCard';

interface BooksGridProps {
  books: Book[];
  highlights?: Highlight[];
  selectedBookId?: string;
  onBookSelect: (book: Book) => void;
  isAuthenticated?: boolean;
}

export function BooksGrid({ books, highlights, selectedBookId, onBookSelect, isAuthenticated = false }: BooksGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron libros</p>
      </div>
    );
  }

  // Calcular count si no está presente
  const booksWithCount = books.map(book => {
    if (book.count === undefined && highlights) {
      const count = highlights.filter(h => h.bookId === book.id).length;
      return { ...book, count };
    }
    return book;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {booksWithCount.map((book) => {
        const bookHighlights = highlights?.filter(h => h.bookId === book.id) || [];
        return (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => onBookSelect(book)}
            isSelected={book.id === selectedBookId}
            highlights={bookHighlights}
            isAuthenticated={isAuthenticated}
          />
        );
      })}
    </div>
  );
}

