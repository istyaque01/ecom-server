import { ProductModel } from "../models/products.model.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { configDotenv } from "dotenv";

configDotenv();

export const upload = multer({ dest: "uploads/" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadProduct = async (req, res) => {
  try {
    const { name, price, description, inStock } = req.body;
    const imagePath = req.file.path;

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "products",
    });

    fs.unlinkSync(imagePath);

    const product = new ProductModel({
      name,
      price,
      description,
      image: result.secure_url,
      inStock,
    });

    await product.save();

    res
      .status(201)
      .json({ status: true, product, total_items: product?.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res
      .status(200)
      .json({ status: true, products, total_items: products.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to retrieve products" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, price, description, inStock } = req?.body;

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.inStock = inStock === "in-stock" ? 1 : 0;
    // product.inStock = inStock === "in-stock";

    await product.save();
    res.json({ status: true, message: "Product uploaded successful", product });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      status: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

