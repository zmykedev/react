import React from 'react';
import { motion } from 'framer-motion';
import { Pagination, Select, Typography, Space } from 'antd';

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
  onItemsPerPageChange,
}) => {
  // Don't render anything if there are no items or only one page and few items
  if (totalItems === 0) {
    return null;
  }

  // For very small datasets, only show the count
  if (totalItems <= itemsPerPage && totalPages <= 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='w-full text-center py-4'
      >
        <Typography.Text type='secondary'>
          {totalItems} {totalItems === 1 ? 'libro encontrado' : 'libros encontrados'}
        </Typography.Text>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-full text-center'
    >
      <Space direction='vertical' size='middle' className='w-full'>
        {/* Información de paginación */}
        <Typography.Text type='secondary'>
          Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}{' '}
          {totalItems === 1 ? 'libro' : 'libros'}
        </Typography.Text>

        <Space className='flex items-center justify-center gap-4' wrap>
          {/* Selector de items por página - only show if more than 10 items */}
          {totalItems > 10 && (
            <Space>
              <Typography.Text type='secondary'>Por página:</Typography.Text>
              <Select
                value={itemsPerPage}
                onChange={(value) => onItemsPerPageChange(Number(value))}
                options={[
                  { value: 10, label: '10' },
                  { value: 20, label: '20' },
                  { value: 50, label: '50' },
                  { value: 100, label: '100' },
                ]}
                size='small'
              />
            </Space>
          )}

          {/* Navegación de páginas - only show if more than 1 page */}
          {totalPages > 1 && (
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={itemsPerPage}
              onChange={onPageChange}
              showSizeChanger={false} // Items per page is handled by custom Select
              showQuickJumper={totalPages > 10} // Only show quick jumper if more than 10 pages
              hideOnSinglePage={true} // Hide if only one page
              size='default'
              responsive={true}
            />
          )}
        </Space>
      </Space>
    </motion.div>
  );
};
