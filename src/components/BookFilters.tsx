import React, { useState, useEffect, useCallback } from 'react';
import type { BookFilters as BookFiltersType } from '../types/book';
import { motion } from 'framer-motion';
import { Form, Input, Select, Button, Typography, Row, Col, Space, Card } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
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
  publishers,
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
      search: debouncedSearchTerm || undefined,
    });
  }, [debouncedSearchTerm, filters, onFiltersChange]);

  // Update filters when debounced author term changes
  useEffect(() => {
    const updatedFilters = {
      ...filters,
      author: debouncedAuthorTerm || undefined,
    };

    onFiltersChange(updatedFilters);
  }, [debouncedAuthorTerm, filters, onFiltersChange]);

  const handleFilterChange = useCallback(
    (key: keyof BookFiltersType, value: string | boolean | undefined) => {
      onFiltersChange({
        ...filters,
        [key]: value === '' ? undefined : value,
      });
    },
    [filters, onFiltersChange],
  );

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setAuthorTerm('');
    onFiltersChange({});
  }, [onFiltersChange]);

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='w-full'>
      <Card className='card-primary p-6'>
        <Row justify='space-between' align='middle' className='mb-6 flex-col lg:flex-row gap-4'>
          <Col>
            <Typography.Title level={3} className='text-lg font-semibold text-primary mb-0'>
              Filtros Avanzados
            </Typography.Title>
          </Col>
          <Col>
            <Button
              type='link'
              onClick={clearFilters}
              icon={<CloseCircleOutlined />}
              className='text-fountain-blue-600 hover:text-fountain-blue-700 transition-colors dark:text-fountain-blue-400 dark:hover:text-fountain-blue-300'
            >
              Limpiar filtros
            </Button>
          </Col>
        </Row>

        <Form layout='vertical' className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
          {/* Búsqueda general en tiempo real */}
          <Form.Item label='Búsqueda General' tooltip='Buscar por título del libro'>
            <Input
              placeholder='Buscar por título...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Item>

          {/* Filtro por autor con debounce */}
          <Form.Item label='Autor' tooltip='Filtro independiente por autor'>
            <Input
              placeholder='Filtrar por autor'
              value={authorTerm}
              onChange={(e) => setAuthorTerm(e.target.value)}
            />
          </Form.Item>

          {/* Filtro por género */}
          <Form.Item label='Género'>
            <Select
              placeholder='Todos los géneros'
              value={filters.genre || undefined}
              onChange={(value) => handleFilterChange('genre', value)}
            >
              <Select.Option value=''>Todos los géneros</Select.Option>
              {!Array.isArray(genres) || genres.length === 0 ? (
                <Select.Option value='' disabled>
                  Cargando géneros...
                </Select.Option>
              ) : (
                genres.map((genre) => (
                  <Select.Option key={genre} value={genre}>
                    {genre}
                  </Select.Option>
                ))
              )}
            </Select>
          </Form.Item>

          {/* Filtro por editorial */}
          <Form.Item label='Editorial'>
            <Select
              placeholder='Todas las editoriales'
              value={filters.publisher || undefined}
              onChange={(value) => handleFilterChange('publisher', value)}
            >
              <Select.Option value=''>Todas las editoriales</Select.Option>
              {!Array.isArray(publishers) || publishers.length === 0 ? (
                <Select.Option value='' disabled>
                  Cargando editoriales...
                </Select.Option>
              ) : (
                publishers.map((publisher) => (
                  <Select.Option key={publisher} value={publisher}>
                    {publisher}
                  </Select.Option>
                ))
              )}
            </Select>
          </Form.Item>

          {/* Filtro por disponibilidad */}
          <Form.Item label='Disponibilidad'>
            <Select
              placeholder='Todas'
              value={filters.availability === undefined ? '' : filters.availability.toString()}
              onChange={(value) =>
                handleFilterChange('availability', value === '' ? undefined : value === 'true')
              }
            >
              <Select.Option value=''>Todas</Select.Option>
              <Select.Option value='true'>Disponible</Select.Option>
              <Select.Option value='false'>No disponible</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>
    </motion.div>
  );
};
