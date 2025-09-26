import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recuperar sesión guardada
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Función para registrar usuario
  const register = (username, email, password, confirmPassword) => {
    if (!username || !email || !password || !confirmPassword) {
      return { success: false, message: "Todos los campos son obligatorios" };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Las contraseñas no coinciden" };
    }

    if (password.length < 6) {
      return { success: false, message: "La contraseña debe tener al menos 6 caracteres" };
    }

    // Verificar si el usuario ya existe
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const userExists = existingUsers.find(u => u.username === username || u.email === email);
    
    if (userExists) {
      return { success: false, message: "El usuario o email ya está registrado" };
    }

    // Crear nuevo usuario
    const newUser = { username, email, password, id: Date.now() };
    existingUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

    return { success: true, message: "Usuario registrado exitosamente" };
  };

  // Función para login con validación real
  const login = (username, password) => {
    if (!username || !password) {
      return { success: false, message: "Usuario y contraseña son obligatorios" };
    }

    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const user = existingUsers.find(u => (u.username === username || u.email === username) && u.password === password);
    
    if (user) {
      const userSession = { username: user.username, email: user.email };
      setUser(userSession);
      localStorage.setItem("user", JSON.stringify(userSession));
      return { success: true, message: "Login exitoso" };
    } else {
      return { success: false, message: "Usuario o contraseña incorrectos" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};