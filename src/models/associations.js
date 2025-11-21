const User = require('./userModel')
const Voter = require('./voterModel')
const Zone = require('./zoneModel')
const Leader = require('./leaderModel')
const ContactHistory = require('./contactHistoryModel')

console.log('🔄 Cargando Asociaciones de Base de Datos...')

// --- RELACIONES ZONAS (Aquí está la clave del error) ---

// 1. Definición correcta del alias 'gerente'
Zone.belongsTo(User, { foreignKey: 'managerId', as: 'gerente' })
// Zone.belongsTo(User, { foreignKey: 'managerId' })

// 2. Relación inversa (opcional pero recomendada para consistencia)
User.hasMany(Zone, { foreignKey: 'managerId', as: 'zonas_asignadas' })

// --- Resto de Relaciones ---
Zone.hasMany(Voter, { foreignKey: 'zoneId' })
Voter.belongsTo(Zone, { foreignKey: 'zoneId' })

Zone.hasMany(Leader, { foreignKey: 'zoneId' })
Leader.belongsTo(Zone, { foreignKey: 'zoneId' })

Leader.hasMany(Voter, { foreignKey: 'leaderId', as: 'electores' })
Voter.belongsTo(Leader, { foreignKey: 'leaderId', as: 'lider' })

User.hasMany(ContactHistory, { foreignKey: 'userId' })
ContactHistory.belongsTo(User, { foreignKey: 'userId' })
Voter.hasMany(ContactHistory, { foreignKey: 'voterId' })
ContactHistory.belongsTo(Voter, { foreignKey: 'voterId' })

module.exports = { User, Voter, Zone, ContactHistory, Leader }
