// src/routes/dashboard.routes.js
const express = require('express')
const router = express.Router()
const { getDashboardStats } = require('../../controllers/dashboardController')
const { protect } = require('../../middlewares/authMiddleware')

// Protegemos la ruta para que solo usuarios logueados vean la info estratégica
router.use(protect)

router.get('/', getDashboardStats) // GET /api/v1/dashboard

module.exports = router
