
const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
      required: true,
    },
    heroImage: {
      type: String,
      default: "",
    },
    storyImage: {
      type: String,
      default: "",
    },
    stylingImages: {
      type: [String],
      default: ["", "", "", ""],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SiteSettings",
  siteSettingsSchema
);
