import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import Card from './componentes/card'
import LoadingBar from './componentes/LoadingBar'
import Modal from './componentes/Modal'
import SearchInput from './componentes/searchinput'

export default function App() {
  const [usuarios, setUsuarios] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [error, setError] = useState(null)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [loading, setLoading] = useState(false)

  const obtenerUsuarios = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:4000/usuarios')
      setUsuarios(response.data)
      setFiltrados(response.data)
    } catch (err) {
      setError('Error al cargar usuarios')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  const filtrarUsuarios = useCallback((query) => {
    setLoading(true)
    setTimeout(() => {
      const q = query.trim().toLowerCase()
      const resultados = usuarios.filter(usuario =>
        [usuario.nombre, usuario.apellidos, usuario.perfil, usuario.intereses, usuario.correo].some(campo =>
          String(campo).toLowerCase().includes(q)
        )
      )
      setFiltrados(resultados)
      setLoading(false)
    }, 500)
  }, [usuarios])

  return (
    <div>
      <h1 className="text-center font-serif text-3xl font-bold mb-6">BUSCADOR DE USUARIOS</h1>
      <SearchInput onSearch={filtrarUsuarios} />
      {loading && <LoadingBar />} {/* Ahora el loading aparece debajo del buscador */}
      {error && <p className="text-red-500">{error}</p>}

      <div>
        {filtrados.map(usuario => (
          <div key={usuario.id} onClick={() => setUsuarioSeleccionado(usuario)}>
            <Card usuario={usuario} />
          </div>
        ))}
      </div>

      <Modal usuario={usuarioSeleccionado} onClose={() => setUsuarioSeleccionado(null)} />
    </div>
  )
}