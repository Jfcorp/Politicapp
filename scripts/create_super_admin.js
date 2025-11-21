// scripts/create_super_admin.js
require('dotenv').config()
const sequelize = require('../src/config/database')
const User = require('../src/models/userModel')

const createSuperAdmin = async () => {
  console.log('🚀 Creando Super Admin...')

  try {
    await sequelize.authenticate()
    console.log('✅ Conexión DB exitosa.')

    const superAdmin = {
      nombre: 'Jonathan Manzano',
      email: 'developer@politicapp.com',
      password: 'Jfcorp@158711',
      role: 'Admin'
    }

    // Verificar si ya existe
    const exists = await User.findOne({ where: { email: superAdmin.email } })

    if (!exists) {
      // El modelo se encarga de encriptar la contraseña automáticamente
      await User.create(superAdmin)
      console.log(`✅ SUPER ADMIN CREADO: ${superAdmin.email}`)
    } else {
      console.log(`⚠️ El usuario ${superAdmin.email} ya existe.`)

      // Opcional: Si quieres actualizarle la contraseña al existente, descomenta esto:
      /*
      exists.password = superAdmin.password;
      exists.nombre = superAdmin.nombre;
      await exists.save(); // Esto disparará el hook de encriptación
      console.log('🔄 Datos de Super Admin actualizados.');
      */
    }

    console.log('✨ PROCESO FINALIZADO ✨')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creando Super Admin:', error)
    process.exit(1)
  }
}

createSuperAdmin()
