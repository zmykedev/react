import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Book, BookFilters, BookSort, PaginationParams } from '../types/book';
import { BookService } from '../services/bookService';
import { BookFilters as BookFiltersComponent } from '../components/BookFilters';
import { BookSorting } from '../components/BookSorting';
import { BookPagination } from '../components/BookPagination';
import { BookCard } from '../components/BookCard';
import { BookForm } from '../components/BookForm';
import useStore from '../store';

const BookList: React.FC = () => {
  // Estado principal
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Store para verificar sesión
  const { getAccessToken, getUser } = useStore();
  
  // Estado de filtros y ordenamiento
  const [filters, setFilters] = useState<BookFilters>({});
  const [sort, setSort] = useState<BookSort>({ field: 'title', direction: 'asc' });
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 10 });
  
  // Estado de paginación del servidor
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Estado de datos auxiliares
  const [genres, setGenres] = useState<string[]>([]);
  const [publishers, setPublishers] = useState<string[]>([]);
  
  // Estado del formulario
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Estado de vista detallada
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookDetail, setShowBookDetail] = useState(false);

  // Ref para evitar llamadas duplicadas
  const loadingRef = useRef(false);
  const initialLoadRef = useRef(false);

  // Memorizar parámetros para evitar re-renders innecesarios
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);
  const memoizedSort = useMemo(() => sort, [sort.field, sort.direction]);
  const memoizedPagination = useMemo(() => pagination, [pagination.page, pagination.limit]);

  // Cargar datos iniciales - solo una vez
  useEffect(() => {
    if (initialLoadRef.current) return;
    
    const loadInitialData = async () => {
      if (loadingRef.current) return;
      
      try {
        loadingRef.current = true;
        setLoading(true);
        
        // Debug: Verificar estado de la sesión
        console.log('🔑 === BOOK LIST LOAD INITIAL DATA ===');
        console.log('🎫 Access Token:', getAccessToken());
        console.log('👤 User:', getUser());
        console.log('🔑 === FIN BOOK LIST LOAD INITIAL DATA ===');
        
        // Cargar datos auxiliares y libros en paralelo
        const [genresData, publishersData, booksResponse] = await Promise.all([
          BookService.getGenres(),
          BookService.getPublishers(),
          BookService.getBooks(filters, sort, pagination)
        ]);
        
        // Los datos ya están validados en el servicio
        console.log('🔍 === DATOS OBTENIDOS ===');
        console.log('📚 Genres:', genresData);
        console.log('📚 Publishers:', publishersData);
        console.log('🔍 === FIN DATOS ===');
        
        setGenres(genresData);
        setPublishers(publishersData);
        setBooks(booksResponse.books);
        setTotalItems(booksResponse.total);
        setTotalPages(booksResponse.totalPages);
        initialLoadRef.current = true;
      } catch (err) {
        setError('Error al cargar datos iniciales');
        console.error('Error loading initial data:', err);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    loadInitialData();
  }, []); // Solo se ejecuta una vez

  // Función de carga de libros memoizada
  const loadBooks = useCallback(async () => {
    if (loadingRef.current ) return;
    
    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      
      const response = await BookService.getBooks(
        memoizedFilters, 
        memoizedSort, 
        memoizedPagination
      );
      
      setBooks(response.books);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Error al cargar los libros');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [memoizedFilters, memoizedSort, memoizedPagination]);

  // Cargar libros cuando cambien los parámetros
  useEffect(() => {
      loadBooks();
  
  }, [loadBooks]);

  // Handlers memoizados para evitar re-renders
  const handleFiltersChange = useCallback((newFilters: BookFilters) => {
    setFilters(prevFilters => {
      // Solo actualizar si realmente cambió
      if (JSON.stringify(prevFilters) === JSON.stringify(newFilters)) {
        return prevFilters;
      }
      return newFilters;
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSortChange = useCallback((newSort: BookSort) => {
    setSort(prevSort => {
      // Solo actualizar si realmente cambió
      if (prevSort.field === newSort.field && prevSort.direction === newSort.direction) {
        return prevSort;
      }
      return newSort;
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => {
      if (prev.page === page) return prev;
      return { ...prev, page };
    });
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => {
      if (prev.limit === limit) return prev;
      return { page: 1, limit };
    });
  }, []);

  const handleCreateBook = useCallback(async (bookData: any) => {
    try {
      setFormLoading(true);
      await BookService.createBook(bookData);
      
      // Reload books and close form
      await loadBooks();
      setShowForm(false);
      setEditingBook(null);
    } catch (err) {
      console.error('Error creating book:', err);
      throw err;
    } finally {
      setFormLoading(false);
    }
  }, [loadBooks]);

  const handleUpdateBook = useCallback(async (bookData: any) => {
    if (!editingBook) return;
    
    try {
      setFormLoading(true);
      await BookService.updateBook(editingBook.id, bookData);
      
      // Reload books and close form
      await loadBooks();
      setShowForm(false);
      setEditingBook(null);
    } catch (err) {
      console.error('Error updating book:', err);
      throw err;
    } finally {
      setFormLoading(false);
    }
  }, [editingBook, loadBooks]);

  const handleDeleteBook = useCallback(async (bookId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      return;
    }

    try {
      await BookService.deleteBook(bookId);
      await loadBooks();
    } catch (err) {
      setError('Error al eliminar el libro');
      console.error('Error deleting book:', err);
    }
  }, [loadBooks]);

  const handleEditBook = useCallback((book: Book) => {
    setEditingBook(book);
    setShowForm(true);
  }, []);

  const handleViewBook = useCallback((book: Book) => {
    setSelectedBook(book);
    setShowBookDetail(true);
  }, []);

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingBook(null);
  }, []);

  const handleFormSubmit = useCallback(async (bookData: any) => {
    if (editingBook) {
      await handleUpdateBook(bookData);
    } else {
      await handleCreateBook(bookData);
    }
  }, [editingBook, handleUpdateBook, handleCreateBook]);

  const handleCloseBookDetail = useCallback(() => {
    setShowBookDetail(false);
  }, []);

  const handleEditFromDetail = useCallback(() => {
    if (selectedBook) {
      setShowBookDetail(false);
      handleEditBook(selectedBook);
    }
  }, [selectedBook, handleEditBook]);

  // Loading inicial
  if (loading && books.length === 0 && !initialLoadRef.current) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-primary h-12 w-12 mx-auto mb-4"></div>
          <p className="text-secondary">
            Cargando libros...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Catálogo de Libros
            </h1>
            <p className="text-secondary mt-2">
              Gestiona tu inventario de libros de manera eficiente
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary px-6 py-3 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar Libro
          </button>
        </div>

        {/* Filtros */}
        <BookFiltersComponent
          filters={memoizedFilters}
          onFiltersChange={handleFiltersChange}
          genres={genres}
          publishers={publishers}
        />

        {/* Ordenamiento */}
        <div className="mt-6">
          <BookSorting
            sort={memoizedSort}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-700 dark:text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Lista de libros */}
        <div className="mt-8">
          {(!books || books.length === 0) && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
                           <div className="w-24 h-24 mx-auto mb-4 text-muted">
               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
               </svg>
             </div>
             <h3 className="text-lg font-medium text-secondary mb-2">
               No se encontraron libros
             </h3>
             <p className="text-muted">
               Intenta ajustar los filtros o agregar un nuevo libro.
             </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books?.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEditBook}
                  onDelete={handleDeleteBook}
                  onView={handleViewBook}
                />
              ))}
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-8">
            <BookPagination
              currentPage={memoizedPagination.page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={memoizedPagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}
      </div>

      {/* Modal del formulario */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 overflow-y-auto"
            onClick={handleFormCancel}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl mx-auto my-4"
            >
              <BookForm
                book={editingBook || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={formLoading}
                genres={genres}
                publishers={publishers}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de vista detallada */}
      <AnimatePresence>
        {showBookDetail && selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseBookDetail}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 dark:bg-fountain-blue-800/90 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-fountain-blue-200 dark:border-fountain-blue-600 max-w-2xl w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-fountain-blue-900 dark:text-fountain-blue-100">
                  {selectedBook.title}
                </h2>
                <button
                  onClick={handleCloseBookDetail}
                  className="text-fountain-blue-500 hover:text-fountain-blue-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imagen */}
                <div className="space-y-4">
                  {selectedBook.imageUrl ? (
                    <img
                      src={selectedBook.imageUrl}
                      alt={selectedBook.title}
                      className="w-full h-64 object-cover rounded-lg border border-fountain-blue-300 dark:border-fountain-blue-600"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-fountain-blue-100 to-fountain-blue-200 dark:from-fountain-blue-700 dark:to-fountain-blue-800 rounded-lg border border-fountain-blue-300 dark:border-fountain-blue-600 flex items-center justify-center">
                      <svg className="w-24 h-24 text-fountain-blue-400 dark:text-fountain-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Badge de disponibilidad */}
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    selectedBook.availability
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {selectedBook.availability ? 'Disponible' : 'No disponible'}
                  </div>
                </div>

                {/* Información del libro */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-fountain-blue-900 dark:text-fountain-blue-100 mb-2">
                      Información del Libro
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-fountain-blue-700 dark:text-fountain-blue-300">Autor:</span>
                        <p className="text-fountain-blue-900 dark:text-fountain-blue-100">{selectedBook.author}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-fountain-blue-700 dark:text-fountain-blue-300">Editorial:</span>
                        <p className="text-fountain-blue-900 dark:text-fountain-blue-100">{selectedBook.publisher}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-fountain-blue-700 dark:text-fountain-blue-300">Género:</span>
                        <p className="text-fountain-blue-900 dark:text-fountain-blue-100">{selectedBook.genre}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-fountain-blue-700 dark:text-fountain-blue-300">Precio:</span>
                        <p className="text-2xl font-bold text-fountain-blue-600">
                          {new Intl.NumberFormat('es-CL', {
                            style: 'currency',
                            currency: 'CLP'
                          }).format(selectedBook.price)}
                        </p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-fountain-blue-700 dark:text-fountain-blue-300">Fecha de creación:</span>
                        <p className="text-fountain-blue-900 dark:text-fountain-blue-100">
                          {new Date(selectedBook.createdAt).toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleEditFromDetail}
                      className="flex-1 bg-fountain-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-fountain-blue-700 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={handleCloseBookDetail}
                      className="flex-1 border border-fountain-blue-600 text-fountain-blue-600 dark:text-fountain-blue-400 px-4 py-2 rounded-lg font-medium hover:bg-fountain-blue-600 hover:text-white transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookList;