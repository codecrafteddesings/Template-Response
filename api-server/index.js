require('dotenv').config()
const express = require('express')
const cors = require('cors')
const odbc = require('odbc')

const app = express()
app.use(cors())
app.use(express.json())

const connectionString = process.env.ODBC_CONN || process.env.VITE_API_ODBC

if (!connectionString) {
  throw new Error('Error: ODBC_CONN no esta definida en .env')
}

async function ejecutarSP(datos) {
  let connection
  try {
    console.log('--- Iniciando intento de conexión al IBM i ---')
    console.log('Driver configurado:', connectionString)

    connection = await odbc.connect(connectionString)
    console.log('¡Conectado exitosamente al AS/400!')

    console.log('Enviando datos al procedimiento (datos):', datos)

    const result = await connection.query(
      `CALL "CODECRAFT1"."SP_VALIDTC"(?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        datos.nomCli,
        datos.patCli,
        datos.matCli,
        datos.corrCli,
        datos.rucCli,
        datos.telCli,
        datos.codVal,
        '',
      ]
    )

    console.log('SP ejecutado correctamente')

    return result
  } catch (error) {
    console.error('ERROR CRÍTICO EN EJECUCIÓN:', error)
    throw error
  } finally {
    if (connection) {
      await connection.close()
      console.log('Conexión cerrada.')
    }
  }
}

app.post('/clientes/validar', async (req, res) => {
  try {
    console.log('Recibiendo petición POST en /clientes/validar...')
    console.log('Body recibido:', req.body)

    await ejecutarSP(req.body)

    console.log('Código de respuesta: 00')
    res.json({ codigoRespuesta: '00' })
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message)
    res.status(500).json({ error: 'Error al conectar con el AS/400: ' + error.message })
  }
})

app.listen(3001, () => console.log('Servidor puente corriendo en http://localhost:3001'))
