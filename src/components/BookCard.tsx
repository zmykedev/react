import React from 'react';
import type { Book } from '../types/book';
import { motion } from 'framer-motion';
import { Tag, Typography, Button } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, BookOutlined } from '@ant-design/icons';
import { useImageWithFallback } from '../hooks/useImageWithFallback';

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
  const { imageSrc, imageError, imageLoading } = useImageWithFallback({
    src: book.imageUrl,
    retryAttempts: 3,
    retryDelay: 1000,
  });

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
      initial={{ opacity: 0, scale: 0.95, rotateX: -10 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        rotateX: 5,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="w-full group"
    >
      <div className="relative bg-white/95 dark:bg-fountain-blue-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-fountain-blue-200/50 dark:border-fountain-blue-600/50 overflow-hidden transition-all duration-500 hover:shadow-fountain-blue-500/20 hover:shadow-3xl">
        {/* Gradient overlay for modern effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-fountain-blue-50/30 via-transparent to-fountain-blue-100/20 dark:from-fountain-blue-900/30 dark:via-transparent dark:to-fountain-blue-800/20 pointer-events-none" />
        
        {/* Image section with modern styling */}
        <div className="relative h-52 bg-gradient-to-br from-fountain-blue-100 via-fountain-blue-50 to-fountain-blue-200 dark:from-fountain-blue-700 dark:via-fountain-blue-800 dark:to-fountain-blue-900 overflow-hidden">
          {/* Decorative geometric shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-fountain-blue-300/20 to-transparent dark:from-fountain-blue-500/20 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-fountain-blue-400/15 to-transparent dark:from-fountain-blue-600/15 rounded-full translate-y-12 -translate-x-12" />
          {imageSrc && !imageError ? (
            <motion.img
              key={imageSrc} // Force re-render when URL changes
              alt={`Portada del libro: ${book.title}`}
              src={imageSrc}
              className="w-full h-full object-contain relative z-10"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            // Show placeholder when no image URL, loading, or error
            <div className="image-fallback flex items-center justify-center h-full relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {imageLoading ? (
                  <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-fountain-blue-400 dark:border-fountain-blue-500"></div>
                ) : (
                  <BookOutlined className="w-20 h-20 text-fountain-blue-400 dark:text-fountain-blue-500" />
                )}
              </motion.div>
            </div>
          )}
          
          {/* Modern availability tag */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4 z-20"
          >
            <Tag
              color={book.availability ? 'success' : 'error'}
              className="px-3 py-1 rounded-full text-xs font-semibold shadow-lg border-0 backdrop-blur-sm"
              style={{
                background: book.availability 
                  ? 'linear-gradient(135deg, #52c41a, #73d13d)' 
                  : 'linear-gradient(135deg, #ff4d4f, #ff7875)',
                color: 'white',
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                zIndex: 20
              }}
            >
              {book.availability ? 'Disponible' : 'No disponible'}
            </Tag>
          </motion.div>
        </div>

        {/* Content section with modern typography */}
        <div className="p-6 relative z-10">
          {/* Title with 3D effect */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <Typography.Title
              level={4}
              className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight"
              style={{
                background: 'none',
                fontWeight: 700,
                margin: 0,
                // Simple shadow for both light and dark themes
                textShadow: `
                  0 2px 4px rgba(0, 0, 0, 0.1),
                  0 1px 2px rgba(0, 0, 0, 0.06)
                `,
              }}
            >
              {book.title}
            </Typography.Title>
          </motion.div>

          {/* Book details with modern layout */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 mb-6"
          >
           
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-fountain-blue-400 rounded-full" />
              <Typography.Text className="text-sm text-fountain-blue-700 dark:text-fountain-blue-300 font-medium truncate">
                {book.publisher}
              </Typography.Text>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-fountain-blue-400 rounded-full" />
              <Typography.Text className="text-sm text-fountain-blue-700 dark:text-fountain-blue-300 font-medium truncate">
                {book.genre}
              </Typography.Text>
            </div>
          </motion.div>

          {/* Price and date section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="bg-gradient-to-r from-fountain-blue-500 to-fountain-blue-600 text-white px-4 py-2 rounded-xl shadow-lg">
              <Typography.Text className="text-xl font-bold text-white">
                {formatPrice(book.price)}
              </Typography.Text>
            </div>
            <Typography.Text type="secondary" className="text-xs opacity-70">
              {formatDate(book.createdAt)}
            </Typography.Text>
          </motion.div>

          {/* Ver button in top left corner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-7 left-[190px] z-20"
          >
            <Button
              icon={<EyeOutlined />}
              onClick={() => onView && onView(book)}
              className="h-8 px-3 rounded-full border-fountain-blue-300 text-fountain-blue-600 hover:bg-fountain-blue-50 dark:border-fountain-blue-600 dark:text-fountain-blue-400 dark:hover:bg-fountain-blue-800/50 transition-all duration-300 hover:scale-105"
              style={{ fontWeight: 500, minWidth: 70 }}
              disabled={!onView}
              size="small"
            >
              Ver
            </Button>
          </motion.div>

          {/* Edit and Delete buttons at bottom right */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-2"
          >
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit && onEdit(book)}
              className="h-10 px-4 rounded-xl border-fountain-blue-300 text-fountain-blue-600 hover:bg-fountain-blue-50 dark:border-fountain-blue-600 dark:text-fountain-blue-400 dark:hover:bg-fountain-blue-800/50 transition-all duration-300 hover:scale-105"
              style={{ fontWeight: 500, minWidth: 90 }}
              disabled={!onEdit}
            >
              Editar
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => onDelete && onDelete(book.id)}
              className="h-10 px-4 rounded-xl transition-all duration-300 hover:scale-105"
              style={{ fontWeight: 500, minWidth: 90 }}
              disabled={!onDelete}
            >
              Eliminar
            </Button>
          </motion.div>
        </div>

        {/* Subtle border glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fountain-blue-400/20 via-transparent to-fountain-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};
