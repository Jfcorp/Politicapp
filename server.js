// server.js
require('dotenv').config() // Cargar variables de entorno
const app = require('./src/app')
const sequelize = require('./src/config/database')

// Importar asociaciones para que Sequelize reconozca las relaciones antes de sincronizar
require('./src/models/associations')

const PORT = process.env.PORT || 3000

async function main () {
  try {
    // 1. Probar conexión a la Base de Datos
    await sequelize.authenticate()
    console.log('✅ Conexión a la Base de Datos establecida correctamente.')

    // 2. Sincronizar modelos con la DB
    // force: false evita borrar los datos existentes. Usar 'alter: true' para cambios leves en dev.
    await sequelize.sync({ alter: true })
    console.log('✅ Base de datos recreada (Columnas actualizadas).')

    // 3. Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Política Pro corriendo en el puerto ${PORT}`)
      console.log(`👉 API disponible en: http://localhost:${PORT}/api/v1`)
    })
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error)
  }
}

main()
