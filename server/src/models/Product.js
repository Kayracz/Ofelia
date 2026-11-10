
const mongoose = require("mongoose");

// Product size and price variations
const productVariantSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0.01,
    },
  },
  { _id: false }
);

// Main product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    id: {
      type: Number,
      required: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["panolletas", "flecos", "twillys"],
    },

    // Default product price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Optional product variations
    variants: {
      type: [productVariantSchema],
      default: [],
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);
