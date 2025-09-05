import React, { useState, useEffect, useCallback } from 'react';
import type { BookFilters as BookFiltersType } from '../types/book';
import { motion } from 'framer-motion';
import { useDebounceValue } from 'usehooks-ts';

interface BookFiltersProps {
  filters: BookFiltersType;
  onFiltersChange: (filters: BookFiltersType) => void;
  genres: string[];
  publishers: string[];
}

export const BookFilters: React.FC<BookFiltersProps> = ({
  filters,
  onFiltersChange,
  genres,
  publishers
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [authorTerm, setAuthorTerm] = useState(filters.author || '');
  
  // Usar useDebounceValue para ambos términos de búsqueda
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);
  const [debouncedAuthorTerm] = useDebounceValue(authorTerm, 500);

  // Update filters when debounced search term changes
  useEffect(() => {
    onFiltersChange({
      ...filters,
      search: debouncedSearchTerm || undefined
    });
  }, [debouncedSearchTerm, filters, onFiltersChange]);

  // Update filters when debounced author term changes
  useEffect(() => {
    
    const updatedFilters = {
      ...filters,
      author: debouncedAuthorTerm || undefined
    };
    
    onFiltersChange(updatedFilters);
  }, [debouncedAuthorTerm, filters, onFiltersChange]);

  const handleFilterChange = useCallback((key: keyof BookFiltersType, value: string | boolean | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value
    });
  }, [filters, onFiltersChange]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setAuthorTerm('');
    onFiltersChange({});
  }, [onFiltersChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-primary p-6"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">
          Filtros Avanzados
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-fountain-blue-600 hover:text-fountain-blue-700 transition-colors dark:text-fountain-blue-400 dark:hover:text-fountain-blue-300"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Búsqueda general en tiempo real */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Búsqueda General
          </label>
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-primary dark:input-dark"
          />
          <p className="text-xs text-fountain-blue-500 mt-1">
            Busca por título del libro
          </p>
        </div>

        {/* Filtro por autor con debounce */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Autor
          </label>
          <input
            type="text"
            placeholder="Filtrar por autor"
            value={authorTerm}
            onChange={(e) => setAuthorTerm(e.target.value)}
            className="input-primary dark:input-dark"
          />
          <p className="text-xs text-fountain-blue-500 mt-1">
            Filtro independiente por autor
          </p>
        </div>

        {/* Filtro por género */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Género
          </label>
          <select
            value={filters.genre || ''}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="input-primary dark:input-dark"
          >
            <option value="">Todos los géneros</option>
            {!Array.isArray(genres) || genres.length === 0 ? (
              <option value="" disabled>Cargando géneros...</option>
            ) : (
              genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Filtro por editorial */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Editorial
          </label>
          <select
            value={filters.publisher || ''}
            onChange={(e) => handleFilterChange('publisher', e.target.value)}
            className="input-primary dark:input-dark"
          >
            <option value="">Todas las editoriales</option>
            {!Array.isArray(publishers) || publishers.length === 0 ? (
              <option value="" disabled>Cargando editoriales...</option>
            ) : (
              publishers.map((publisher) => (
                <option key={publisher} value={publisher}>
                  {publisher}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Filtro por disponibilidad */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Disponibilidad
          </label>
          <select
            value={filters.availability === undefined ? '' : filters.availability.toString()}
            onChange={(e) => handleFilterChange('availability', e.target.value === '' ? undefined : e.target.value === 'true')}
            className="input-primary dark:input-dark"
          >
            <option value="">Todas</option>
            <option value="true">Disponible</option>
            <option value="false">No disponible</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};
