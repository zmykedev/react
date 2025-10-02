import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserProfile } from '../UserProfile';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock store
const mockGetUser = vi.fn();
const mockIsLoggedIn = vi.fn();
const mockLogout = vi.fn();

vi.mock('../../store', () => ({
  default: () => ({
    getUser: mockGetUser,
    isLoggedIn: mockIsLoggedIn,
    logout: mockLogout,
  }),
}));

const UserProfileWrapper = () => (
  <BrowserRouter>
    <UserProfile />
  </BrowserRouter>
);

describe('UserProfile', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: '2023-01-01T00:00:00Z',
    lastLoginAt: '2023-12-01T12:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows warning when user is not logged in', () => {
    mockIsLoggedIn.mockReturnValue(false);
    mockGetUser.mockReturnValue(null);

    render(<UserProfileWrapper />);

    expect(screen.getByText('No hay sesión activa')).toBeInTheDocument();
    expect(screen.getByText('Por favor, inicia sesión para ver tu perfil.')).toBeInTheDocument();
  });

  it('renders user profile when logged in', () => {
    mockIsLoggedIn.mockReturnValue(true);
    mockGetUser.mockReturnValue(mockUser);

    render(<UserProfileWrapper />);

    expect(screen.getByText('Perfil de Usuario')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays user information correctly', () => {
    mockIsLoggedIn.mockReturnValue(true);
    mockGetUser.mockReturnValue(mockUser);

    render(<UserProfileWrapper />);

    expect(screen.getByText('ID:')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Nombre:')).toBeInTheDocument();
    expect(screen.getByText('Creado:')).toBeInTheDocument();
    expect(screen.getByText('Último login:')).toBeInTheDocument();
  });
});
