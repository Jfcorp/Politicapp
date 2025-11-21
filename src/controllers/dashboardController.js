// src/controllers/dashboardController.js
const Voter = require('../models/voterModel')
const Zone = require('../models/zoneModel')
const Leader = require('../models/leaderModel')

// @desc    Obtener estadísticas globales (Pantalla Principal)
// @route   GET /api/v1/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    // 1. KPIs Generales (Conteos rápidos)
    const totalElectores = await Voter.count()
    const totalLideres = await Leader.count()
    const totalZonas = await Zone.count()

    // 2. Segmentación del Voto (El "Semáforo" de la campaña)
    const votoDuro = await Voter.count({ where: { tipo_voto: 'duro' } })
    const votoBlando = await Voter.count({ where: { tipo_voto: 'blando' } })
    const votoPosible = await Voter.count({ where: { tipo_voto: 'posible' } })

    // 3. Cálculo de la Meta Global
    // Sumamos las metas individuales de todas las zonas para obtener la meta de campaña
    const zonas = await Zone.findAll({ attributes: ['meta_votos'] })
    const metaTotal = zonas.reduce((sum, zone) => sum + (zone.meta_votos || 0), 0)

    // Evitar división por cero
    const avancePorcentaje = metaTotal > 0
      ? ((totalElectores / metaTotal) * 100).toFixed(1)
      : 0

    res.json({
      resumen: {
        electores_registrados: totalElectores,
        meta_campana: metaTotal,
        avance_global: `${avancePorcentaje}%`,
        total_lideres: totalLideres,
        zonas_activas: totalZonas
      },
      segmentacion: {
        duro: votoDuro, // Voto seguro (Base)
        blando: votoBlando, // Voto a persuadir
        posible: votoPosible // Voto difícil/indeciso
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getDashboardStats }
