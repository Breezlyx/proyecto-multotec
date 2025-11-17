import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import projectsRoutes from './routes/projects.js'
import resourcesRoutes from './routes/resources.js'
import tasksRoutes from './routes/tasks.js'
import risksRoutes from './routes/risks.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://192.168.100.6:5173',
    'https://nonfactually-heathy-jaqueline.ngrok-free.dev'
  ],
  credentials: true
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend en vivo' })
})

// API Routes
app.use('/api/projects', projectsRoutes)
app.use('/api/resources', resourcesRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/risks', risksRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 Multotec Backend en Vivo          ║
║   Puerto: ${PORT}                              ║
║   Ambiente: ${process.env.NODE_ENV}       ║
║   URL: http://localhost:${PORT}        ║
╚════════════════════════════════════════╝
  `)
  console.log('📚 Endpoints disponibles:')
  console.log('  GET    /api/projects')
  console.log('  GET    /api/projects/:id')
  console.log('  POST   /api/projects')
  console.log('  PUT    /api/projects/:id')
  console.log('  DELETE /api/projects/:id')
  console.log('')
  console.log('  GET    /api/resources')
  console.log('  GET    /api/resources/:id')
  console.log('  POST   /api/resources')
  console.log('  PUT    /api/resources/:id')
  console.log('  DELETE /api/resources/:id')
})

export default app
