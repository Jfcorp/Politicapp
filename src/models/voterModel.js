const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Voter = sequelize.define('Voter', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // --- CAMPOS DE IDENTIFICACIÓN ---
  cedula: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // --- CAMPOS DE CONTACTO Y PERFIL ---
  telefono: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
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
  // --- UBICACIÓN ---
  direccion: {
    type: DataTypes.STRING
  },
  barrio: {
    type: DataTypes.STRING
  },
  // --- CAMPAÑA ---
  tipo_voto: {
    type: DataTypes.ENUM('duro', 'blando', 'posible'),
    defaultValue: 'posible'
  },
  estado_fidelizacion: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  // --- RELACIONES ---
  zoneId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  leaderId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  // Auditoría: Quién lo digitó
  registeredBy: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'Voters',
  timestamps: true
})

module.exports = Voter
