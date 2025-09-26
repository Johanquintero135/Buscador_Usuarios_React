import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Crear el contexto
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (username, password) => {
    // Lógica de autenticación
    if (username === 'admin' && password === 'password') {
      setUser({ username });
      navigate('/Buscador-Usuarios'); // Redirige al dashboard
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/login'); // Redirige al login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto en otros componentes
export function useAuth() {
  return useContext(AuthContext);
}
