// src/models/Leader.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Leader = sequelize.define('Leader', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cedula: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
  },
  direccion: {
    type: DataTypes.STRING
  },
  barrio: { // Nuevo Campo (Estrictamente validado en frontend)
    type: DataTypes.STRING
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY
  },
  oficio: {
    type: DataTypes.STRING
  },
  profesion: {
    type: DataTypes.STRING
  },
  // Capacidad estimada de votos que este líder promete (Compromiso)
  meta_votos: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Relación con Zona se define via asociaciones(zoneId)
  // es buena practica tener el campo explicito si se desea control
  zoneId: {
    type: DataTypes.UUID,
    allowNull: false
  }
})

module.exports = Leader
