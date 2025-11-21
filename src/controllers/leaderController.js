// src/controllers/leaderController.js
const Leader = require('../models/leaderModel')
const Zone = require('../models/zoneModel')
const Voter = require('../models/voterModel')

// @desc    Crear un nuevo Líder (Compromiso)
// @route   POST /api/v1/leaders
const createLeader = async (req, res, next) => {
  // Extraccion completa de datos del formulario
  const {
    cedula,
    nombre,
    telefono,
    email,
    direccion,
    barrio,
    fecha_nacimiento,
    oficio,
    profesion,
    meta_votos,
    zoneId
  } = req.body

  try {
    // Validación: Verificar que la zona exista
    if (zoneId) {
      const zone = await Zone.findByPk(zoneId)
      if (!zone) {
        return res.status(404).json({ message: 'La Zona especificada no existe' })
      }
    }

    const leader = await Leader.create({
      cedula,
      nombre,
      telefono,
      email,
      direccion,
      barrio,
      fecha_nacimiento,
      oficio,
      profesion,
      meta_votos,
      zoneId // Vinculación del líder a una zona geográfica
    })
    res.status(201).json(leader)
  } catch (error) {
    // Manejo de errores de validacion (ej: Cedula duplicada)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ya existe un líder registrado con esa cédula.' })
    }
    next(error)
  }
}

// @desc    Obtener líderes y su rendimiento (Dashboard de Red Política)
// @route   GET /api/v1/leaders
const getLeaders = async (req, res, next) => {
  const { zoneId } = req.query
  const whereClause = zoneId ? { zoneId } : {}

  try {
    const leaders = await Leader.findAll({
      where: whereClause,
      include: [
        {
          model: Zone,
          attributes: ['nombre', 'numero_comuna'] // Para ver a qué zona pertenece
        }
      ]
    })

    // Cálculo de Efectividad (Votos reales vs Meta)
    const leadersStats = await Promise.all(leaders.map(async (leader) => {
      // Contamos cuántos electores están vinculados a este líder
      const votosReales = await Voter.count({ where: { leaderId: leader.id } })

      const meta = leader.meta_votos || 0
      const efectividad = meta > 0
        ? ((votosReales / meta) * 100).toFixed(1)
        : 0

      const leaderData = leader.get({ plain: true })

      return {
        ...leaderData,
        zona_nombre: leader.Zone ? leader.Zone.nombre : 'Sin Zona',
        numero_comuna: leader.Zone ? leader.Zone.numero_comuna : null,
        votos_reales: votosReales,
        efectividad_porcentaje: `${efectividad}%`
      }
    }))

    res.json(leadersStats)
  } catch (error) {
    next(error)
  }
}

module.exports = { createLeader, getLeaders }

// // src/controllers/leaderController.js
// const Leader = require('../models/leaderModel')
// const Voter = require('../models/voterModel')
// const Zone = require('../models/zoneModel')

// // @desc    Crear Líder
// // @route   POST /api/v1/leaders
// const createLeader = async (req, res, next) => {
//   const { nombre, telefono, direccion, meta_votos_lider, zoneId } = req.body
//   try {
//     if (zoneId) {
//       const zone = await Zone.findByPk(zoneId)
//       if (!zone) {
//         return res.status(404).json({ message: 'Zona no encontrada o la zona especificada no existe' })
//       }
//     }

//     const leader = await Leader.create({
//       nombre,
//       telefono,
//       direccion,
//       meta_votos_lider,
//       zoneId // Vinculamos el líder a una zona geográfica
//     })
//     res.status(201).json(leader)
//   } catch (error) {
//     // console.error(error)
//     // res.status(500).json({ message: 'Error al crear líder' })
//     next(error)
//   }
// }

// // @desc    Obtener Líderes con su rendimiento
// // @route   GET /api/v1/leaders
// const getLeaders = async (req, res, next) => {
//   const { zoneId } = req.query
//   const whereClause = zoneId ? { zoneId } : {}

//   try {
//     const leaders = await Leader.findAll({
//       where: whereClause,
//       include: [
//         { model: Zone, attributes: ['nombre'] },
//         // Solo necesitamos contar los electores, pero sequelize count es complejo en findAll
//         // Traemos atributos mínimos para calcular en memoria (MVP optimizado)
//         { model: Voter, as: 'electores', attributes: ['id'] }
//       ]
//     })

//     // Mapeamos para agregar el conteo de votos reales vs meta
//     const leadersWithStats = await Promise.all(leaders.map(leader => {
//       const votosReales = await leader.electores ? leader.electores.length : 0
//       const efectividad = leader.meta_votos_lider > 0
//         ? ((votosReales / leader.meta_votos_lider) * 100).toFixed(1)
//         : 0

//       // Limpiamos el array de electores para no sobrecargar la respuesta
//       const { electores, ...leaderData } = leader.toJSON()

//       return {
//         ...leaderData,
//         votos_reales: votosReales,
//         efectividad: `${efectividad}%`
//       }
//     })

//     res.json(leadersWithStats)
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: 'Error al obtener líderes' })
//   }
// }

// module.exports = { createLeader, getLeaders }
