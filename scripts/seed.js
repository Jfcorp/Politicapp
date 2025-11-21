require('dotenv').config()
const sequelize = require('../src/config/database')
const User = require('../src/models/userModel')
const Zone = require('../src/models/zoneModel')
const Leader = require('../src/models/leaderModel')
const Voter = require('../src/models/voterModel')
require('../src/models/associations')

// DICCIONARIO DE DATOS COMPLETO (Extraído de tus archivos)
const BARRIOS_POR_COMUNA = {
  1: [
    'EL CENTRO', 'LOPERENA', 'ALTAGRACIA', 'EL CARMEN', 'LA GARITA', 'GAITAN',
    'KENNEDY', 'LA GRANJA', 'SAN JORGE', 'SOPERENA', 'SANTO DOMINGO', 'MIRAFLORES',
    'LAS DELICIAS', 'HOSPITAL', 'SAN ANTONIO', 'PABLO VI', 'GUATAPURI', 'LAS PALMAS',
    'EL PESCAITO', 'ESPERANZA ORIENTE', '9 DE MARZO', 'ZAPATO EN MANO', 'SANTA ANA'
  ],
  2: [
    'MAYALES', 'SANTA RITA', 'VILLA CLARA', 'PANAMA', 'LOS COCOS', 'LOS MILAGROS',
    '12 DE OCTUBRE', 'SAN FERNANDO', 'BERMEJA', 'CENTAURO', 'CDA. CAÑAGUATE',
    'VILLA CASTRO', 'VERSALLES', 'VILLA DEL ROSARIO', 'AMANECERES DEL VALLE'
  ],
  3: [
    'PRIMERO DE MAYO', 'SAN MARTIN', 'VILLA LEONOR', 'VALLE MEZA', 'SIETE DE AGOSTO',
    'LOS FUNDADORES', '25 DE DICIEMBRE', 'DON CARMELO', 'MAREIGUA', 'EL OASIS',
    'VILLA HAYDI', 'LA FE', 'NUEVO MILENIO', 'EL PARAMO', 'ALTOS DE ZIRUMA'
  ],
  4: [
    'LA VICTORIA', 'LOS CACIQUES', 'VILLA TAXI', 'EL PROGRESO', 'CICARON', 'VILLA MIRIAM',
    'FRANCISCO DE PAULA', 'LA MARIGUITA', 'CIUDADELA 450 AÑOS', 'POPULAR',
    'JORGE DANGOND', 'SAN MARINO', 'VILLA LUZ', 'LIMONAR', 'ALAMOS'
  ],
  5: [
    'LA NEVADA', 'DIVINO NIÑO', 'BELLO HORIZONTE', 'FUTURO DE LOS NIÑOS', 'LA ROCA',
    'VILLA CONSUELO', 'CAMPO ROMERO', 'VILLA YANETH', 'LOS CORTIJOS', 'LA ESPERANZA',
    'VILLALBA', 'ALTOS DE GARUPAL', 'EL ENEAL', 'ARIZONA', 'SAN ISIDRO'
  ],
  6: [
    'LOS AGUINALDOS', 'UNIDOS', 'NUEVO AMANECER', 'EL ROCIO', 'SAN JERONIMO',
    'LOS CAMPANOS', 'ROSANIA', 'PASADENA', 'LOS ANGELES', 'SAN CARLOS', 'NOVALITO'
  ]
}

const seed = async () => {
  console.log('🚀 Iniciando Carga Masiva de Territorio...')

  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: true }) // REINICIO TOTAL
    console.log('🗑️ BD Limpia.')

    // 1. Crear Admin
    const admin = await User.create({
      nombre: 'Super Admin',
      email: 'admin@campana.com',
      password: '123',
      role: 'Admin'
    })
    console.log('👤 Admin creado.')

    // 2. Crear Zonas Masivamente
    const zonasParaInsertar = []

    Object.entries(BARRIOS_POR_COMUNA).forEach(([comuna, barrios]) => {
      barrios.forEach(barrio => {
        zonasParaInsertar.push({
          nombre: barrio, // El nombre de la zona es el barrio
          municipio: 'Valledupar',
          numero_comuna: comuna,
          meta_votos: 0, // Inicialmente 0, el gerente la definirá
          managerId: null // Inicialmente sin gerente
        })
      })
    })

    await Zone.bulkCreate(zonasParaInsertar)
    console.log(`🗺️ ${zonasParaInsertar.length} Zonas (Barrios) cargadas exitosamente.`)

    console.log('✨ SEED FINALIZADO ✨')
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

seed()
