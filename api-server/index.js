const express = require('express')
const cors = require('cors')
const odbc = require('odbc')

const app = express()
app.use(cors())
app.use(express.json())

// Cadena de conexión usando el driver oficial

// configuración estándar de IBM i para ODBC.
// const connectionString =
//   'Driver={IBM i Access ODBC Driver};System=pub400.com;Uid=codecraft;Pwd=msantos02;DBQ=pub400;SSL=0;'

// Simular la connction
app.post('/clientes/validar', async (req, res) => {
  // Simulamos que el IBM i respondió éxito
  res.json({ codigoRespuesta: '00' })
})

async function ejecutarSP(datos) {
  let connection
  try {
    console.log('--- Iniciando intento de conexión al IBM i ---')
    console.log('Driver configurado:', connectionString)

    connection = await odbc.connect(connectionString)
    console.log('¡Conectado exitosamente al AS/400!')

    const query = `CALL "CODECRAFT1"."SP_VALIDTC"(?, ?, ?, ?, ?, ?, ?, ?)`

    // LOG: Ver los datos que estamos enviando al AS/400
    console.log('Enviando datos al procedimiento (datos):', datos)

    const result = await connection.query(query, [
      datos.nomCli,
      datos.patCli,
      datos.matCli,
      datos.corrCli,
      datos.rucCli,
      datos.telCli,
      datos.codVal,
      '', // Parámetro OUT (cambiado de null para evitar SQL0470)
    ])

    // LOG: Ver el objeto completo que devuelve el driver para confirmar dónde está el parámetro de salida
    console.log(
      'Resultado crudo del AS/400 (JSON.stringify):',
      JSON.stringify(result, null, 2)
    )
    console.log('Propiedades del resultado:', Object.keys(result))
    console.log('outParameters:', result.outParameters)
    console.log('statement:', result.statement)

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

    const result = await ejecutarSP(req.body)

    // Ajuste de respuesta: Verificamos dónde está el valor de retorno
    const codigoRespuesta =
      result && result.outParameters ? result.outParameters[7] : '00'

    console.log('Código de respuesta extraído:', codigoRespuesta)

    res.json({ codigoRespuesta })
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message)
    res.status(500).json({ error: 'Error al conectar con el AS/400: ' + error.message })
  }
})

app.listen(3001, () => console.log('Servidor puente corriendo en http://localhost:3001'))
