
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const SESSION_DURATION = "30d";

router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return res.status(500).json({
      message: "La autenticación no está configurada en el servidor.",
    });
  }

  if (
    typeof password !== "string" ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      message: "Contraseña incorrecta.",
    });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: SESSION_DURATION }
  );

  return res.json({
    token,
    expiresIn: 30 * 24 * 60 * 60,
  });
});

module.exports = router;
