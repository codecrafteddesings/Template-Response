const odbc = require('odbc')

async function listDrivers() {
  try {
    // Esto listará todos los drivers que Node puede ver
    const drivers = await odbc.getAvailableDrivers()
    console.log('--- DRIVERS DISPONIBLES ---')
    console.log(drivers)
  } catch (err) {
    console.log('No se pudo obtener la lista de drivers. El error es:', err.message)
  }
}
listDrivers()
