
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
}));

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API de OFELIA funcionando correctamente ✨",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ofelia-api",
    database: mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected",
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Falta configurar MONGODB_URI en el archivo .env");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Atlas conectado correctamente");

    app.listen(PORT, () => {
      console.log(`🚀 API de OFELIA en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo iniciar OFELIA:", error.message);
    process.exit(1);
  }
}

startServer();
