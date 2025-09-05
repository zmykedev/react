import React from 'react';
import useStore from '../store';
import { useNavigate } from 'react-router-dom';

export const UserProfile: React.FC = () => {
  const { getUser, isLoggedIn, clear } = useStore();
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clear();
    navigate('/login');
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p>No hay sesión activa</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Perfil de Usuario
        </h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">ID:</span>
          <span className="text-gray-800">{user.id}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Email:</span>
          <span className="text-gray-800">{user.email}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Nombre:</span>
          <span className="text-gray-800">
            {user.firstName} {user.lastName}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Rol:</span>
          <span className="px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800">
            {user.role}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Creado:</span>
          <span className="text-gray-800">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Último login:</span>
          <span className="text-gray-800">
            {new Date(user.lastLoginAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
