// /src/models/User.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const bcrypt = require('bcryptjs')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Coordinador', 'Digitador'), // Roles definidos
    allowNull: false,
    defaultValue: 'Digitador'
  }
})

// Hook para hashear la contraseña antes de guardar
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
})

// Método para comparar contraseñas (para el login)
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = User
