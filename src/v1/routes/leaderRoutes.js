// src/routes/leader.routes.js
const express = require('express')
const router = express.Router()
const { createLeader, getLeaders } = require('../../controllers/leaderController')
const { protect } = require('../../middlewares/authMiddleware')
const { authorize } = require('../../middlewares/roleMiddleware')

router.use(protect)

router.route('/')
  .get(getLeaders) // Ver la red (Dashboard)
  .post(authorize('Admin', 'Coordinador'), createLeader) // Solo jerarquía alta crea líderes

module.exports = router
