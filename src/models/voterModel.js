// /src/models/Voter.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Voter = sequelize.define('Voter', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: { // [cite: 12]
    type: DataTypes.STRING,
    allowNull: false
  },
  cedula: { // [cite: 12]
    type: DataTypes.STRING,
    unique: true // Regla de negocio: No duplicado [cite: 161]
  },
  telefono: { // [cite: 12]
    type: DataTypes.STRING
  },
  direccion: { // [cite: 12]
    type: DataTypes.STRING
  },
  tipo_voto: { // Clasificación clave [cite: 13]
    type: DataTypes.ENUM('duro', 'blando', 'posible') // [cite: 13, 496, 497, 498]
  },
  estado_fidelizacion: { //
    type: DataTypes.INTEGER, // (ej. 1 a 5 estrellas como en el mockup [cite: 92])
    defaultValue: 0
  },
  leaderId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  zoneId: {
    type: DataTypes.UUID,
    allowNull: true
  }
})

module.exports = Voter
