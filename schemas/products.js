const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quanlity: {
      type: Number,
      required: true,
      min: 0,
    },
    urlimage: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    Timestamps: true,
  }
);

module.exports = mongoose.module("product", productSchema);
