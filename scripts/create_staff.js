// scripts/create_staff.js
require('dotenv').config()
const sequelize = require('../src/config/database')
const User = require('../src/models/userModel')

const createStaff = async () => {
  await sequelize.authenticate()

  const staff = [
    { nombre: 'Digitador 1', email: 'dig1@campana.com', password: '123', role: 'Digitador' },
    { nombre: 'Digitador 2', email: 'dig2@campana.com', password: '123', role: 'Digitador' },
    { nombre: 'Digitador 3', email: 'dig3@campana.com', password: '123', role: 'Digitador' },
    { nombre: 'Digitador 4', email: 'dig4@campana.com', password: '123', role: 'Digitador' },
    { nombre: 'Digitador 5', email: 'dig5@campana.com', password: '123', role: 'Digitador' }
  ]

  for (const u of staff) {
    try {
      await User.create(u)
      console.log(`✅ Creado: ${u.email}`)
    } catch (e) {
      console.log(`⚠️ Ya existe: ${u.email}`)
    }
  }
  process.exit()
}

createStaff()
