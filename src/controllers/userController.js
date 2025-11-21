const User = require('../models/userModel')

// @desc    Obtener lista de usuarios (para selectores)
// @route   GET /api/v1/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'role'], // Solo lo necesario
      where: { role: ['Coordinador', 'Admin', 'Digitador'] } // Filtra si es necesario
    })
    res.json(users)
  } catch (error) {
    next(error)
  }
}

module.exports = { getUsers }
