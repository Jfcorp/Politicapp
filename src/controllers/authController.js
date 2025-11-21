// src/controllers/authController.js
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// Función auxiliar para generar el Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d' // La sesión dura 30 días
  })
}

// @desc    Registrar un nuevo usuario del equipo (Staff)
// @route   POST /api/v1/auth/register
// @access  Public (o restringido a Admin según la regla de negocio)
const register = async (req, res) => {
  const { nombre, email, password, role } = req.body

  try {
    // 1. Verificar si el usuario ya existe
    const userExists = await User.findOne({ where: { email } })

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya está registrado en el sistema.' })
    }

    // 2. Crear usuario (El hook del modelo se encarga de hashear el password)
    const user = await User.create({
      nombre, // Importante para identificar quién hace qué en el War Room
      email,
      password,
      role // 'Admin', 'Coordinador', 'Digitador' [cite: 853]
    })

    // 3. Responder con éxito y token
    res.status(201).json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role)
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en el servidor al registrar usuario' })
  }
}

// @desc    Iniciar sesión y obtener token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // 1. Buscar usuario por email
    const user = await User.findOne({ where: { email } })

    // 2. Validar usuario y contraseña
    if (user && (await user.comparePassword(password))) {
      res.json({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role)
      })
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en el servidor durante el login' })
  }
}

module.exports = { register, login }
