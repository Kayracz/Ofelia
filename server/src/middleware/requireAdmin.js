
const jwt = require("jsonwebtoken");

function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Debes iniciar sesión como administrador.",
    });
  }

  const token = authorization.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permiso para realizar esta acción.",
      });
    }

    next();
  } catch {
    return res.status(401).json({
      message: "La sesión no es válida o ha caducado.",
    });
  }
}

module.exports = requireAdmin;
