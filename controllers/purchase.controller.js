import express from "express";
import { PurchaseModel } from "../models/purchase.mpdel.js";
import { ProductModel } from "../models/products.model.js";
import { userModel } from "../models/auth.model.js";

export const purchaseOrder = async (req, res) => {
  const { userId, productId, quantity, totalPrice } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ status: false, message: "Product not found" });

    const purchase = new PurchaseModel({
      user: user._id,
      product: product._id,
      quantity,
      totalPrice,
    });

    await purchase.save();

    return res.json({
      status: true,
      message: "Purchase saved successfully",
      product,
      purchase,
    });
  } catch (error) {
    console.error("Error saving purchase:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
