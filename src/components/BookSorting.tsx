import React from 'react';
import type { BookSort, Book } from '../types/book';
import { motion } from 'framer-motion';
import { Card, Select, Button, Typography, Space, Radio } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

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
  { value: 'createdAt', label: 'Fecha de creación' },
] as const;

export const BookSorting: React.FC<BookSortingProps> = ({ sort, onSortChange }) => {
  const handleFieldChange = (field: keyof Book) => {
    onSortChange({
      field,
      direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleDirectionChange = (direction: 'asc' | 'desc') => {
    onSortChange({
      ...sort,
      direction,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='w-full'>
      <Card className='rounded-lg shadow-sm border border-fountain-blue-200 dark:border-fountain-blue-600 p-4'>
        <Space className='flex flex-col sm:flex-row gap-4 items-center justify-between w-full'>
          <Typography.Text className='text-sm font-medium text-fountain-blue-700 dark:text-fountain-blue-300'>
            Ordenar por:
          </Typography.Text>

          <Space size='small'>
            {/* Campo de ordenamiento */}
            <Select
              value={sort.field}
              onChange={(value: keyof Book) => handleFieldChange(value)}
              options={SORT_FIELDS}
              className='min-w-[150px]'
            />

            {/* Dirección del ordenamiento */}
            <Radio.Group
              value={sort.direction}
              onChange={(e) => handleDirectionChange(e.target.value as 'asc' | 'desc')}
            >
              <Radio.Button value='asc'>
                <ArrowUpOutlined /> Asc
              </Radio.Button>
              <Radio.Button value='desc'>
                <ArrowDownOutlined /> Desc
              </Radio.Button>
            </Radio.Group>
          </Space>
        </Space>
      </Card>
    </motion.div>
  );
};
