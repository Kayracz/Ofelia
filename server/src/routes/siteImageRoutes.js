
const express = require("express");
const SiteSettings = require("../models/SiteSettings");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

const DEFAULT_IMAGES = {
  heroImage: "",
  storyImage: "",
  stylingImages: ["", "", "", ""],
};

async function getSettings() {
  return SiteSettings.findOneAndUpdate(
    { key: "main" },
    { $setOnInsert: { key: "main" } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
}

// GET /api/site-images — lectura pública
router.get("/", async (req, res) => {
  try {
    const settings = await getSettings();

    res.json({
      heroImage: settings.heroImage,
      storyImage: settings.storyImage,
      stylingImages: settings.stylingImages,
    });
  } catch (error) {
    console.error("Error al obtener imágenes:", error.message);
    res.status(500).json({
      message: "No se pudieron obtener las imágenes.",
    });
  }
});

// PUT /api/site-images — actualización solo para admin
router.put("/", requireAdmin, async (req, res) => {
  try {
    const { heroImage, storyImage, stylingImages } = req.body;

    const validUrl = (value) =>
      typeof value === "string" &&
      (value === "" || /^https:\/\/.+/i.test(value));

    if (
      !validUrl(heroImage) ||
      !validUrl(storyImage) ||
      !Array.isArray(stylingImages) ||
      stylingImages.length !== 4 ||
      !stylingImages.every(validUrl)
    ) {
      return res.status(400).json({
        message: "Los datos de las imágenes no son válidos.",
      });
    }

    const settings = await SiteSettings.findOneAndUpdate(
      { key: "main" },
      {
        $set: {
          heroImage,
          storyImage,
          stylingImages,
        },
        $setOnInsert: { key: "main" },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      heroImage: settings.heroImage,
      storyImage: settings.storyImage,
      stylingImages: settings.stylingImages,
    });
  } catch (error) {
    console.error("Error al guardar imágenes:", error.message);
    res.status(500).json({
      message: "No se pudieron guardar las imágenes.",
    });
  }
});

module.exports = router;
