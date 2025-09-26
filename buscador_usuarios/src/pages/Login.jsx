import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // ✅ Asegúrate de importar 'Link'

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = login(username, password);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede al buscador de usuarios
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Usuario o Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-red-800 text-sm text-center font-medium">{error}</div>
            </div>
          )}

          <div className="space-y-3"> 
            {/* Botón principal de Iniciar Sesión */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition duration-150"
            >
              {isLoading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </div>

          {/* ESTA ES LA SECCIÓN MODIFICADA: Enlace para ir al Registro */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link 
                to="/register" // Usamos Link de react-router-dom
                className="font-medium text-green-600 hover:text-green-500" // Estilo verde/indigo para el enlace de registro
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-500">
                💡 Tip: Usa cualquier usuario y contraseña para acceder (si ya te registraste)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;