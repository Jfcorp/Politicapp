// scripts/create_digitadores.js
require('dotenv').config()
const sequelize = require('../src/config/database')
const User = require('../src/models/userModel')

const createDigitadores = async () => {
  console.log('🚀 Iniciando creación de Digitadores...')

  try {
    await sequelize.authenticate()
    console.log('✅ Conexión DB exitosa.')

    // Lista de Digitadores
    const staff = [
      { nombre: 'Digitador 1', email: 'dig1@politicapp.com', password: 'Jj_121212', role: 'Digitador' },
      { nombre: 'Digitador 2', email: 'dig2@politicapp.com', password: 'Jj_121212', role: 'Digitador' },
      { nombre: 'Digitador 3', email: 'dig3@politicapp.com', password: 'Jj_121212', role: 'Digitador' },
      { nombre: 'Digitador 4', email: 'dig4@politicapp.com', password: 'Jj_121212', role: 'Digitador' },
      { nombre: 'Digitador 5', email: 'dig5@politicapp.com', password: 'Jj_121212', role: 'Digitador' }
    ]

    for (const u of staff) {
      // Verificar si ya existe para no duplicar
      const exists = await User.findOne({ where: { email: u.email } })

      if (!exists) {
        await User.create(u)
        console.log(`✅ Creado: ${u.nombre} (${u.email})`)
      } else {
        console.log(`⚠️ Omitido (Ya existe): ${u.email}`)
      }
    }

    console.log('✨ PROCESO FINALIZADO ✨')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creando digitadores:', error)
    process.exit(1)
  }
}

createDigitadores()
