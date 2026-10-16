
const express = require("express");
const Product = require("../models/Product");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

function createSlug(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validateProduct(body) {
  const { name, category, price, description } = body;

  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    ["panolletas", "flecos", "twillys"].includes(category) &&
    Number.isFinite(price) &&
    price > 0 &&
    typeof description === "string" &&
    description.trim().length > 0
  );
}

// GET /api/products — catálogo público
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

// GET /api/products/:slug — detalle público
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

// POST /api/products — crear
router.post("/", requireAdmin, async (req, res) => {
  try {
    if (!validateProduct(req.body)) {
      return res.status(400).json({
        message: "Revisa el nombre, la categoría, el precio y la descripción.",
      });
    }

    const id = await Product.countDocuments() > 0
      ? (await Product.findOne().sort({ id: -1 }).select("id")).id + 1
      : 1;

    const slug = createSlug(req.body.name);

    const product = await Product.create({
      id,
      name: req.body.name.trim(),
      slug,
      category: req.body.category,
      price: req.body.price,
      isNew: Boolean(req.body.isNew),
      description: req.body.description.trim(),
      imageUrl: req.body.imageUrl || "",
      images: Array.isArray(req.body.images) ? req.body.images : [],
      active: true,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error al crear producto:", error.message);
    res.status(500).json({
      message: "No se pudo crear el producto.",
    });
  }
});

// PUT /api/products/:id — editar
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    if (!validateProduct(req.body)) {
      return res.status(400).json({
        message: "Revisa el nombre, la categoría, el precio y la descripción.",
      });
    }

    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id), active: true },
      {
        name: req.body.name.trim(),
        slug: createSlug(req.body.name),
        category: req.body.category,
        price: req.body.price,
        isNew: Boolean(req.body.isNew),
        description: req.body.description.trim(),
        imageUrl: req.body.imageUrl || "",
        images: Array.isArray(req.body.images) ? req.body.images : [],
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado.",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al editar producto:", error.message);
    res.status(500).json({
      message: "No se pudo editar el producto.",
    });
  }
});

// DELETE /api/products/:id — eliminar
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id), active: true },
      { active: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado.",
      });
    }

    res.json({ message: "Producto eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar producto:", error.message);
    res.status(500).json({
      message: "No se pudo eliminar el producto.",
    });
  }
});
module.exports = router;
