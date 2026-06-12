import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
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
})

const env = envSchema.parse(process.env)

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

// Simulado - retorna éxito sin conectar a IBM i
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

    logger.info('Cliente validado exitosamente (simulado)')
    res.json({ codigoRespuesta: '00' })
  } catch (error) {
    logger.error({ err: error }, 'Error interno del servidor')
    res.status(500).json({ error: 'Error interno del servidor' })
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
  logger.info('Modo: SIMULADO (sin conexión ODBC)')
})
