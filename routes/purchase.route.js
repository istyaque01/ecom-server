import express from "express";
import { purchaseOrder } from "../controllers/purchase.controller.js";
const router = express.Router();

router.post("/purchase/save-purchase", purchaseOrder);
export default router;
