export interface User {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    createdAt: string;    // ISO string, más fácil de manejar en frontend
    updatedAt: string;
    lastLoginAt?: string;
  }
  
  export interface Tokens {
    accessToken: string;
    refreshToken: string;
    tokenType: 'JWT';
    expiresIn: number;     // segundos
    issuedAt: number;      // timestamp
  }
  
  export interface SessionMeta {
    location?: string;
    isActive: boolean;
  }
  
  export interface Session {
    tokens: Tokens;
    user: User;
    meta: SessionMeta;
  }

// Export book types
export * from './book';
  