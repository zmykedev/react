import React from 'react';
import type { Book } from '../types/book';
import { motion } from 'framer-motion';
import { Card, Tag, Typography, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

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
      className="w-full"
    >
      <Card
        hoverable
        className="rounded-lg shadow-sm border border-fountain-blue-200 dark:border-fountain-blue-600 overflow-hidden transition-all duration-300"
        cover={
          <div className="relative h-48 bg-gradient-to-br from-fountain-blue-100 to-fountain-blue-200 dark:from-fountain-blue-700 dark:to-fountain-blue-800">
            {book.imageUrl ? (
              <img
                alt={book.title}
                src={book.imageUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <svg className="w-16 h-16 text-fountain-blue-400 dark:text-fountain-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
            <Tag
              color={book.availability ? 'green' : 'red'}
              className="absolute top-3 right-3 text-xs font-medium"
            >
              {book.availability ? 'Disponible' : 'No disponible'}
            </Tag>
          </div>
        }
      >
        <Card.Meta
          title={
            <Typography.Title level={4} className="text-lg font-semibold text-fountain-blue-900 dark:text-fountain-blue-100 mb-2 line-clamp-2">
              {book.title}
            </Typography.Title>
          }
          description={
            <Space direction="vertical" size={4} className="w-full">
              <Typography.Text className="text-sm text-fountain-blue-700 dark:text-fountain-blue-300">
                <span className="font-medium">Autor:</span> {book.author}
              </Typography.Text>
              <Typography.Text className="text-sm text-fountain-blue-700 dark:text-fountain-blue-300">
                <span className="font-medium">Editorial:</span> {book.publisher}
              </Typography.Text>
              <Typography.Text className="text-sm text-fountain-blue-700 dark:text-fountain-blue-300">
                <span className="font-medium">Género:</span> {book.genre}
              </Typography.Text>
              <div className="flex items-center justify-between pt-2">
                <Typography.Text className="text-xl font-bold text-fountain-blue-600">
                  {formatPrice(book.price)}
                </Typography.Text>
                <Typography.Text type="secondary" className="text-xs">
                  {formatDate(book.createdAt)}
                </Typography.Text>
              </div>
            </Space>
          }
        />
        <Space className="flex justify-end mt-4 w-full">
          {onView && (
            <Button
              icon={<EyeOutlined />}
              onClick={() => onView(book)}
            >
              Ver
            </Button>
          )}
          
          {onEdit && (
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(book)}
            >
              Editar
            </Button>
          )}
          
          {onDelete && (
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => onDelete(book.id)}
            >
              Eliminar
            </Button>
          )}
        </Space>
      </Card>
    </motion.div>
  );
};
