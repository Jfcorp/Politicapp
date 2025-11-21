// src/controllers/voterController.js
const Voter = require('../models/voterModel')
const ContactHistory = require('../models/contactHistoryModel')
const Zone = require('../models/zoneModel')
const { Op } = require('sequelize')

// @desc    Registrar un nuevo elector (Base de Datos de Fidelización)
// @route   POST /api/v1/voters
// @access  Private (Coordinador, Digitador, Gerente de Zona)
const createVoter = async (req, res, next) => {
  const { nombre, cedula, telefono, direccion, zoneId, leaderId, tipo_voto, notas_iniciales } = req.body

  try {
    // 1. Verificar si el elector ya existe (Evitar duplicados por cédula)
    // Regla de Negocio: No se puede registrar un elector duplicado [cite: 1009]
    const voterExists = await Voter.findOne({ where: { cedula } })

    if (voterExists) {
      return res.status(400).json({ message: 'El elector con esta cédula ya está registrado.' })
    }

    // 2. Crear el elector
    const voter = await Voter.create({
      nombre,
      cedula,
      telefono,
      direccion,
      zoneId, // Vinculación geográfica [cite: 860]
      leaderId,
      tipo_voto, // Segmentación: 'duro', 'blando', 'posible'
      estado_fidelizacion: 1 // Inicia con nivel bajo/neutro
    })

    // 3. Si hay notas iniciales, crear el primer registro en el historial
    if (notas_iniciales) {
      await ContactHistory.create({
        voterId: voter.id,
        userId: req.user.id, // El usuario logueado que hizo el registro
        notas: `Registro inicial: ${notas_iniciales}`,
        fecha_contacto: new Date()
      })
    }

    res.status(201).json(voter)
  } catch (error) {
    // console.error(error)
    // res.status(500).json({ message: 'Error al registrar elector' })
    next(error)
  }
}

// @desc    Obtener electores con filtros (Targeting)
// @route   GET /api/v1/voters
// @access  Private
const getVoters = async (req, res) => {
  // Extracción de query params para filtros avanzados [cite: 987]
  const { zoneId, tipo_voto, search, page = 1, limit = 50 } = req.query
  const offset = (page - 1) * limit

  // Construcción dinámica del filtro (WHERE)
  const whereClause = {}

  if (zoneId) whereClause.zoneId = zoneId
  if (tipo_voto) whereClause.tipo_voto = tipo_voto // Filtrar por segmento [cite: 862]

  // Búsqueda por nombre o cédula (Op.iLike es case-insensitive en Postgres)
  if (search) {
    whereClause[Op.or] = [
      { nombre: { [Op.iLike]: `%${search}%` } },
      { cedula: { [Op.iLike]: `%${search}%` } }
    ]
  }

  try {
    const { count, rows } = await Voter.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']], // Los más recientes primero
      include: [
        { model: Zone, attributes: ['nombre'] } // Incluir nombre de la zona
      ]
    })

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      electores: rows
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener electores' })
  }
}

// @desc    Actualizar datos del elector (Seguimiento)
// @route   PUT /api/v1/voters/:id
// @access  Private
const updateVoter = async (req, res) => {
  const { id } = req.params
  const { telefono, direccion, tipo_voto, estado_fidelizacion } = req.body

  try {
    const voter = await Voter.findByPk(id)

    if (!voter) {
      return res.status(404).json({ message: 'Elector no encontrado' })
    }

    // Actualizar campos permitidos
    voter.telefono = telefono || voter.telefono
    voter.direccion = direccion || voter.direccion
    voter.tipo_voto = tipo_voto || voter.tipo_voto
    voter.estado_fidelizacion = estado_fidelizacion || voter.estado_fidelizacion

    await voter.save()

    res.json(voter)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar elector' })
  }
}

// @desc    Registrar nuevo contacto (Fidelización)
// @route   POST /api/v1/voters/:id/contact
// @access  Private
const addContactHistory = async (req, res) => {
  const { id } = req.params // ID del elector
  const { notas, actividad } = req.body // Ej: "Visita puerta a puerta", "Llamada"

  try {
    const voter = await Voter.findByPk(id)
    if (!voter) return res.status(404).json({ message: 'Elector no encontrado' })

    const history = await ContactHistory.create({
      voterId: id,
      userId: req.user.id, // Registramos QUIÉN hizo el contacto (responsabilidad)
      notas: actividad ? `${actividad}: ${notas}` : notas,
      fecha_contacto: new Date()
    })

    res.status(201).json(history)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al registrar contacto' })
  }
}

// @desc    Ver historial de contactos
// @route   GET /api/v1/voters/:id/history
// @access  Private
const getContactHistory = async (req, res) => {
  const { id } = req.params

  try {
    const history = await ContactHistory.findAll({
      where: { voterId: id },
      order: [['fecha_contacto', 'DESC']]
      // Aquí podríamos incluir el modelo User para ver el nombre del staff
    })

    res.json(history)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener historial' })
  }
}

module.exports = {
  createVoter,
  getVoters,
  updateVoter,
  addContactHistory,
  getContactHistory
}
