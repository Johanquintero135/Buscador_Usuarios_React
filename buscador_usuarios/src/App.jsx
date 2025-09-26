import { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Asegúrate de que estos componentes existan en sus respectivas ubicaciones
import Card from "./componentes/Card"; 
import Modal from "./componentes/Modal"; 
import "./App.css";

// Contexto de Autenticación
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Páginas
import Login from "./pages/Login";
import Register from "./pages/Register";

// --- LoadingBar: Componente de Carga (Usado para Auth y Data) ---
function LoadingBar() {
    return (
        // Usamos flex-col y py-8 del código que enviaste
        <div className="flex flex-col items-center justify-center py-8 w-full"> 
            {/* Animación de spin ( Tailwind CSS ) - Usamos border-b-2 del código que enviaste */}
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Espera un momento</p>
        </div>
    );
}

// --- PrivateRoute: Componente para proteger rutas ---
function PrivateRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);

  // Si está cargando el estado de autenticación, mostramos la barra en pantalla completa
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingBar />
        </div>
    );
  }
  
  // Si no hay usuario autenticado, redirige a /login
  if (!user) return <Navigate to="/login" replace />; 

  return children;
}

// --- BuscadorUsuarios: La vista principal y protegida ---
function BuscadorUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  // Nuevo estado para controlar la carga de datos del buscador
  const [loadingData, setLoadingData] = useState(false); 
  const [error, setError] = useState(null); 
  
  const { user, logout } = useContext(AuthContext);

  const obtenerUsuarios = async () => {
    setLoadingData(true); // Iniciar la carga de datos
    setError(null);
    try {
      // Nota: Esta llamada fallará si tu servidor no está activo en el puerto 4000
      const response = await axios.get("http://localhost:4000/usuarios");
      setUsuarios(response.data);
      setFiltrados(response.data);
    } catch (err) {
      setError("Error al cargar usuarios. Asegúrate de que el servidor esté activo.");
      console.error("Error al cargar usuarios:", err);
      setFiltrados([]); // Limpiar resultados en caso de error
    } finally {
      setLoadingData(false); // Detener la carga
    }
  };

  // Implementamos la lógica de loading y setTimeout para simular la búsqueda
  const filtrarUsuarios = useCallback((query) => {
    setLoadingData(true); // Iniciar la carga de la búsqueda
    setError(null);
    
    // Simular un tiempo de carga de 1 segundo (como en tu ejemplo)
    setTimeout(() => {
        const q = query.trim().toLowerCase();
        const resultados = usuarios.filter((usuario) =>
            [usuario.nombre, usuario.apellidos, usuario.perfil, usuario.intereses, usuario.correo].some((campo) =>
                String(campo).toLowerCase().includes(q)
            )
        );
        setFiltrados(resultados);
        setLoadingData(false); // Detener la carga después del tiempo simulado
    }, 1000); 
  }, [usuarios]); // Depende de la lista completa de usuarios

  // Carga los usuarios al montar el componente (al terminar el PrivateRoute)
  useEffect(() => { 
    obtenerUsuarios();
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-center font-serif text-3xl font-bold text-gray-800">BUSCADOR DE USUARIOS</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            Bienvenido, <span className="font-bold text-indigo-600">{user?.username}</span>
          </span>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, correo, perfil o intereses..."
        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mb-6"
        onChange={(e) => filtrarUsuarios(e.target.value)}
      />
      
      {error && <p className="text-red-600 text-center font-semibold mb-4">{error}</p>}

      {/* Condición de Renderizado basada en loadingData */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {loadingData ? (
          <div className="col-span-3">
            <LoadingBar />
          </div>
        ) : filtrados.length > 0 ? (
          filtrados.map((usuario) => (
            <div key={usuario.id} onClick={() => setUsuarioSeleccionado(usuario)} className="cursor-pointer">
              <Card usuario={usuario} />
            </div>
          ))
        ) : (
          // Mensaje cuando la búsqueda no encuentra resultados o la carga inicial fue vacía
          <p className="col-span-3 text-center text-gray-500 py-8">
            No se encontraron usuarios que coincidan con la búsqueda.
          </p>
        )}
      </div>

      <Modal usuario={usuarioSeleccionado} onClose={() => setUsuarioSeleccionado(null)} />
    </div>
  );
}

// --- App Principal ---
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Ruta Protegida: La principal */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <BuscadorUsuarios />
              </PrivateRoute>
            }
          />
          
          {/* Redirección por defecto para cualquier otra ruta */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
