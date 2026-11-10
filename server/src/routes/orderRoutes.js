
const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// Normalizar etiquetas para comparar medidas.
// Ejemplo: "55 × 55 cm", "55 x 55" y "55 X 55 CM".
function normalizeVariantLabel(label) {
  return String(label || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[×]/g, "x")
    .replace(/\bcm\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// Registrar un pedido desde el checkout
router.post("/", async (req, res) => {
  try {
    const {
      name,
      lastName,
      email,
      phone,
      department,
      city,
      address = "",
      reference = "",
      delivery,
      items,
    } = req.body;

    // Validar datos obligatorios
    if (
      !name?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !department?.trim() ||
      !city?.trim() ||
      !["envio", "retiro"].includes(delivery) ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Completa los datos obligatorios del pedido.",
      });
    }

    // Validar productos y cantidades
    for (const item of items) {
      if (
        !Number.isInteger(Number(item.productId)) ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        return res.status(400).json({
          message: "Hay un producto o una cantidad inválida.",
        });
      }
    }

    // Obtener los productos desde MongoDB
    const productIds = [
      ...new Set(items.map((item) => Number(item.productId))),
    ];

    const products = await Product.find({
      id: { $in: productIds },
      active: true,
    }).maxTimeMS(10000);

    if (products.length !== productIds.length) {
      return res.status(400).json({
        message: "Uno o más productos ya no están disponibles.",
      });
    }

    const orderItems = [];

    // Validar cada producto y su variante
    for (const item of items) {
      const product = products.find(
        (p) => p.id === Number(item.productId)
      );

      if (!product) {
        return res.status(400).json({
          message: "Uno o más productos ya no están disponibles.",
        });
      }

      const variants = product.variants || [];
      let selectedVariant = null;

      const requestedVariantLabel =
        item.variantLabel || item.variant?.label || "";

      if (variants.length > 0) {
        selectedVariant = variants.find(
          (variant) =>
            normalizeVariantLabel(variant.label) ===
            normalizeVariantLabel(requestedVariantLabel)
        );

        if (!selectedVariant) {
          console.error("Variante no encontrada:", {
            product: product.name,
            requestedVariantLabel,
            availableVariants: variants.map((v) => v.label),
          });

          return res.status(400).json({
            message: `Selecciona una medida válida para ${product.name}.`,
          });
        }
      } else if (requestedVariantLabel) {
        return res.status(400).json({
          message: `${product.name} ya no tiene esa opción disponible.`,
        });
      }

      // Guardar el precio real del producto o de su variante
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: selectedVariant
          ? selectedVariant.price
          : product.price,
        quantity: Number(item.quantity),
        imageUrl: product.imageUrl || "",
        variantLabel: selectedVariant?.label || "",
      });
    }

    // Calcular el total usando los precios de MongoDB
    const totalPrice = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Crear el pedido
    const order = await Order.create({
      orderNumber: `OF-${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      customer: {
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },
      delivery: {
        method: delivery,
        department: department.trim(),
        city: city.trim(),
        address: address.trim(),
        reference: reference.trim(),
      },
      items: orderItems,
      totalPrice,
      status: "pendiente",
    });

    return res.status(201).json({
      message: "Pedido registrado correctamente.",
      order: {
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Error registrando pedido:", error);

    return res.status(500).json({
      message: "No se pudo registrar el pedido.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
});

// Consultar pedidos desde el panel de administración
router.get("/", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .maxTimeMS(10000);

    return res.json(orders);
  } catch (error) {
    console.error("Error consultando pedidos:", error);

    return res.status(500).json({
      message: "No se pudieron consultar los pedidos.",
    });
  }
});

// Actualizar el estado de un pedido
router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    const allowedStatuses = [
      "pendiente",
      "pagado",
      "enviado",
      "cancelado",
    ];

    const { status } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Identificador de pedido inválido.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Estado de pedido inválido.",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).maxTimeMS(10000);

    if (!order) {
      return res.status(404).json({
        message: "Pedido no encontrado.",
      });
    }

    return res.json(order);
  } catch (error) {
    console.error("Error actualizando pedido:", error);

    return res.status(500).json({
      message: "No se pudo actualizar el pedido.",
    });
  }
});

module.exports = router;
