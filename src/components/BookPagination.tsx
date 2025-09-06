import React from 'react';
import type { PaginationParams } from '../types/book';
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
  onItemsPerPageChange
}) => {
  // No longer need getPageNumbers, handlePageClick as Ant Design Pagination handles it

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full text-center"
    >
      <Space direction="vertical" size="middle" className="w-full">
        {/* Información de paginación */}
        <Typography.Text type="secondary">
          Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
        </Typography.Text>

        <Space className="flex items-center justify-center gap-4">
          {/* Selector de items por página */}
          <Space>
            <Typography.Text type="secondary">
              Por página:
            </Typography.Text>
            <Select
              value={itemsPerPage}
              onChange={(value) => onItemsPerPageChange(Number(value))}
              options={[
                { value: 10, label: '10' },
                { value: 20, label: '20' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
              ]}
            />
          </Space>

          {/* Navegación de páginas */}
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={itemsPerPage}
            onChange={onPageChange}
            showSizeChanger={false} // Items per page is handled by custom Select
          />
        </Space>
      </Space>
    </motion.div>
  );
};
