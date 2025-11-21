const { Sequelize } = require('sequelize')
require('dotenv').config()

// Usamos la variable de entorno de Supabase/Railway [cite: 44, 43]
const dbUrl = process.env.DATABASE_URL

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  //   logging: msg => console.log(msg), // Desactivar logs en producción
  logging: false, // Desactivar logs en producción
  dialectOptions: {
    // Opciones de SSL si son requeridas por el hosting
    ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false
  }
})

module.exports = sequelize
