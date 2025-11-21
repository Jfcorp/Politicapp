// Recibe una lista de roles permitidos, ej: authorize('Admin', 'Coordinador')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `El rol de usuario '${req.user.role}' no está autorizado para realizar esta acción.`
      })
    }
    next()
  }
}

module.exports = { authorize }
