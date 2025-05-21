import express from "express";
import { stripeConfig } from "../controllers/stripe.controller.js";

const router = express.Router();

router.post("/create-checkout-session", stripeConfig);

export default router;
