import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  description: String,
  image: String,
  inStock: String,
});

export const ProductModel = mongoose.model("Product", productSchema);

