// src/routes/index.js
const express = require('express')
const router = express.Router()

const authRoutes = require('./authRoutes')
const voterRoutes = require('./voterRoutes')
const zoneRoutes = require('./zoneRoutes')
const leaderRoutes = require('./leaderRoutes')
const dashboardRoutes = require('./dashboardRoutes')

// Definición de rutas base
router.use('/auth', authRoutes) // Acceso: /api/v1/auth
router.use('/voters', voterRoutes) // Acceso: /api/v1/voters

// Rutas para zona
router.use('/zones', zoneRoutes) // Acceso: /api/v1/zones

// Rutas para líder
router.use('/leaders', leaderRoutes) // Acceso: /api/v1/leaders

// Rutas para Dashboard
router.use('/dashboard', dashboardRoutes) // Acceso: /api/v1/dashboard

module.exports = router
