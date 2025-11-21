// scripts/seed.js
require('dotenv').config() // Asegurar carga de variables de entorno
const sequelize = require('../src/config/database')

// IMPORTANTE: Rutas actualizadas a tus nombres de archivo reales (userModel, zoneModel...)
const User = require('../src/models/userModel')
const Zone = require('../src/models/zoneModel')
const Leader = require('../src/models/leaderModel')
const Voter = require('../src/models/voterModel')
const ContactHistory = require('../src/models/contactHistoryModel')

// Cargar asociaciones
require('../src/models/associations')

const seed = async () => {
  console.log('🚀 Iniciando Seed de Datos...')

  try {
    // 1. Conexión y Limpieza
    await sequelize.authenticate()
    console.log('✅ Conexión DB exitosa.')

    // Force: true borra todo y recrea tablas con la estructura nueva
    await sequelize.sync({ force: true })
    console.log('🗑️ Base de datos limpiada y tablas recreadas.')

    // 2. Crear Admin
    console.log('👤 Creando Usuario Admin...')
    const admin = await User.create({
      nombre: 'Super Admin',
      email: 'admin@campana.com',
      password: '123', // El hook del modelo lo encriptará
      role: 'Admin'
    })
    console.log(`   -> Admin creado con ID: ${admin.id}`)

    // 3. Crear Zonas (Ahora requieren numero_comuna y meta_votos)
    console.log('🗺️ Creando Zonas...')
    const zonaNorte = await Zone.create({
      nombre: 'Los Cortijos', // Nombre del barrio/zona
      municipio: 'Valledupar',
      numero_comuna: '5', // <--- CAMPO OBLIGATORIO NUEVO
      meta_votos: 2000, // <--- CORREGIDO (antes meta_votos_zona)
      managerId: admin.id
    })
    console.log('   -> Zona Norte creada (Comuna 5).')

    const zonaSur = await Zone.create({
      nombre: 'San Fernando',
      municipio: 'Valledupar',
      numero_comuna: '2', // <--- CAMPO OBLIGATORIO NUEVO
      meta_votos: 1500,
      managerId: admin.id
    })
    console.log('   -> Zona Sur creada (Comuna 2).')

    // 4. Crear Líderes (Ahora requieren Cédula única)
    console.log('🎯 Creando Líderes...')
    const lider1 = await Leader.create({
      cedula: '1065123456', // <--- CAMPO OBLIGATORIO NUEVO
      nombre: 'Doña Marta',
      telefono: '3001112222',
      email: 'marta@lideres.com',
      direccion: 'Calle 1 # 2-3',
      barrio: 'Los Cortijos',
      meta_votos: 50,
      zoneId: zonaNorte.id
    })
    console.log('   -> Líder 1 creado.')

    const lider2 = await Leader.create({
      cedula: '77123456',
      nombre: 'Jairo "El Tigre"',
      telefono: '3155556666',
      direccion: 'Cra 4 # 5-6',
      barrio: 'San Fernando',
      meta_votos: 200,
      zoneId: zonaSur.id
    })
    console.log('   -> Líder 2 creado.')

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
        leaderId: null // Sin líder asignado
      },
      {
        nombre: 'Votante Blando',
        cedula: '1003',
        telefono: '3109998888',
        direccion: 'Cra 10',
        tipo_voto: 'blando',
        estado_fidelizacion: 3,
        zoneId: zonaSur.id,
        leaderId: lider2.id
      }
    ]

    await Voter.bulkCreate(electoresData)
    console.log('   -> Electores insertados correctamente.')

    console.log('✨ SEED FINALIZADO EXITOSAMENTE ✨')
    process.exit(0)
  } catch (error) {
    console.error('\n⛔ EL SEED FALLÓ FATALMENTE:')
    console.error(error) // Imprime el error completo para depurar
    process.exit(1)
  }
}

seed()
