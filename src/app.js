const express = require('express')
const cors = require('cors')
const errorHandler = require('./middlewares/errorMiddleware')

const app = express()

// CORRECION DE CORS
// Definimos la loista blanca de origenes permitidos
const allowedOrigins = [
  'https://politicapp-frontend.vercel.app', // Producción (SIN barra al final)
  'http://localhost:5173', // Desarrollo local
  'http://localhost:3000' // Por si acaso
]

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman o scripts de servidor)
    if (!origin) return callback(null, true)

    if (allowedOrigins.indexOf(origin) === -1) {
      // Si el origen no está en la lista, pero queremos que funcione para la DEMO de hoy:
      // return callback(null, true); // <--- Descomenta esto si sigue fallando para abrirlo a todo el mundo

      // Por ahora, intentemos ser estrictos pero correctos:
      return callback(new Error('La política de CORS no permite este origen'), false)
    }
    return callback(null, true)
  },
  credentials: true
})) // Permitir peticiones del frontend (Vercel) [cite: 49, 209]
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
