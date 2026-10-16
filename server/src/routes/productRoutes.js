
const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET /api/products
// Obtener los productos activos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ active: true })
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    res.status(500).json({
      message: "No se pudieron obtener los productos.",
    });
  }
});

// GET /api/products/:slug
// Obtener un producto por su slug
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      active: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado.",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener el producto:", error.message);
    res.status(500).json({
      message: "No se pudo obtener el producto.",
    });
  }
});

module.exports = router;
