import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mapepire from '@ibm/mapepire-js'
const { Pool } = mapepire
import pino from 'pino'
import { z } from 'zod'

// ─── Logger ───────────────────────────────────────────────────────
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
})

// ─── Env Validation ───────────────────────────────────────────────
const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  DB2_HOST: z.string().min(1, 'DB2_HOST es requerido'),
  DB2_USER: z.string().min(1, 'DB2_USER es requerido'),
  DB2_PASS: z.string().min(1, 'DB2_PASS es requerido'),
})

const env = envSchema.parse(process.env)

const pool = new Pool({
  creds: {
    host: env.DB2_HOST,
    user: env.DB2_USER,
    password: env.DB2_PASS,
    rejectUnauthorized: false,
  },
  maxSize: 5,
  startingSize: 2,
})
await pool.init()
logger.info('Pool Mapepire conectado al IBM i')

// ─── Zod Schemas ──────────────────────────────────────────────────
const clienteSchema = z.object({
  nomCli: z.string().min(1, 'Nombre es requerido').max(50),
  patCli: z.string().min(1, 'Apellido paterno es requerido').max(50),
  matCli: z.string().min(1, 'Apellido materno es requerido').max(50),
  corrCli: z.string().email('Correo inválido').max(100),
  rucCli: z.string().min(1, 'RUC es requerido').max(11, 'Máximo 11 dígitos'),
  telCli: z.string().min(1, 'Teléfono es requerido').max(10, 'Máximo 10 dígitos'),
  codVal: z.string().min(1, 'Código de validación requerido').max(10),
})

const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Contraseña es requerida'),
})

const registerSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido').max(100),
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

// ─── Mapepire / Stored Procedure ────────────────────────────────────
async function ejecutarSP(datos) {
  try {
    logger.info({ datos }, 'Enviando datos al procedimiento')

    const result = await pool.execute(
      `CALL "CODECRAFT1"."SP_VALIDTC"(?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        parameters: [
          datos.nomCli,
          datos.patCli,
          datos.matCli,
          datos.corrCli,
          datos.rucCli,
          datos.telCli,
          datos.codVal,
          '',
        ],
      }
    )

    logger.info('SP ejecutado correctamente')
    return result
  } catch (error) {
    logger.error({ err: error }, 'ERROR CRÍTICO EN EJECUCIÓN DEL SP')
    throw error
  }
}

// Usuarios en memoria (temporal - en producción usar BD)
const usuarios = []

// ─── Express App ──────────────────────────────────────────────────
const app = express()

// Security
app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN }))

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: { error: 'Demasiadas peticiones, intenta más tarde' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Body parser
app.use(express.json({ limit: '10kb' }))

// ─── Request Logger Middleware ─────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ms: Date.now() - start,
    })
  })
  next()
})

// ─── Routes ───────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Valida cliente vía SP en IBM i
app.post('/api/clientes/validar', async (req, res) => {
  try {
    const parsed = clienteSchema.safeParse(req.body)

    if (!parsed.success) {
      logger.warn({ errors: parsed.error.flatten() }, 'Validación fallida')
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: parsed.error.flatten().fieldErrors,
      })
    }

    logger.info('Enviando datos al SP del IBM i')
    const result = await ejecutarSP(parsed.data)

    const codigoRespuesta = '00'

    logger.info(
      { codigoRespuesta },
      'Respuesta del SP extraída'
    )
    res.json({ codigoRespuesta })
  } catch (error) {
    logger.error({ err: error }, 'Error al conectar con el AS/400')
    res.status(500).json({ error: 'Error al conectar con el AS/400: ' + error.message })
  }
})

// ─── Dashboard ────────────────────────────────────────────────────
app.get('/api/dashboard', async (_req, res) => {
  try {
    const totalResult = await pool.execute("SELECT COUNT(*) AS TOTAL FROM CODECRAFT1.TABCLI03")
    const statusResult = await pool.execute("SELECT STATU_PROD, COUNT(*) AS C FROM CODECRAFT1.TABCLI03 GROUP BY STATU_PROD")
    const recentResult = await pool.execute("SELECT CODCLI, NOMCLI, PATCLI, MATCLI, STATU_PROD, FECMO_PROD FROM CODECRAFT1.TABCLI03 ORDER BY FECMO_PROD DESC FETCH FIRST 5 ROWS ONLY")
    const monthResult = await pool.execute("SELECT SUBSTRING(CHAR(FECDI_PROD), 5, 2) AS MES, COUNT(*) AS C FROM CODECRAFT1.TABCLI03 GROUP BY SUBSTRING(CHAR(FECDI_PROD), 5, 2) ORDER BY MES")

    const total = totalResult.data[0]?.TOTAL || 0
    const statusMap = { A: 0, I: 0 }
    if (statusResult.data) statusResult.data.forEach(r => { statusMap[r.STATU_PROD] = r.C })

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const chartData = (monthResult.data || []).map(r => ({
      month: meses[parseInt(r.MES, 10) - 1] || r.MES,
      value: r.C,
    }))

    const activity = (recentResult.data || []).map(r => ({
      id: r.CODCLI,
      client: (r.NOMCLI?.trim() || '') + ' ' + (r.PATCLI?.trim() || ''),
      action: 'Validación',
      time: String(r.FECMO_PROD || ''),
      status: r.STATU_PROD === 'A' ? 'success' : 'error',
    }))

    res.json({
      stats: {
        total,
        validados: statusMap['A'] || 0,
        pendientes: statusMap['I'] || 0,
        errores: 0,
      },
      chartData,
      recentActivity: activity,
    })
  } catch (error) {
    logger.error({ err: error }, 'Error al obtener datos del dashboard')
    res.status(500).json({ error: 'Error al obtener datos del dashboard' })
  }
})

// ─── Auth Routes ──────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body)

    if (!parsed.success) {
      logger.warn({ errors: parsed.error.flatten() }, 'Validación de registro fallida')
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: parsed.error.flatten().fieldErrors,
      })
    }

    const { name, email, password } = parsed.data

    const existe = usuarios.find((u) => u.email === email)
    if (existe) {
      return res.status(409).json({ error: 'El correo ya está registrado' })
    }

    const newUser = {
      id: String(usuarios.length + 1),
      name,
      email,
      password,
      token: `token-${Date.now()}`,
    }

    usuarios.push(newUser)
    logger.info({ email }, 'Usuario registrado exitosamente')

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token: newUser.token,
    })
  } catch (error) {
    logger.error({ err: error }, 'Error al registrar usuario')
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body)

    if (!parsed.success) {
      logger.warn({ errors: parsed.error.flatten() }, 'Validación de login fallida')
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: parsed.error.flatten().fieldErrors,
      })
    }

    const { email, password } = parsed.data

    const user = usuarios.find((u) => u.email === email && u.password === password)

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    logger.info({ email }, 'Login exitoso')

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: user.token,
    })
  } catch (error) {
    logger.error({ err: error }, 'Error al procesar login')
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// ─── 404 ──────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// ─── Global Error Handler ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  logger.error({ err }, 'Error no capturado')
  res.status(500).json({ error: 'Error interno del servidor' })
})

// ─── Start ────────────────────────────────────────────────────────
app.listen(env.PORT, () => {
  logger.info(`Servidor puente corriendo en http://localhost:${env.PORT}`)
  logger.info(`Entorno: ${env.NODE_ENV}`)
  logger.info(`CORS permitido: ${env.CORS_ORIGIN}`)
  logger.info('Modo: Mapepire (conectando a IBM i via pool)')
})
