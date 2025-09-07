// Configuración para desarrollo local vs producción
const isDevelopment = import.meta.env.DEV;
const apiBase = (import.meta as any)?.env?.VITE_API_URL || 
  (isDevelopment 
    ? 'http://localhost:3000/api/v1'  // Desarrollo local (puerto 3000)
    : 'https://cmpc-backend-production-c95a.up.railway.app/api/v1'  // Producción
  );

console.log('=== FRONTEND API CONFIG ===');
console.log('VITE_API_URL from env:', (import.meta as any)?.env?.VITE_API_URL);
console.log('Final apiBase:', apiBase);
console.log('========================');

export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE: `${apiBase}/auth/google`,
    ME: `${apiBase}/auth/me`,
    UPDATE_ROLE: `${apiBase}/auth/update-role`,
    LOGIN: `${apiBase}/auth/login`,
    REGISTER: `${apiBase}/users`,
  },
  BOOKS: {
    GET_ALL: `${apiBase}/books`,
    SEARCH: `${apiBase}/books/search`,
    GET_BY_ID: `${apiBase}/books`,
    CREATE: `${apiBase}/books`,
    UPDATE: `${apiBase}/books`,
    DELETE: `${apiBase}/books`,
    GET_GENRES: `${apiBase}/books/genres`,
    GET_PUBLISHERS: `${apiBase}/books/publishers`,
    UPLOAD_IMAGE: `${apiBase}/books/upload-image`,
  },
  STORAGE: {
    UPLOAD: `${apiBase}/storage/upload`,
    DELETE: `${apiBase}/storage/delete`,
    METADATA: `${apiBase}/storage/metadata`,
  },
};