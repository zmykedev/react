import React from 'react';
import type { Book } from '../types/book';
import { motion } from 'framer-motion';

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: string) => void;
  onView?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  onView
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white/80 dark:bg-fountain-blue-800/50 backdrop-blur-sm rounded-lg shadow-sm border border-fountain-blue-200 dark:border-fountain-blue-600 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Imagen del libro */}
      <div className="relative h-48 bg-gradient-to-br from-fountain-blue-100 to-fountain-blue-200 dark:from-fountain-blue-700 dark:to-fountain-blue-800">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-16 h-16 text-fountain-blue-400 dark:text-fountain-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        
        {/* Badge de disponibilidad */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
          book.availability
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
        }`}>
          {book.availability ? 'Disponible' : 'No disponible'}
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        {/* Título */}
        <h3 className="text-lg font-semibold text-fountain-blue-900 dark:text-fountain-blue-100 mb-2 line-clamp-2">
          {book.title}
        </h3>

        {/* Autor */}
        <p className="text-sm text-fountain-blue-700 dark:text-fountain-blue-300 mb-2">
          <span className="font-medium">Autor:</span> {book.author}
        </p>

        {/* Editorial */}
        <p className="text-sm text-fountain-blue-700 dark:text-fountain-blue-300 mb-2">
          <span className="font-medium">Editorial:</span> {book.publisher}
        </p>

        {/* Género */}
        <p className="text-sm text-fountain-blue-700 dark:text-fountain-blue-300 mb-3">
          <span className="font-medium">Género:</span> {book.genre}
        </p>

        {/* Precio */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-fountain-blue-600">
            {formatPrice(book.price)}
          </span>
          <span className="text-xs text-fountain-blue-500 dark:text-fountain-blue-400">
            {formatDate(book.createdAt)}
          </span>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          {onView && (
            <button
              onClick={() => onView(book)}
              className="flex-1 bg-fountain-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-fountain-blue-700 transition-colors"
            >
              Ver
            </button>
          )}
          
          {onEdit && (
            <button
              onClick={() => onEdit(book)}
              className="px-3 py-2 border border-fountain-blue-600 text-fountain-blue-600 dark:text-fountain-blue-400 rounded-lg text-sm font-medium hover:bg-fountain-blue-600 hover:text-white transition-colors"
            >
              Editar
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={() => onDelete(book.id)}
              className="px-3 py-2 border border-red-600 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white transition-colors"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
