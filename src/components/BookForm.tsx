import React, { useState } from 'react';
import type { Book, BookFormData } from '../types/book';
import { motion } from 'framer-motion';
import { Form, Input, InputNumber, Select, Switch, Button, Upload, Typography, Space, message } from 'antd';
import { UploadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { BookService } from '../services/bookService';

type BookFormErrors = Partial<Record<keyof BookFormData, string>>;

interface BookFormProps {
  book?: Book;
  onSubmit: (bookData: BookFormData, imageFile?: File) => Promise<void>;
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
    imageUrl: book?.imageUrl || '',
    description: book?.description || ''
  });

  const [errors, setErrors] = useState<BookFormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(book?.imageUrl || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  // const [touched, setTouched] = useState<Set<keyof BookFormData>>(new Set()); // Removed unused touched state

  const isEditMode = !!book;

  // Function to handle image upload
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      setUploadingImage(true);
      
      // If we're in edit mode and have a book ID, upload with bookId
      if (isEditMode && book?.id) {
        const uploadResult = await BookService.uploadBookImage(file, book.id);
        message.success('Imagen subida exitosamente');
        return uploadResult.url;
      } else {
        // For new books, we'll upload the image after creating the book
        // For now, just return a placeholder or handle differently
        message.warning('La imagen se subirá después de crear el libro');
        return '';
      }
    } catch (error) {
      message.error('Error al subir la imagen');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

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
    // setTouched(prev => new Set(prev).add(name)); // No longer needed
    validateField(name, formData[name]);
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { // No longer needed
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     // Validate file type
  //     if (!file.type.startsWith('image/')) {
  //       setErrors(prev => ({ ...prev, image: 'Solo se permiten archivos de imagen' }));
  //       return;
  //     }

  //     // Validate file size (max 5MB)
  //     if (file.size > 5 * 1024 * 1024) {
  //       setErrors(prev => ({ ...prev, image: 'La imagen no puede ser mayor a 5MB' }));
  //       return;
  //     }

  //     setErrors(prev => ({ ...prev, image: undefined }));
  //     handleChange('image', file);

  //     // Create preview
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setImagePreview(e.target?.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => { // Replaced by Ant Design Form's onFinish
  //   e.preventDefault();
    
  //   // Mark all fields as touched
  //   const allFields: (keyof BookFormData)[] = ['title', 'author', 'publisher', 'price', 'genre', 'availability'];
  //   setTouched(new Set(allFields));

  //   // Validar todos los campos antes de enviar
  //   let hasErrors = false;
  //   const newErrors: BookFormErrors = {};
    
  //   allFields.forEach(field => {
  //     validateField(field, formData[field]);
  //     if (errors[field]) {
  //       hasErrors = true;
  //     }
  //   });
    
  //   if (!hasErrors) {
  //     await onSubmit(formData);
  //   }
  // };

  // const isFieldValid = (field: keyof BookFormData) => { // No longer needed with Ant Design Form validation
  //   return formData[field] && !errors[field];
  // };

  // Validación simple para habilitar el botón
  // const requiredFields: (keyof BookFormData)[] = ['title', 'author', 'publisher', 'price', 'genre', 'availability']; // No longer needed
  
  // const canSubmit = requiredFields.every(field => { // No longer needed
  //   const value = formData[field];
    
  //   if (field === 'availability') {
  //     return typeof value === 'boolean';
  //   }
    
  //   if (field === 'price') {
  //     return typeof value === 'number' && value >= 0;
  //   }
    
  //   // Para campos de texto
  //   return typeof value === 'string' && value.trim().length > 0;
  // });
  
  // console.log('=== VALIDACIÓN SIMPLE ==='); // No longer needed
  // console.log('formData:', formData); // No longer needed
  // console.log('canSubmit:', canSubmit); // No longer needed
  // console.log('=== FIN VALIDACIÓN ==='); // No longer needed

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-fountain-blue-800/50 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-fountain-blue-200 dark:border-fountain-blue-600 max-w-5xl mx-auto w-full"
    >
      <Typography.Title level={2} className="text-2xl font-bold text-fountain-blue-900 dark:text-fountain-blue-100 mb-4 text-center">
        {isEditMode ? 'Editar Libro' : 'Agregar Nuevo Libro'}
      </Typography.Title>

      <Form
        layout="vertical"
        onFinish={async (values) => {
          try {
            let finalFormData = { ...formData, ...values };
            let imageFile: File | undefined;
            
            console.log('📝 Form submitted with values:', values);
            console.log('📝 Form data image:', formData.image);
            console.log('📝 Is edit mode:', isEditMode);
            console.log('📝 Book ID:', book?.id);
            
            // If there's a new image file, handle it based on mode
            if (formData.image) {
              console.log('🖼️ Image file found:', formData.image);
              if (isEditMode && book?.id) {
                // In edit mode, upload image with bookId
                console.log('✏️ Edit mode: uploading image immediately');
                const imageUrl = await handleImageUpload(formData.image);
                finalFormData.imageUrl = imageUrl;
              } else {
                // In create mode, keep the file for later upload
                console.log('➕ Create mode: keeping file for later upload');
                imageFile = formData.image;
              }
              // Remove the file object as it's not needed in the final submission
              delete finalFormData.image;
            } else {
              console.log('ℹ️ No image file in form data');
            }
            
            console.log('📤 Submitting with finalFormData:', finalFormData);
            console.log('📤 Submitting with imageFile:', imageFile);
            
            await onSubmit(finalFormData, imageFile);
          } catch (error) {
            console.error('Error submitting form:', error);
          }
        }}
        initialValues={formData}
        className="space-y-4"
      >
        {/* Título - Ancho completo */}
        <Form.Item
          label="Título *"
          name="title"
          rules={[{ required: true, message: 'Por favor ingresa el título del libro' }]}
          validateStatus={errors.title ? 'error' : undefined}
          help={errors.title}
        >
          <Input
            placeholder="Ingresa el título del libro"
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
          />
        </Form.Item>

        {/* Primera fila: Autor, Editorial, Género */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Form.Item
            label="Autor *"
            name="author"
            rules={[{ required: true, message: 'Por favor ingresa el nombre del autor' }]}
            validateStatus={errors.author ? 'error' : undefined}
            help={errors.author}
          >
            <Input
              placeholder="Ingresa el nombre del autor"
              onChange={(e) => handleChange('author', e.target.value)}
              onBlur={() => handleBlur('author')}
            />
          </Form.Item>

          <Form.Item
            label="Editorial *"
            name="publisher"
            rules={[{ required: true, message: 'Por favor selecciona una editorial' }]}
            validateStatus={errors.publisher ? 'error' : undefined}
            help={errors.publisher}
          >
            <Select
              placeholder="Selecciona una editorial"
              onChange={(value) => handleChange('publisher', value)}
              onBlur={() => handleBlur('publisher')}
            >
              <Select.Option value="">Selecciona una editorial</Select.Option>
              {publishers && publishers.length > 0 ? (
                publishers.map((publisher) => (
                  <Select.Option key={publisher} value={publisher}>
                    {publisher}
                  </Select.Option>
                ))
              ) : (
                <>
                  <Select.Option value="Penguin Random House">Penguin Random House</Select.Option>
                  <Select.Option value="HarperCollins">HarperCollins</Select.Option>
                  <Select.Option value="Simon & Schuster">Simon & Schuster</Select.Option>
                  <Select.Option value="Hachette Book Group">Hachette Book Group</Select.Option>
                  <Select.Option value="Macmillan Publishers">Macmillan Publishers</Select.Option>
                  <Select.Option value="Scholastic">Scholastic</Select.Option>
                  <Select.Option value="Bloomsbury">Bloomsbury</Select.Option>
                  <Select.Option value="Faber & Faber">Faber & Faber</Select.Option>
                  <Select.Option value="Vintage Books">Vintage Books</Select.Option>
                  <Select.Option value="Knopf Doubleday">Knopf Doubleday</Select.Option>
                  <Select.Option value="W.W. Norton">W.W. Norton</Select.Option>
                  <Select.Option value="Houghton Mifflin Harcourt">Houghton Mifflin Harcourt</Select.Option>
                  <Select.Option value="Little, Brown and Company">Little, Brown and Company</Select.Option>
                  <Select.Option value="Crown Publishing">Crown Publishing</Select.Option>
                  <Select.Option value="Other">Otra</Select.Option>
                </>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            label="Género *"
            name="genre"
            rules={[{ required: true, message: 'Por favor selecciona un género' }]}
            validateStatus={errors.genre ? 'error' : undefined}
            help={errors.genre}
          >
            <Select
              placeholder="Selecciona un género"
              onChange={(value) => handleChange('genre', value)}
              onBlur={() => handleBlur('genre')}
            >
              <Select.Option value="">Selecciona un género</Select.Option>
              {genres && genres.length > 0 ? (
                genres.map((genre) => (
                  <Select.Option key={genre} value={genre}>
                    {genre}
                  </Select.Option>
                ))
              ) : (
                <>
                  <Select.Option value="Ficción">Ficción</Select.Option>
                  <Select.Option value="No Ficción">No Ficción</Select.Option>
                  <Select.Option value="Ciencia Ficción">Ciencia Ficción</Select.Option>
                  <Select.Option value="Fantasía">Fantasía</Select.Option>
                  <Select.Option value="Misterio">Misterio</Select.Option>
                  <Select.Option value="Romance">Romance</Select.Option>
                  <Select.Option value="Terror">Terror</Select.Option>
                  <Select.Option value="Histórico">Histórico</Select.Option>
                  <Select.Option value="Biografía">Biografía</Select.Option>
                  <Select.Option value="Autoayuda">Autoayuda</Select.Option>
                  <Select.Option value="Tecnología">Tecnología</Select.Option>
                  <Select.Option value="Cocina">Cocina</Select.Option>
                  <Select.Option value="Viajes">Viajes</Select.Option>
                  <Select.Option value="Arte">Arte</Select.Option>
                  <Select.Option value="Filosofía">Filosofía</Select.Option>
                  <Select.Option value="Religión">Religión</Select.Option>
                  <Select.Option value="Otro">Otro</Select.Option>
                </>
              )}
            </Select>
          </Form.Item>
        </div>

        {/* Segunda fila: Precio, Disponibilidad */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Form.Item
            label="Precio *"
            name="price"
            rules={[{ required: true, message: 'Por favor ingresa el precio' }, { type: 'number', min: 0, message: 'El precio debe ser un número positivo' }]} // Adjust message for consistency
            validateStatus={errors.price ? 'error' : undefined}
            help={errors.price}
          >
            <InputNumber
              min={0}
              step={100}
              placeholder="0"
              onChange={(value) => handleChange('price', value)}
              onBlur={() => handleBlur('price')}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Disponibilidad"
            name="availability"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Disponible"
              unCheckedChildren="No disponible"
              onChange={(checked) => handleChange('availability', checked)}
            />
          </Form.Item>
        </div>

        {/* Descripción - Ancho completo pero más compacta */}
        <Form.Item
          label="Descripción (opcional)"
          name="description"
        >
          <Input.TextArea
            rows={2}
            placeholder="Ingresa una breve descripción del libro..."
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </Form.Item>

        {/* Imagen - Ancho completo */}
        <Form.Item
          label="Imagen del libro (opcional)"
          name="image"
          validateStatus={errors.image ? 'error' : undefined}
          help={errors.image}
        >
          <Upload
            accept="image/*"
            beforeUpload={() => false} // Prevent automatic upload
            showUploadList={false}
            onChange={(info) => {
              const file = info.fileList[0]?.originFileObj;
              if (file) {
                if (!file.type.startsWith('image/')) {
                  setErrors(prev => ({ ...prev, image: 'Solo se permiten archivos de imagen' }));
                  return;
                }
                if (file.size > 5 * 1024 * 1024) {
                  setErrors(prev => ({ ...prev, image: 'La imagen no puede ser mayor a 5MB' }));
                  return;
                }
                setErrors(prev => ({ ...prev, image: undefined }));
                handleChange('image', file);

                const reader = new FileReader();
                reader.onload = (e) => {
                  setImagePreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
              } else {
                setImagePreview(null);
                handleChange('image', undefined);
              }
            }}
          >
            <Button 
              icon={<UploadOutlined />} 
              loading={uploadingImage}
              disabled={uploadingImage}
            >
              {uploadingImage ? 'Subiendo...' : 'Seleccionar Archivo'}
            </Button>
          </Upload>
          {imagePreview && (
            <div className="relative inline-block mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border border-fountain-blue-300 dark:border-fountain-blue-600"
              />
              <Button
                type="text"
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  setImagePreview(null);
                  handleChange('image', undefined);
                  setErrors(prev => ({ ...prev, image: undefined }));
                }}
                className="absolute -top-2 -right-2 text-red-500 hover:text-red-700"
                shape="circle"
                size="small"
              />
            </div>
          )}
          <Typography.Text type="secondary" className="block text-xs mt-1">
            Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
          </Typography.Text>
        </Form.Item>

        {/* Botones - Centrados y más compactos */}
        <Space className="flex justify-end pt-2">
          <Button
            onClick={onCancel}
            size="large"
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading || uploadingImage}
            disabled={isLoading || uploadingImage}
            size="large"
          >
            {isLoading ? 'Guardando...' : uploadingImage ? 'Subiendo imagen...' : (isEditMode ? 'Actualizar' : 'Crear')}
          </Button>
        </Space>
      </Form>
    </motion.div>
  );
};
