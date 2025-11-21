// src/controllers/zoneController.js
const Zone = require('../models/zoneModel')
const User = require('../models/userModel')
const Voter = require('../models/voterModel')
const logger = require('../utils/logger')

// @desc    Crear nueva zona
// @route   POST /api/v1/zones
const createZone = async (req, res, next) => {
  console.log('📥 Recibiendo datos de Zona:', req.body)
  const { nombre, municipio, metaVotos, numeroComuna } = req.body
  try {
    const zone = await Zone.create({
      nombre,
      municipio,
      metaVotos,
      numeroComuna
    })
    logger.info(`Nueva zona creada: ${zone.nombre} por usuario ${req.user.id}`)
    res.status(201).json(zone)
  } catch (error) {
    // console.error(error)
    // res.status(500).json({ message: 'Error al crear zona' })
    console.error('❌ Error Sequelize:', error)
    next(error)
  }
}

// @desc    Obtener todas las zonas con estadísticas (Dashboard)
// @route   GET /api/v1/zones
const getZones = async (req, res, next) => {
  try {
    // Obtenemos zonas incluyendo al Gerente y contando Electores
    const zones = await Zone.findAll({
    //   attributes: ['id', 'nombre', 'municipio', 'meta_votos', 'managerId'], // Definir explícitamente qué queremos de Zone
      include: [
        {
          model: User,
          as: 'gerente', // Alias definido en asociaciones
          attributes: ['id', 'nombre', 'email'],
          required: false // LEFT JOIN: Traer zona aunque no tenga gerente
        }
      ]
    })

    // Calculamos el progreso manualmente (Cálculo automático )
    // Nota: En producción optimizaríamos esto con "Sequelize.fn('COUNT')"
    const zonesWithStats = await Promise.all(zones.map(async (zone) => {
      const votersCount = await Voter.count({ where: { zoneId: zone.id } })

      // Correcion: usar la proopiedad correcta del modelo
      const meta = zone.meta_votos || 0

      const avance = meta > 0
        ? ((votersCount / meta) * 100).toFixed(1)
        : 0

      // Convertimos a JSON plano para manipularlo
      const zoneData = zone.get({ plain: true })

      return {
        ...zoneData,
        gerente: zoneData.gerente,
        registrados: votersCount,
        avance_porcentaje: `${avance}%`
      }
    }))

    res.json(zonesWithStats)
  } catch (error) {
    // console.error(error)
    // res.status(500).json({ message: 'Error al obtener zonas' })
    next(error)
  }
}

// @desc    Asignar Gerente a una Zona
// @route   PUT /api/v1/zones/:id/assign
const assignManager = async (req, res, next) => {
  const { id } = req.params
  const { managerId } = req.body // ID del Usuario (rol Gerente)

  try {
    const zone = await Zone.findByPk(id)
    if (!zone) return res.status(404).json({ message: 'Zona no encontrada' })

    // Verificar que el usuario exista
    const user = await User.findByPk(managerId)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    zone.managerId = managerId
    await zone.save()

    logger.info(`Gerente ${user.nombre} asignado a zona ${id}`)

    res.json({ message: `Gerente ${user.nombre} asignado a zona ${zone.nombre}`, zone })
  } catch (error) {
    // console.error(error)
    // res.status(500).json({ message: 'Error al asignar gerente' })
    next(error)
  }
}

module.exports = { createZone, getZones, assignManager }
