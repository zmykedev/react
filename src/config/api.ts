let apiBase = (import.meta as any)?.env?.VITE_API_URL || 'https://cmpc-backend-production.up.railway.app ';
apiBase = apiBase.replace(/\/$/, '');
if (!apiBase.endsWith('/api/v1')) {
  apiBase = `${apiBase}/api/v1`;
}

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