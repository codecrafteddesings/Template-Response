const { execSync } = require('child_process')

try {
  const output = execSync('reg query "HKLM\\SOFTWARE\\ODBC\\ODBCINST.INI" /s').toString()
  const lines = output.split('\n')
  console.log('--- NOMBRES DE DRIVERS REGISTRADOS ---')
  lines.forEach((line) => {
    if (line.includes('IBM') || line.includes('iSeries')) {
      console.log(line.trim())
    }
  })
} catch (e) {
  console.log('No se pudo leer el registro.')
}
