import React, { useState } from 'react';
import type { Book, BookFormData } from '../types/book';
import { motion } from 'framer-motion';
import { Form, Input, InputNumber, Select, Switch, Button, Upload, Typography, Space, message } from 'antd';
import { UploadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { BookService } from '../services/bookService';

type BookFormErrors = Partial<Record<keyof BookFormData, string>>;

interface EditBookFormProps {
  book: Book;
  onSubmit: (bookData: BookFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  genres: string[];
  publishers: string[];
}

export const EditBookForm: React.FC<EditBookFormProps> = ({
  book,
  onSubmit,
  onCancel,
  isLoading = false,
  genres,
  publishers
}) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: book.title || '',
    author: book.author || '',
    publisher: book.publisher || '',
    price: book.price || 0,
    genre: book.genre || '',
    availability: book.availability ?? true,
    image: undefined,
    imageUrl: book.imageUrl || '',
    description: book.description || ''
  });

  const [errors, setErrors] = useState<BookFormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(book.imageUrl || null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Function to validate image file
  const validateImageFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, GIF, WebP';
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'El archivo es demasiado grande. Tamaño máximo: 5MB';
    }

    return null; // No errors
  };

  // Function to handle image upload
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      setUploadingImage(true);
      
      // Validate file before upload
      const validationError = validateImageFile(file);
      if (validationError) {
        throw new Error(validationError);
      }
      
      const uploadResult = await BookService.uploadImageOnly(file);
      message.success('Imagen subida exitosamente');
      return uploadResult.imageUrl;
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al subir la imagen';
      message.error(errorMessage);
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
      // Solo validar si tiene valor, permitir vacío para edición
      if (value !== null && value !== undefined && (typeof value !== 'number' || value < 0)) {
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
    validateField(name, formData[name]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 dark:bg-fountain-blue-800/70 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-fountain-blue-300 dark:border-fountain-blue-700 max-w-2xl xl:max-w-none mx-auto w-full"
      style={{
        minWidth: 360,
        maxWidth: 600,
        maxHeight: 800,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography.Title
        level={2}
        className="text-2xl font-bold text-fountain-blue-900 dark:text-fountain-blue-100 mb-4 text-center"
        style={{ marginBottom: 16, fontSize: 22 }}
      >
        Editar Libro
      </Typography.Title>

      <Form
        layout="vertical"
        onFinish={async (values) => {
          try {
            let finalFormData = { ...formData, ...values };

            // If there's a new image file, upload it first
            if (formData.image) {
              const imageUrl = await handleImageUpload(formData.image);
              finalFormData.imageUrl = imageUrl;
              // Remove the file object as it's not needed in the final submission
              delete finalFormData.image;
            }

            await onSubmit(finalFormData);
          } catch (error) {
            console.error('Error submitting form:', error);
            message.error('Error al procesar el formulario. Inténtalo de nuevo.');
          }
        }}
        initialValues={formData}
        className="space-y-3"
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: 8,
          marginBottom: 0,
        }}
      >
        {/* Título - Ancho completo */}
        <Form.Item
          label="Título *"
          name="title"
          rules={[{ required: true, message: 'Por favor ingresa el título del libro' }]}
          validateStatus={errors.title ? 'error' : undefined}
          help={errors.title}
          style={{ marginBottom: 10 }}
        >
          <Input
            placeholder="Ingresa el título del libro"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            style={{ height: 32, fontSize: 14 }}
            maxLength={80}
          />
        </Form.Item>

        {/* Primera fila: Autor, Editorial, Género */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2" style={{ marginBottom: 8 }}>
          <Form.Item
            label="Autor *"
            name="author"
            rules={[{ required: true, message: 'Por favor ingresa el nombre del autor' }]}
            validateStatus={errors.author ? 'error' : undefined}
            help={errors.author}
            style={{ marginBottom: 0 }}
          >
            <Input
              placeholder="Ingresa el nombre del autor"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              onBlur={() => handleBlur('author')}
              style={{ height: 32, fontSize: 14 }}
              maxLength={60}
            />
          </Form.Item>

          <Form.Item
            label="Editorial *"
            name="publisher"
            rules={[{ required: true, message: 'Por favor selecciona una editorial' }]}
            validateStatus={errors.publisher ? 'error' : undefined}
            help={errors.publisher}
            style={{ marginBottom: 0 }}
          >
            <Select
              placeholder="Selecciona una editorial"
              value={formData.publisher}
              onChange={(value) => handleChange('publisher', value)}
              onBlur={() => handleBlur('publisher')}
              style={{ height: 32, fontSize: 14 }}
              dropdownStyle={{ fontSize: 14 }}
            >
              <Select.Option value="">Selecciona una editorial</Select.Option>
              {publishers && publishers.length > 0 ? (
                publishers.map((publisher) => (
                  <Select.Option key={publisher} value={publisher}>
                    {publisher}
                  </Select.Option>
                ))
              ) : null}
            </Select>
          </Form.Item>

          <Form.Item
            label="Género *"
            name="genre"
            rules={[{ required: true, message: 'Por favor selecciona un género' }]}
            validateStatus={errors.genre ? 'error' : undefined}
            help={errors.genre}
            style={{ marginBottom: 0 }}
          >
            <Select
              placeholder="Selecciona un género"
              value={formData.genre}
              onChange={(value) => handleChange('genre', value)}
              onBlur={() => handleBlur('genre')}
              style={{ height: 32, fontSize: 14 }}
              dropdownStyle={{ fontSize: 14 }}
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2" style={{ marginBottom: 8 }}>
          <Form.Item
            label="Precio *"
            name="price"
            rules={[
              { required: true, message: 'Por favor ingresa el precio' }
            ]}
            validateStatus={errors.price ? 'error' : undefined}
            help={errors.price}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              min={0}
              step={100}
              placeholder="0"
              value={formData.price}
              onChange={(value) => handleChange('price', value)}
              onBlur={() => handleBlur('price')}
              className="w-full"
              style={{ height: 32, fontSize: 14, width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Disponibilidad"
            name="availability"
            valuePropName="checked"
            style={{ marginBottom: 0, display: 'flex', alignItems: 'center' }}
          >
            <Switch
              checkedChildren="Disponible"
              unCheckedChildren="No disponible"
              checked={formData.availability}
              onChange={(checked) => handleChange('availability', checked)}
              style={{ height: 24 }}
            />
          </Form.Item>
        </div>

        {/* Descripción - Ancho completo pero más compacta */}
        <Form.Item
          label="Descripción (opcional)"
          name="description"
          style={{ marginBottom: 8 }}
        >
          <Input.TextArea
            rows={1}
            maxLength={120}
            placeholder="Ingresa una breve descripción del libro..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            style={{ fontSize: 14, resize: 'none', minHeight: 32, maxHeight: 48 }}
          />
        </Form.Item>

        {/* Imagen - Ancho completo */}
        <Form.Item
          label="Imagen del libro (opcional)"
          name="image"
          validateStatus={errors.image ? 'error' : undefined}
          help={errors.image}
          style={{ marginBottom: 8 }}
        >
          <Upload
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            beforeUpload={() => false} // Prevent automatic upload
            showUploadList={false}
            onChange={(info) => {
              const file = info.fileList[0]?.originFileObj;
              if (file) {
                // Use the same validation function
                const validationError = validateImageFile(file);
                if (validationError) {
                  setErrors(prev => ({ ...prev, image: validationError }));
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
                setErrors(prev => ({ ...prev, image: undefined }));
              }
            }}
          >
            <Button
              icon={<UploadOutlined />}
              loading={uploadingImage}
              disabled={uploadingImage}
              style={{ height: 32, fontSize: 14 }}
            >
              {uploadingImage ? 'Subiendo...' : 'Cambiar Imagen'}
            </Button>
          </Upload>
          {imagePreview && (
            <div className="relative inline-block mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-fountain-blue-300 dark:border-fountain-blue-600"
                style={{ width: 64, height: 64 }}
              />
              <Button
                type="text"
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  setImagePreview(null);
                  handleChange('image', undefined);
                  handleChange('imageUrl', '');
                  setErrors(prev => ({ ...prev, image: undefined }));
                }}
                className="absolute -top-2 -right-2 text-red-500 hover:text-red-700"
                shape="circle"
                size="small"
                style={{ width: 20, height: 20, minWidth: 20, minHeight: 20, padding: 0 }}
              />
            </div>
          )}
          <Typography.Text type="secondary" className="block text-xs mt-1">
            Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
          </Typography.Text>
        </Form.Item>

        {/* Botones - Centrados y más compactos */}
        <Space className="flex justify-end pt-2" style={{ marginTop: 0 }}>
          <Button
            onClick={onCancel}
            size="middle"
            style={{ height: 32, fontSize: 14 }}
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading || uploadingImage}
            disabled={isLoading || uploadingImage}
            size="middle"
            style={{ height: 32, fontSize: 14 }}
          >
            {isLoading
              ? 'Actualizando...'
              : uploadingImage
              ? 'Subiendo imagen...'
              : 'Actualizar Libro'}
          </Button>
        </Space>
      </Form>
    </motion.div>
  );
};
