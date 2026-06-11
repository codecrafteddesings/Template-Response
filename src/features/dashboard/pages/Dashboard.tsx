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
  const [errores, setErrores] = useState<{ rucCli?: string; telCli?: string }>({})

  const [formData, setFormData] = useState<ClientFormt>(initialFormData)

  const validarDigitos = (value: string, campo: 'rucCli' | 'telCli') => {
    if (campo === 'rucCli' && value.length != 11) {
      setErrores((prev) => ({
        ...prev,
        rucCli: 'No cumple con los requisitos, valor esperado 11 dígitos!',
      }))
    } else if (campo === 'telCli' && value.length != 10) {
      setErrores((prev) => ({
        ...prev,
        telCli: 'No cumple con los requisitos, valor esperado 10 dígitos!',
      }))
    } else {
      setErrores((prev) => {
        const copy = { ...prev }
        delete copy[campo]
        return copy
      })
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }))

    if (name === 'rucCli' || name === 'telCli') {
      validarDigitos(value, name)
    }
  }

  const handleSubmit = async (e: ChangeEvent) => {
    e.preventDefault()

    if (errores.rucCli || errores.telCli) return

    setLoading(true)
    setResultado(null)

    try {
      const codigo = await validarClient(formData)

      if (codigo === '00') {
        setResultado('Éxito: Cliente actualizado')
        setFormData(initialFormData)
        setErrores({})
      } else {
        setResultado(`Error: Código ${codigo}`)
      }
    } catch (err) {
      setResultado('Error de conexión con pub/400')
      alert('Error de conexión con pub/400')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setFormData(initialFormData)
    setResultado(null)
    setErrores({})
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Validar Datos </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="nomCli"
          value={formData.nomCli}
          onChange={handleChange}
          required
          className="w-full border p-2"
          placeholder="Nombre"
        />
        <input
          name="patCli"
          value={formData.patCli}
          onChange={handleChange}
          required
          className="w-full border p-2"
          placeholder="Apellido Paterno"
        />
        <input
          name="matCli"
          value={formData.matCli}
          onChange={handleChange}
          required
          className="w-full border p-2"
          placeholder="Apellido Materno"
        />
        <input
          name="corrCli"
          type="email"
          value={formData.corrCli}
          onChange={handleChange}
          required
          className="w-full border p-2"
          placeholder="Correo"
        />
        <input
          name="rucCli"
          value={formData.rucCli}
          onChange={handleChange}
          required
          className={`w-full border p-2 ${errores.rucCli ? 'border-red-500' : ''}`}
          placeholder="Cédula/RUC"
        />
        {errores.rucCli && <p className="text-red-500 text-sm">{errores.rucCli}</p>}
        <input
          name="telCli"
          value={formData.telCli}
          onChange={handleChange}
          required
          className={`w-full border p-2 ${errores.telCli ? 'border-red-500' : ''}`}
          placeholder="Teléfono"
        />
        {errores.telCli && <p className="text-red-500 text-sm">{errores.telCli}</p>}
        <div className="flex justify-between gap-30">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-50 "
            disabled={loading}
          >
            {loading ? 'Validando...' : 'Validar'}
          </button>{' '}
          <button
            type="button"
            onClick={clearForm}
            className="flex-1 bg-gray-400 hover:bg-gray-500  text-white p-2 rounded  "
          >
            Limpiar
          </button>
        </div>
      </form>

      {resultado && (
        <p className="mt-4 p-2 bg-gray-100 rounded text-center">{resultado}</p>
      )}
    </div>
  )
}
