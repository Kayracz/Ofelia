
const express = require("express");
const Product = require("../models/Product");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// Generate product slug
function createSlug(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Validate product information and variations
function validateProduct(body) {
  const { name, category, price, description, variants } = body;

  const validBase =
    typeof name === "string" &&
    name.trim().length > 0 &&
    ["panolletas", "flecos", "twillys"].includes(category) &&
    Number.isFinite(Number(price)) &&
    Number(price) > 0 &&
    typeof description === "string" &&
    description.trim().length > 0;

  if (!validBase) return false;

  if (variants === undefined) return true;
  if (!Array.isArray(variants)) return false;

  const labels = new Set();

  return variants.every((variant) => {
    if (
      !variant ||
      typeof variant.label !== "string" ||
      !variant.label.trim() ||
      !Number.isFinite(Number(variant.price)) ||
      Number(variant.price) <= 0
    ) {
      return false;
    }

    const label = variant.label.trim().toLowerCase();

    if (labels.has(label)) return false;

    labels.add(label);
    return true;
  });
}

// Clean variations before saving
function cleanVariants(variants) {
  if (!Array.isArray(variants)) return [];

  return variants.map((variant) => ({
    label: variant.label.trim(),
    price: Number(variant.price),
  }));
}

// GET ALL PRODUCTS
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

// GET PRODUCT BY SLUG
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

// CREATE PRODUCT
router.post("/", requireAdmin, async (req, res) => {
  try {
    if (!validateProduct(req.body)) {
      return res.status(400).json({
        message: "Revisa el nombre, la categoría, el precio y las variantes.",
      });
    }

    const lastProduct = await Product.findOne()
      .sort({ id: -1 })
      .select("id");

    const id = lastProduct ? lastProduct.id + 1 : 1;

    const product = await Product.create({
      id,
      name: req.body.name.trim(),
      slug: createSlug(req.body.name),
      category: req.body.category,
      price: Number(req.body.price),
      variants: cleanVariants(req.body.variants),
      isNew: Boolean(req.body.isNew),
      description: req.body.description.trim(),
      imageUrl: req.body.imageUrl || "",
      images: Array.isArray(req.body.images)
        ? req.body.images
        : [],
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

// UPDATE PRODUCT
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    if (!validateProduct(req.body)) {
      return res.status(400).json({
        message: "Revisa el nombre, la categoría, el precio y las variantes.",
      });
    }

    const product = await Product.findOneAndUpdate(
      {
        id: Number(req.params.id),
        active: true,
      },
      {
        name: req.body.name.trim(),
        slug: createSlug(req.body.name),
        category: req.body.category,
        price: Number(req.body.price),
        variants: cleanVariants(req.body.variants),
        isNew: Boolean(req.body.isNew),
        description: req.body.description.trim(),
        imageUrl: req.body.imageUrl || "",
        images: Array.isArray(req.body.images)
          ? req.body.images
          : [],
      },
      {
        new: true,
        runValidators: true,
      }
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

// DELETE PRODUCT (SOFT DELETE)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        id: Number(req.params.id),
        active: true,
      },
      {
        active: false,
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado.",
      });
    }

    res.json({
      message: "Producto eliminado correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error.message);

    res.status(500).json({
      message: "No se pudo eliminar el producto.",
    });
  }
});

module.exports = router;
