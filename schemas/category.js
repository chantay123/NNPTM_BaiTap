const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    Timestamps: true,
  }
);

module.exports = mongoose.model("category", categorySchema);
