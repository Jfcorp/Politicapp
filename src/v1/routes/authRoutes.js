// src/routes/auth.routes.js
const express = require('express')
const router = express.Router()
const { register, login } = require('../../controllers/authController')
const { protect } = require('../../middlewares/authMiddleware')
const { authorize } = require('../../middlewares/roleMiddleware')

// Rutas Públicas
router.post('/login', login) // [cite: 978]

// Rutas Protegidas
// Ejemplo: Solo un Admin o Coordinador debería poder crear nuevos usuarios del staff
router.post('/register', register) // [cite: 977]

module.exports = router
