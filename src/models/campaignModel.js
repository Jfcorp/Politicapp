// /src/models/Campaign.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre_candidato: { // Datos básicos del candidato [cite: 8]
    type: DataTypes.STRING,
    allowNull: false
  },
  objetivos_generales: { // [cite: 9]
    type: DataTypes.TEXT
  },
  meta_votos: { // Meta [cite: 79]
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
})

module.exports = Campaign
