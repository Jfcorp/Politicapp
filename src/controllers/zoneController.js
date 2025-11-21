// src/controllers/zoneController.js
const Zone = require('../models/zoneModel')
const User = require('../models/userModel')
const Voter = require('../models/voterModel')

// @desc    Crear nueva zona (Aún útil para casos raros)
const createZone = async (req, res, next) => {
  const { nombre, municipio, meta_votos, numero_comuna, managerId } = req.body
  try {
    const zone = await Zone.create({
      nombre,
      municipio,
      meta_votos,
      numero_comuna,
      managerId: managerId || req.user.id
    })
    res.status(201).json(zone)
  } catch (error) { next(error) }
}

// @desc    Obtener zonas
const getZones = async (req, res, next) => {
  try {
    const zones = await Zone.findAll({
      include: [{ model: User, as: 'gerente', attributes: ['id', 'nombre', 'email'], required: false }],
      order: [['numero_comuna', 'ASC'], ['nombre', 'ASC']] // Ordenado para fácil lectura
    })

    const zonesWithStats = await Promise.all(zones.map(async (zone) => {
      const votersCount = await Voter.count({ where: { zoneId: zone.id } })
      const meta = zone.meta_votos || 0
      const avance = meta > 0 ? ((votersCount / meta) * 100).toFixed(1) : 0
      const zoneData = zone.get({ plain: true })

      return {
        ...zoneData,
        numero_comuna: zone.numero_comuna,
        gerente: zoneData.gerente,
        registrados: votersCount,
        avance_porcentaje: `${avance}%`
      }
    }))
    res.json(zonesWithStats)
  } catch (error) { next(error) }
}

// @desc    Actualizar Zona (Gerente y Meta)
// @route   PUT /api/v1/zones/:id/assign
const assignManager = async (req, res, next) => {
  const { id } = req.params
  // AHORA RECIBIMOS TAMBIÉN LA META
  const { managerId, meta_votos } = req.body

  try {
    const zone = await Zone.findByPk(id)
    if (!zone) return res.status(404).json({ message: 'Zona no encontrada' })

    // Actualizar campos si vienen en el body
    if (managerId !== undefined) zone.managerId = managerId || null // Permitir desasignar enviando null
    if (meta_votos !== undefined) zone.meta_votos = meta_votos

    await zone.save()

    // Devolver dato actualizado con relación
    const updatedZone = await Zone.findByPk(id, {
      include: [{ model: User, as: 'gerente', attributes: ['id', 'nombre'] }]
    })

    res.json({ message: 'Zona actualizada correctamente', zone: updatedZone })
  } catch (error) {
    next(error)
  }
}

// @desc    Eliminar una zona
// @route   DELETE /api/v1/zones/:id
const deleteZone = async (req, res, next) => {
  const { id } = req.params
  try {
    const zone = await Zone.findByPk(id)
    if (!zone) {
      return res.status(404).json({ message: 'Zona no encontrada' })
    }

    await zone.destroy()
    res.json({ message: 'Zona eliminada correctamente' })
  } catch (error) {
    next(error)
  }
}

module.exports = { createZone, getZones, assignManager, deleteZone }

// // src/controllers/zoneController.js
// const Zone = require('../models/zoneModel')
// const User = require('../models/userModel')
// const Voter = require('../models/voterModel')
// const logger = require('../utils/logger')

// // @desc    Crear nueva zona
// // @route   POST /api/v1/zones
// const createZone = async (req, res, next) => {
//   console.log('📥 Recibiendo datos de Zona:', req.body)

//   // CORRECCIÓN 1: Recibir las variables en snake_case (como las envía el frontend)
//   // CORRECCIÓN 2: Recibir managerId para asignación manual si existe
//   const { nombre, municipio, meta_votos, numero_comuna, managerId } = req.body

//   try {
//     const zone = await Zone.create({
//       nombre,
//       municipio,
//       // CORRECCIÓN 3: Usar los nombres de campo exactos del Modelo (snake_case)
//       meta_votos,
//       numero_comuna,
//       // CORRECCIÓN 4: Asignar gerente. Si no viene en el body, usa el usuario logueado.
//       managerId: managerId || req.user.id
//     })

//     // Cargar el usuario para devolverlo en la respuesta (para que el frontend muestre el nombre)
//     const fullZone = await Zone.findByPk(zone.id, {
//       include: [{ model: User, as: 'gerente', attributes: ['nombre', 'email'] }]
//     })

//     logger.info(`Nueva zona creada: ${zone.nombre} por usuario ${req.user.id}`)
//     res.status(201).json(fullZone)
//   } catch (error) {
//     console.error('❌ Error Sequelize:', error)
//     // Esto enviará el error real al frontend para que sepas qué pasó si vuelve a fallar
//     next(error)
//   }
// }

// // @desc    Obtener todas las zonas con estadísticas (Dashboard)
// // @route   GET /api/v1/zones
// const getZones = async (req, res, next) => {
//   try {
//     const zones = await Zone.findAll({
//       include: [
//         {
//           model: User,
//           as: 'gerente',
//           attributes: ['id', 'nombre', 'email'],
//           required: false
//         }
//       ]
//     })

//     const zonesWithStats = await Promise.all(zones.map(async (zone) => {
//       const votersCount = await Voter.count({ where: { zoneId: zone.id } })

//       // Asegurarnos de leer la propiedad correcta del modelo
//       const meta = zone.meta_votos || 0

//       const avance = meta > 0
//         ? ((votersCount / meta) * 100).toFixed(1)
//         : 0

//       const zoneData = zone.get({ plain: true })

//       return {
//         ...zoneData,
//         numero_comuna: zone.numero_comuna,
//         gerente: zoneData.gerente, // Ahora sí enviamos el objeto gerente
//         registrados: votersCount,
//         avance_porcentaje: `${avance}%`
//       }
//     }))

//     res.json(zonesWithStats)
//   } catch (error) {
//     next(error)
//   }
// }

// // @desc    Asignar Gerente a una Zona
// // @route   PUT /api/v1/zones/:id/assign
// const assignManager = async (req, res, next) => {
//   const { id } = req.params
//   const { managerId } = req.body

//   try {
//     const zone = await Zone.findByPk(id)
//     if (!zone) return res.status(404).json({ message: 'Zona no encontrada' })

//     const user = await User.findByPk(managerId)
//     if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

//     zone.managerId = managerId
//     await zone.save()

//     logger.info(`Gerente ${user.nombre} asignado a zona ${id}`)

//     // Devolvemos la zona actualizada incluyendo el gerente para refrescar la UI
//     const updatedZone = await Zone.findByPk(id, {
//       include: [{ model: User, as: 'gerente', attributes: ['id', 'nombre'] }]
//     })

//     res.json({ message: 'Gerente asignado correctamente', zone: updatedZone })
//   } catch (error) {
//     next(error)
//   }
// }

// module.exports = { createZone, getZones, assignManager }
