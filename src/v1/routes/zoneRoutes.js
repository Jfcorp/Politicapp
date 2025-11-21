// src/routes/zone.routes.js
const express = require('express')
const router = express.Router()
const { createZone, getZones, assignManager } = require('../../controllers/zoneController')
const { protect } = require('../../middlewares/authMiddleware')
const { authorize } = require('../../middlewares/roleMiddleware')

// Todas las rutas requieren autenticación
router.use(protect)

router.route('/')
  .get(getZones) // Visible para todos (Dashboard)
  .post(authorize('Admin', 'Coordinador'), createZone) // Solo Admin/Coord crean zonas

router.route('/:id/assign')
  .put(authorize('Admin', 'Coordinador'), assignManager) // Asignar gerente

module.exports = router
