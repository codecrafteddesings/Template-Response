const { error } = require('node:console')
const odbc = require('odbc')

async function test() {
  try {
    const drivers = await odbc.getDrivers()
    console.log('--- DRIVERS DISPONIBLES ---')
    console.log(drivers)
  } catch (e) {
    console.log('ERROR:', e)
  }
}
test()
