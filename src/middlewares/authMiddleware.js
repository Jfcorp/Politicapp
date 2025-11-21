const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = async (req, res, next) => {
  let token

  // Verificar si existe el header de autorización con formato "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtener el token del header
      token = req.headers.authorization.split(' ')[1]

      // Decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Buscar el usuario en la DB y adjuntarlo a la request (excluyendo el password)
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      })

      if (!user) {
        return res.status(401).json({ message: 'Token no válido: El usuario ya no existe.' })
      }
      req.user = user
      next() // Continuar al siguiente middleware o controlador
    } catch (error) {
      console.error(error)
      res.status(401).json({ message: 'No autorizado, token fallido' })
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no se encontró token' })
  }
}

module.exports = { protect }
