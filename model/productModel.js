const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    prd_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    link: {
      type: String,
    },

    ratings: {
      type: String,
      default: "0",
    },

    no_of_ratings: {
      type: String,
      default: "0",
    },

    discount_price: {
      type: String,
      required: true,
    },

    actual_price: {
      type: String,
      required: true,
    },

    stock: {
      type: String,
      default: "0",
    },

    total_sold: {
      type: String,
      default: "0",
    },

    weight: {
      type: String,
    },

    Gender: {
      type: String,
      default: "All",
    },

    tag_no: {
      type: String,
    }
  },
  { timestamps: true }
);

const productTable = mongoose.model("Product", productSchema);
module.exports = productTable