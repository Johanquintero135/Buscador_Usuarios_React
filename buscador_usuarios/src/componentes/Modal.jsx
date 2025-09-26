export default function Modal({ usuario, onClose }) {
  if (!usuario) return null;

  return (
    // Fondo opaco que cubre TODA la pantalla
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // 👈 si clicas el fondo también cierra
    >
      {/* Contenedor de la tarjeta */}
      <div
        className="bg-white p-6 rounded-lg shadow-2xl w-96 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // evita cerrar si clicas dentro
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>
        

        <img
          src={usuario.foto}
          alt={`${usuario.nombre} ${usuario.apellidos}`}
          className="w-full h-48 object-cover rounded-md"
        />

        <h2 className="text-center text-xl font-bold mt-3">
          {usuario.nombre} {usuario.apellidos}
        </h2>
        <p className="text-center text-sm text-gray-600">{usuario.perfil}</p>
        <p className="text-center text-xs italic mt-2">{usuario.intereses}</p>
        <p className="text-center text-blue-500 text-sm mt-2">
          {usuario.correo}
        </p>
      </div>
    </div>
  );
}