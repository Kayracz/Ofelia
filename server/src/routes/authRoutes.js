
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

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
    { expiresIn: "2h" }
  );

  return res.json({
    token,
    expiresIn: 7200,
  });
});

module.exports = router;
