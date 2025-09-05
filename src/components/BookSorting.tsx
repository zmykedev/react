import React from 'react';
import type { BookSort, Book } from '../types/book';
import { motion } from 'framer-motion';

interface BookSortingProps {
  sort: BookSort;
  onSortChange: (sort: BookSort) => void;
}

const SORT_FIELDS = [
  { value: 'title', label: 'Título' },
  { value: 'author', label: 'Autor' },
  { value: 'publisher', label: 'Editorial' },
  { value: 'price', label: 'Precio' },
  { value: 'genre', label: 'Género' },
  { value: 'createdAt', label: 'Fecha de creación' }
] as const;

export const BookSorting: React.FC<BookSortingProps> = ({ sort, onSortChange }) => {
  const handleFieldChange = (field: keyof Book) => {
    onSortChange({
      field,
      direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleDirectionChange = (direction: 'asc' | 'desc') => {
    onSortChange({
      ...sort,
      direction
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-fountain-blue-800/50 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-fountain-blue-200 dark:border-fountain-blue-600"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h4 className="text-sm font-medium text-fountain-blue-700 dark:text-fountain-blue-300">
          Ordenar por:
        </h4>
        
        <div className="flex items-center gap-3">
          {/* Campo de ordenamiento */}
          <select
            value={sort.field}
            onChange={(e) => handleFieldChange(e.target.value as keyof Book)}
            className="px-3 py-2 border border-fountain-blue-300 dark:border-fountain-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-fountain-blue-500 focus:border-transparent bg-white/50 dark:bg-fountain-blue-900/50 text-fountain-blue-900 dark:text-fountain-blue-100 text-sm"
          >
            {SORT_FIELDS.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>

          {/* Dirección del ordenamiento */}
          <div className="flex border border-fountain-blue-300 dark:border-fountain-blue-600 rounded-lg overflow-hidden">
            <button
              onClick={() => handleDirectionChange('asc')}
              className={`px-3 py-2 text-sm transition-colors ${
                sort.direction === 'asc'
                  ? 'bg-fountain-blue-600 text-white'
                  : 'bg-white/50 dark:bg-fountain-blue-900/50 text-fountain-blue-700 dark:text-fountain-blue-300 hover:bg-fountain-blue-100 dark:hover:bg-fountain-blue-700'
              }`}
            >
              ↑
            </button>
            <button
              onClick={() => handleDirectionChange('desc')}
              className={`px-3 py-2 text-sm transition-colors ${
                sort.direction === 'desc'
                  ? 'bg-fountain-blue-600 text-white'
                  : 'bg-white/50 dark:bg-fountain-blue-900/50 text-fountain-blue-700 dark:text-fountain-blue-300 hover:bg-fountain-blue-100 dark:hover:bg-fountain-blue-700'
              }`}
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
