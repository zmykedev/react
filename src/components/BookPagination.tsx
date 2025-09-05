import React from 'react';
import type { PaginationParams } from '../types/book';
import { motion } from 'framer-motion';

interface BookPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
}

export const BookPagination: React.FC<BookPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-[var(--color-fountain-blue-800)]/50 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-[var(--color-fountain-blue-200)] dark:border-[var(--color-fountain-blue-600)]"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Información de paginación */}
        <div className="text-sm text-[var(--color-fountain-blue-700)] dark:text-[var(--color-fountain-blue-300)]">
          Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
        </div>

        {/* Selector de items por página */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-fountain-blue-700)] dark:text-[var(--color-fountain-blue-300)]">
            Por página:
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 border border-[var(--color-fountain-blue-300)] dark:border-[var(--color-fountain-blue-600)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-fountain-blue-500)] focus:border-transparent bg-white/50 dark:bg-[var(--color-fountain-blue-900)]/50 text-[var(--color-fountain-blue-900)] dark:text-[var(--color-fountain-blue-100)] text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Navegación de páginas */}
        <div className="flex items-center gap-1">
          {/* Botón anterior */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              currentPage === 1
                ? 'text-[var(--color-fountain-blue-400)] dark:text-[var(--color-fountain-blue-600)] cursor-not-allowed'
                : 'text-[var(--color-fountain-blue-700)] dark:text-[var(--color-fountain-blue-300)] hover:bg-[var(--color-fountain-blue-100)] dark:hover:bg-[var(--color-fountain-blue-700)]'
            }`}
          >
            ←
          </button>

          {/* Números de página */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                page === currentPage
                  ? 'bg-[var(--color-fountain-blue-600)] text-white'
                  : page === '...'
                  ? 'text-[var(--color-fountain-blue-400)] dark:text-[var(--color-fountain-blue-600)] cursor-default'
                  : 'text-[var(--color-fountain-blue-700)] dark:text-[var(--color-fountain-blue-300)] hover:bg-[var(--color-fountain-blue-100)] dark:hover:bg-[var(--color-fountain-blue-700)]'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Botón siguiente */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              currentPage === totalPages
                ? 'text-[var(--color-fountain-blue-400)] dark:text-[var(--color-fountain-blue-600)] cursor-not-allowed'
                : 'text-[var(--color-fountain-blue-700)] dark:text-[var(--color-fountain-blue-300)] hover:bg-[var(--color-fountain-blue-100)] dark:hover:bg-[var(--color-fountain-blue-700)]'
            }`}
          >
            →
          </button>
        </div>
      </div>
    </motion.div>
  );
};
