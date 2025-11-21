const express = require('express')
const cors = require('cors')
const errorHandler = require('./middlewares/errorMiddleware')
const app = express()

// Middlewares
app.use(cors()) // Permitir peticiones del frontend (Vercel) [cite: 49, 209]
app.use(express.json()) // Parsear JSON
app.use(express.urlencoded({ extended: true }))

// Rutas Principales
const apiRoutes = require('./v1/routes') // index.js de rutas [cite: 178]
app.use('/api/v1', apiRoutes) // Prefijo de API v1

app.get('/', (req, res) => {
  res.send('API PoliticApp 360 MVP v1.0.0 corriendo')
})

// --> MIDDLEWARE DE ERRORES (Siempre al final, después de las rutas) <--
app.use(errorHandler)

module.exports = app
