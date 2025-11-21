// scripts/seed.js
require('dotenv').config() // Asegurar carga de variables de entorno
const sequelize = require('../src/config/database')
// Importar Modelos directamente para evitar problemas de exportación circular
const User = require('../src/models/User')
const Zone = require('../src/models/Zone')
const Leader = require('../src/models/Leader')
const Voter = require('../src/models/Voter')
const ContactHistory = require('../src/models/contactHistoryModel')

// Cargar asociaciones (Crítico para las llaves foráneas)
require('../src/models/associations')

const seed = async () => {
  console.log('🚀 Iniciando Seed de Datos...')

  try {
    // 1. Conexión y Limpieza
    await sequelize.authenticate()
    console.log('✅ Conexión DB exitosa.')

    await sequelize.sync({ force: true })
    console.log('🗑️ Base de datos limpiada y tablas recreadas.')

    // 2. Crear Admin
    console.log('👤 Creando Usuario Admin...')
    const admin = await User.create({
      nombre: 'Super Admin',
      email: 'admin@campana.com',
      password: '123', // El modelo se encargará de hashear esto
      role: 'Admin'
    }).catch(err => {
      console.error('❌ Falló crear Admin:', err.errors ? err.errors.map(e => e.message) : err.message)
      throw err
    })
    console.log(`   -> Admin creado con ID: ${admin.id}`)

    // 3. Crear Zonas
    console.log('🗺️ Creando Zonas...')
    const zonaNorte = await Zone.create({
      nombre: 'Comuna Norte',
      municipio: 'Valledupar',
      meta_votos_zona: 2000,
      managerId: admin.id
    })
    console.log(`   -> Zona Norte creada con ID: ${zonaNorte.id}`)

    const zonaSur = await Zone.create({
      nombre: 'Barrio El Carmen',
      municipio: 'Valledupar',
      meta_votos_zona: 1500,
      managerId: admin.id
    })

    // 4. Crear Líderes
    console.log('🎯 Creando Líderes...')
    const lider1 = await Leader.create({
      nombre: 'Doña Marta',
      telefono: '3001112222',
      meta_votos: 50,
      zoneId: zonaNorte.id
    })
    console.log(`   -> Líder 1 creado con ID: ${lider1.id}`)

    // 5. Crear Electores
    console.log('👥 Creando Electores...')
    const electoresData = [
      {
        nombre: 'Elector Duro 1',
        cedula: '1001',
        telefono: '3001234567',
        direccion: 'Calle 1',
        tipo_voto: 'duro',
        estado_fidelizacion: 5,
        zoneId: zonaNorte.id,
        leaderId: lider1.id
      },
      {
        nombre: 'Elector Indeciso',
        cedula: '1002',
        telefono: '3009876543',
        direccion: 'Calle 2',
        tipo_voto: 'posible',
        estado_fidelizacion: 2,
        zoneId: zonaSur.id,
        leaderId: null
      }
    ]

    await Voter.bulkCreate(electoresData)
    console.log('   -> Electores insertados correctamente.')

    console.log('✨ SEED FINALIZADO EXITOSAMENTE ✨')
    process.exit(0)
  } catch (error) {
    console.error('\n⛔ EL SEED FALLÓ FATALMENTE:')
    console.error(error)
    process.exit(1)
  }
}

seed()
