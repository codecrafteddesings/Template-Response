import odbc from 'odbc';
import { readFileSync } from 'fs';
const env = readFileSync('.env','utf8').split('\n').find(l => l.startsWith('ODBC_CONN=')).split('=').slice(1).join('=');
const conn = await odbc.connect(env);

try {
  const res = await conn.query("SELECT * FROM CODECRAFT1.DEPTO FETCH FIRST 10 ROWS ONLY");
  console.log('DEPTO:', JSON.stringify(res));
} catch(e) { console.log('DEPTO error:', e.message); }

try {
  const res = await conn.query("SELECT * FROM CODECRAFT1.SECCION FETCH FIRST 10 ROWS ONLY");
  console.log('SECCION:', JSON.stringify(res));
} catch(e) { console.log('SECCION error:', e.message); }

try {
  const res = await conn.query("SELECT COUNT(*) AS TOTAL FROM CODECRAFT1.TABCLI03");
  console.log('Total:', JSON.stringify(res));
} catch(e) { console.log('Count error:', e.message); }

try {
  const res = await conn.query("SELECT STATU_PROD, COUNT(*) AS C FROM CODECRAFT1.TABCLI03 GROUP BY STATU_PROD");
  console.log('By status:', JSON.stringify(res));
} catch(e) { console.log('Status error:', e.message); }

try {
  const res = await conn.query("SELECT SUBSTRING(CHAR(FECDI_PROD), 5, 2) AS MES, COUNT(*) AS C FROM CODECRAFT1.TABCLI03 GROUP BY SUBSTRING(CHAR(FECDI_PROD), 5, 2) ORDER BY MES");
  console.log('By month:', JSON.stringify(res));
} catch(e) { console.log('Month error:', e.message); }

try {
  const res = await conn.query("SELECT * FROM CODECRAFT1.TABCLI03 ORDER BY FECMO_PROD DESC FETCH FIRST 10 ROWS ONLY");
  console.log('Recent 10:', JSON.stringify(res.map(r => ({CODCLI: r.CODCLI, NOMCLI: r.NOMCLI.trim(), FECMO: r.FECMO_PROD, STATU: r.STATU_PROD}))));
} catch(e) { console.log('Recent error:', e.message); }

await conn.close();
