const { createLogger, format, transports } = require('winston')
const path = require('path')

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Guardar el stack trace si hay error
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'politicapp360-pro-api' },
  transports: [
    // Escribir todos los logs con nivel 'error' o inferior en 'logs/error.log'
    new transports.File({ filename: path.join(__dirname, '../../logs/error.log'), level: 'error' }),
    // Escribir todos los logs  en 'logs/combined.log'
    new transports.File({ filename: path.join(__dirname, '../../logs/combined.log') })
  ]
})

// Si no estamos en produccion, imprimir en consola con formato simple
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple() // Formato legible: "level: message"
    )
  }))
}

module.exports = logger
