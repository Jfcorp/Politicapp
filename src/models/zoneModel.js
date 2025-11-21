// /src/models/Zone.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Zone = sequelize.define(
  'Zone',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    numero_comuna: {
      type: DataTypes.STRING, // Guardará "1", "2", "3"... para conectar con el diccionario
      allowNull: false // Es obligatorio para que funcione la lógica de barrios
    },
    nombre: { // [cite: 18]
      type: DataTypes.STRING,
      allowNull: false
    },
    municipio: { // Útil para jerarquía geográfica
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Valledupar'
    },
    meta_votos: { // [cite: 20]
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    managerId: {
      type: DataTypes.UUID,
      allowNull: true // Puede crearse la zona sin gerente al principio
    }
  },
  {
    tableName: 'Zones', // ✅ Esto va AQUÍ
    timestamps: true
  }
)

module.exports = Zone
