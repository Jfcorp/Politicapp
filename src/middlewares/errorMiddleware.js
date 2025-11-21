const logger = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  // Loguear el error derallado en el servidor
  logger.error(`${err.status || 500} - ${err.message} - ${req.orignalUrl} - ${req.method} - ${req.ip}`)

  // 1. Manejo de error especifico de Sequelize: Columna no existente
  // Codigo PostgreSql 42703: undefined_column
  if (err.name === 'SequelizeDatabaseError' && err.parent && err.parent.code === '42703') {
    return res.status(400).json({
      success: false,
      message: 'Error en la consulta: Se solicito un campo o columna que no existe en la base de datos.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }

  // 2. Errores de validacion de sequelize (ej. email duplicado, campos nulos)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map(el => el.message)
    return res.status(400).json({
      success: false,
      message: 'Error de validacion de datos',
      errors: messages
    })
  }

  // Error por defecto (500)
  const statusCode = err.statusCode || 500
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}

module.exports = errorHandler
