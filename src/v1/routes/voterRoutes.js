// src/routes/voter.routes.js
const express = require('express')
const router = express.Router()
const {
  createVoter,
  getVoters,
  updateVoter,
  addContactHistory,
  getContactHistory
} = require('../../controllers/voterController')

const { protect } = require('../../middlewares/authMiddleware')
const { authorize } = require('../../middlewares/roleMiddleware')

// Todas las rutas requieren autenticación (Estar logueado)
router.use(protect)

// Rutas CRUD Básicas
router.route('/')
  .get(getVoters) // Todos los roles pueden ver (filtrado por lógica si es necesario)
  .post(authorize('Admin', 'Coordinador', 'Digitador'), createVoter) // Crear

router.route('/:id')
  .put(authorize('Admin', 'Coordinador', 'Digitador'), updateVoter) // Editar

// Rutas Específicas de Fidelización (Historial)
router.route('/:id/contact')
  .post(addContactHistory) // Registrar contacto (Cualquier staff activo)

router.route('/:id/history')
  .get(getContactHistory) // Ver historial

module.exports = router
