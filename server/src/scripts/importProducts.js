
require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");

const products = [
  {
    id: 1,
    name: "Isabella",
    slug: "isabella",
    category: "panolletas",
    price: 159,
    isNew: true,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    name: "Siena",
    slug: "siena",
    category: "panolletas",
    price: 159,
    isNew: false,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 3,
    name: "Mimosa",
    slug: "mimosa",
    category: "twillys",
    price: 120,
    isNew: true,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 4,
    name: "Tutti",
    slug: "tutti",
    category: "twillys",
    price: 120,
    isNew: false,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 5,
    name: "Perla",
    slug: "perla",
    category: "flecos",
    price: 240,
    isNew: true,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

async function importProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const product of products) {
      await Product.updateOne(
        { id: product.id },
        {
          $set: product,
          $setOnInsert: { active: true },
        },
        { upsert: true }
      );
    }

    console.log(`✅ Importación completada: ${products.length} productos procesados.`);
  } catch (error) {
    console.error("❌ Error al importar productos:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

importProducts();
