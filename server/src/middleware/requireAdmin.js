
const jwt = require("jsonwebtoken");

function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization;

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      message: "La autenticación no está configurada en el servidor.",
    });
  }

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      code: "AUTH_REQUIRED",
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

    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        code: "SESSION_EXPIRED",
        message: "Tu sesión ha caducado. Inicia sesión nuevamente.",
      });
    }

    return res.status(401).json({
      code: "INVALID_SESSION",
      message: "Tu sesión no es válida. Inicia sesión nuevamente.",
    });
  }
}

module.exports = requireAdmin;
