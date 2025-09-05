import React, { useState, useEffect } from 'react';
import type { Book, BookFormData } from '../types/book';
import { motion, AnimatePresence } from 'framer-motion';

type BookFormErrors = Partial<Record<keyof BookFormData, string>>;

interface BookFormProps {
  book?: Book;
  onSubmit: (bookData: BookFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  genres: string[];
  publishers: string[];
}

export const BookForm: React.FC<BookFormProps> = ({
  book,
  onSubmit,
  onCancel,
  isLoading = false,
  genres,
  publishers
}) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: book?.title || '',
    author: book?.author || '',
    publisher: book?.publisher || '',
    price: book?.price || 0,
    genre: book?.genre || '',
    availability: book?.availability ?? true,
    image: undefined,

    description: book?.description || ''
  });

  const [errors, setErrors] = useState<BookFormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(book?.imageUrl || null);
  const [touched, setTouched] = useState<Set<keyof BookFormData>>(new Set());

  const isEditMode = !!book;

  // Validación simple
  const validateField = (name: keyof BookFormData, value: any) => {
    // No validar campos opcionales
    if (name === 'image' || name === 'description') return;
    
    let errorMessage = '';
    
    if (name === 'title' || name === 'author') {
      if (!value || value.trim().length < 2) {
        errorMessage = `El ${name === 'title' ? 'título' : 'autor'} debe tener al menos 2 caracteres`;
      }
    } else if (name === 'publisher' || name === 'genre') {
      if (!value || value.trim().length === 0) {
        errorMessage = `El ${name === 'publisher' ? 'editorial' : 'género'} es requerido`;
      }
    } else if (name === 'price') {
      if (typeof value !== 'number' || value < 0) {
        errorMessage = 'El precio debe ser un número positivo';
      }
    }
    
    if (errorMessage) {
      setErrors(prev => ({ ...prev, [name]: errorMessage }));
    } else {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleChange = (name: keyof BookFormData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (name: keyof BookFormData) => {
    setTouched(prev => new Set(prev).add(name));
    validateField(name, formData[name]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Solo se permiten archivos de imagen' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'La imagen no puede ser mayor a 5MB' }));
        return;
      }

      setErrors(prev => ({ ...prev, image: undefined }));
      handleChange('image', file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields: (keyof BookFormData)[] = ['title', 'author', 'publisher', 'price', 'genre', 'availability'];
    setTouched(new Set(allFields));

    // Validar todos los campos antes de enviar
    let hasErrors = false;
    const newErrors: BookFormErrors = {};
    
    allFields.forEach(field => {
      validateField(field, formData[field]);
      if (errors[field]) {
        hasErrors = true;
      }
    });
    
    if (!hasErrors) {
      await onSubmit(formData);
    }
  };

  const isFieldValid = (field: keyof BookFormData) => {
    return formData[field] && !errors[field];
  };

  // Validación simple para habilitar el botón
  const requiredFields: (keyof BookFormData)[] = ['title', 'author', 'publisher', 'price', 'genre', 'availability'];
  
  const canSubmit = requiredFields.every(field => {
    const value = formData[field];
    
    if (field === 'availability') {
      return typeof value === 'boolean';
    }
    
    if (field === 'price') {
      return typeof value === 'number' && value >= 0;
    }
    
    // Para campos de texto
    return typeof value === 'string' && value.trim().length > 0;
  });
  
  console.log('=== VALIDACIÓN SIMPLE ===');
  console.log('formData:', formData);
  console.log('canSubmit:', canSubmit);
  console.log('=== FIN VALIDACIÓN ===');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-fountain-blue-800/50 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-fountain-blue-200 dark:border-fountain-blue-600 max-w-5xl mx-auto w-full"
    >
      <h2 className="text-2xl font-bold text-fountain-blue-900 dark:text-fountain-blue-100 mb-4 text-center">
        {isEditMode ? 'Editar Libro' : 'Agregar Nuevo Libro'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título - Ancho completo */}
        <div>
          <label className="block text-sm font-medium text-fountain-blue-700 dark:text-fountain-blue-300 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fountain-blue-500 focus:border-transparent bg-white/50 dark:bg-fountain-blue-900/50 text-fountain-blue-900 dark:text-fountain-blue-100 placeholder-fountain-blue-400 ${
              errors.title && touched.has('title')
                ? 'border-red-500'
                : 'border-fountain-blue-300 dark:border-fountain-blue-600'
            }`}
            placeholder="Ingresa el título del libro"
          />
          <AnimatePresence>
            {errors.title && touched.has('title') && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.title}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Primera fila: Autor, Editorial, Género */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-fountain-blue-700 dark:text-fountain-blue-300 mb-2">
              Autor *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              onBlur={() => handleBlur('author')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fountain-blue-500 focus:border-transparent bg-white/50 dark:bg-fountain-blue-900/50 text-fountain-blue-900 dark:text-fountain-blue-100 placeholder-fountain-blue-400 ${
                errors.author && touched.has('author')
                  ? 'border-red-500'
                  : 'border-fountain-blue-300 dark:border-fountain-blue-600'
              }`}
              placeholder="Ingresa el nombre del autor"
            />
            <AnimatePresence>
              {errors.author && touched.has('author') && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.author}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-fountain-blue-700 dark:text-fountain-blue-300 mb-2">
              Editorial *
            </label>
            <select
              value={formData.publisher}
              onChange={(e) => handleChange('publisher', e.target.value)}
              onBlur={() => handleBlur('publisher')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fountain-blue-500 focus:border-transparent bg-white/50 dark:bg-fountain-blue-900/50 text-fountain-blue-900 dark:text-fountain-blue-100 ${
                errors.publisher && touched.has('publisher')
                  ? 'border-red-500'
                  : 'border-fountain-blue-300 dark:border-fountain-blue-600'
              }`}
            >
              <option value="">Selecciona una editorial</option>
              {/* Editoriales del backend */}
              {publishers && publishers.length > 0 ? (
                publishers.map((publisher) => (
                  <option key={publisher} value={publisher}>
                    {publisher}
                  </option>
                ))
              ) : (
                // Editoriales por defecto si no hay datos del backend
                <>
                  <option value="Penguin Random House">Penguin Random House</option>
                  <option value="HarperCollins">HarperCollins</option>
                  <option value="Simon & Schuster">Simon & Schuster</option>
                  <option value="Hachette Book Group">Hachette Book Group</option>
                  <option value="Macmillan Publishers">Macmillan Publishers</option>
                  <option value="Scholastic">Scholastic</option>
                  <option value="Bloomsbury">Bloomsbury</option>
                  <option value="Faber & Faber">Faber & Faber</option>
                  <option value="Vintage Books">Vintage Books</option>
                  <option value="Knopf Doubleday">Knopf Doubleday</option>
                  <option value="W.W. Norton">W.W. Norton</option>
                  <option value="Houghton Mifflin Harcourt">Houghton Mifflin Harcourt</option>
                  <option value="Little, Brown and Company">Little, Brown and Company</option>
                  <option value="Crown Publishing">Crown Publishing</option>
                  <option value="Other">Otra</option>
                </>
              )}
            </select>
            <AnimatePresence>
              {errors.publisher && touched.has('publisher') && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.publisher}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-fountain-blue-700 dark:text-fountain-blue-300 mb-2">
              Género *
            </label>
            <select
              value={formData.genre}
              onChange={(e) => handleChange('genre', e.target.value)}
              onBlur={() => handleBlur('genre')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fountain-blue-500 focus:border-transparent bg-white/50 dark:bg-fountain-blue-900/50 text-fountain-blue-900 dark:text-fountain-blue-100 ${
                errors.genre && touched.has('genre')
                  ? 'border-red-500'
                  : 'border-fountain-blue-300 dark:border-fountain-blue-600'
              }`}
            >
              <option value="">Selecciona un género</option>
              {/* Géneros del backend */}
              {genres && genres.length > 0 ? (
                genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))
              ) : (
                // Géneros por defecto si no hay datos del backend
                <>
                  <option value="Ficción">Ficción</option>
                  <option value="No Ficción">No Ficción</option>
                  <option value="Ciencia Ficción">Ciencia Ficción</option>
                  <option value="Fantasía">Fantasía</option>
                  <option value="Misterio">Misterio</option>
                  <option value="Romance">Romance</option>
                  <option value="Terror">Terror</option>
                  <option value="Histórico">Histórico</option>
                  <option value="Biografía">Biografía</option>
                  <option value="Autoayuda">Autoayuda</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Cocina">Cocina</option>
                  <option value="Viajes">Viajes</option>
                  <option value="Arte">Arte</option>
                  <option value="Filosofía">Filosofía</option>
                  <option value="Religión">Religión</option>
                  <option value="Otro">Otro</option>
                </>
              )}
            </select>
            <AnimatePresence>
              {errors.genre && touched.has('genre') && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.genre}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Segunda fila: Precio, Disponibilidad */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fountain-blue-700 dark:text-fountain-blue-300 mb-2">
              Precio *
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={formData.price}
              onChange={(e) => handleChange('price', Number(e.target.value))}
              onBlur={() => handleBlur('price')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fountain-blue-500 focus:border-transparent bg-white/50 dark:bg-fountain-blue-900/50 text-fountain-blue-900 dark:text-fountain-blue-100 ${
                errors.price && touched.has('price')
                  ? 'border-red-500'
                  : 'border-fountain-blue-300 dark:border-fountain-blue-600'
              }`}
              placeholder="0"
            />
            <AnimatePresence>
              {errors.price && touched.has('price') && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.price}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="availability"
                checked={formData.availability}
                onChange={(e) => handleChange('availability', e.target.checked)}
                className="w-4 h-4 text-fountain-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-fountain-blue-500 focus:ring-2"
              />
              <label htmlFor="availability" className="ml-2 text-sm font-medium text-fountain-blue-700 dark:text-fountain-blue-300">
                Libro disponible
              </label>
            </div>
          </div>


        </div>

        {/* Descripción - Ancho completo pero más compacta */}
        <div>
          <label className="block text-sm font-medium text-fountain-blue-700 dark:text-fountain-blue-300 mb-2">
            Descripción (opcional)
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-fountain-blue-300 dark:border-fountain-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-fountain-blue-500 focus:border-transparent bg-white/50 dark:bg-fountain-blue-900/50 text-fountain-blue-900 dark:text-fountain-blue-100 placeholder-fountain-blue-400 resize-none"
            placeholder="Ingresa una breve descripción del libro..."
          />
        </div>

        {/* Imagen - Ancho completo */}
        <div>
          <label className="block text-sm font-medium text-fountain-blue-700 dark:text-fountain-blue-300 mb-2">
            Imagen del libro
          </label>
          <div className="space-y-3">
            {/* Preview de imagen */}
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-fountain-blue-300 dark:border-fountain-blue-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    handleChange('image', undefined);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            )}

            {/* Input de archivo */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-fountain-blue-300 dark:border-fountain-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-fountain-blue-500 focus:border-transparent bg-white/50 dark:bg-fountain-blue-900/50 text-fountain-blue-900 dark:text-fountain-blue-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fountain-blue-600 file:text-white hover:file:bg-fountain-blue-700"
            />
            <p className="text-xs text-fountain-blue-500 dark:text-fountain-blue-400">
              Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
            </p>
            <AnimatePresence>
              {errors.image && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-red-600"
                >
                  {errors.image}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Botones - Centrados y más compactos */}
        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-fountain-blue-600 text-fountain-blue-600 dark:text-fountain-blue-400 rounded-lg font-medium hover:bg-fountain-blue-600 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSubmit || isLoading}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              canSubmit && !isLoading
                ? 'bg-fountain-blue-600 text-white hover:bg-fountain-blue-700'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
