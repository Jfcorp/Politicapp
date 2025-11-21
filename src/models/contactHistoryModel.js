// /src/models/ContactHistory.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const ContactHistory = sequelize.define('ContactHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fecha_contacto: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  notas: { // Notas [cite: 93]
    type: DataTypes.TEXT
  }
  // Relación con Voter y User (quién hizo el contacto)
})

module.exports = ContactHistory
