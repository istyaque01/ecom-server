import express from "express";
import Stripe from "stripe";
import { configDotenv } from "dotenv";
import { ProductModel } from "../models/products.model.js";
configDotenv();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeConfig = async (req, res) => {
  const { productId, quantity, userId, totalPrice } = req.body;

  const product = await ProductModel.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price * 100,
        },
        quantity,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:5173/payment-success?productId=${productId}&userId=${userId}&quantity=${quantity}&totalPrice=${totalPrice}`,
    cancel_url: `http://localhost:5173/cancel`,
  });

  res.json({ id: session.id });
};
