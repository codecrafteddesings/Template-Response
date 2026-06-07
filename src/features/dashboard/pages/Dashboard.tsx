import { useState, type ChangeEvent } from 'react'
import { validarClient } from '../services'
import type { ClientFormt } from '../types'

const initialFormData: ClientFormt = {
  nomCli: '',
  patCli: '',
  matCli: '',
  corrCli: '',
  rucCli: '',
  telCli: '',
  codVal: 'VAL',
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<string | null>(null)

  const [formData, setFormData] = useState<ClientFormt>(initialFormData)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: ChangeEvent) => {
    e.preventDefault()

    setLoading(true)
    setResultado(null)

    try {
      const codigo = await validarClient(formData)

      if (codigo === '00') {
        setResultado('Éxito: Cliente actualizado')
        setFormData(initialFormData)
      } else {
        setResultado(`Error: Código ${codigo}`)
      }
    } catch {
      alert(setResultado('Error de conexión con el AS/400'))
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setFormData(initialFormData)
    setResultado(null)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Validar Cliente IBM i</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="nomCli"
          value={formData.nomCli}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Nombre"
        />

        <input
          name="patCli"
          value={formData.patCli}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Apellido Paterno"
        />

        <input
          name="matCli"
          value={formData.matCli}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Apellido Materno"
        />

        <input
          name="corrCli"
          type="email"
          value={formData.corrCli}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Correo"
        />

        <input
          name="rucCli"
          value={formData.rucCli}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Cédula/RUC"
        />

        <input
          name="telCli"
          value={formData.telCli}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Teléfono"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Validando...' : 'Guardar en IBM i'}
        </button>
      </form>

      {resultado && <p className="mt-4 p-2 bg-gray-100 rounded">{resultado}</p>}
    </div>
  )
}
