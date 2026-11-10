
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const siteImageRoutes = require("./routes/siteImageRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://ofelia-store.onrender.com",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin Origin, como health checks.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("CORS bloqueado para:", origin);
      return callback(new Error("Origen no permitido por CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/site-images", siteImageRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API de OFELIA funcionando correctamente ✨",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ofelia-api",
    database:
      mongoose.connection.readyState === 1
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
