import express from "express";
import {
  getAllProducts,
  updateProduct,
  uploadProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { upload } from "../controllers/products.controller.js";

const router = express.Router();

router.get("/all", getAllProducts);
router.put("/update/:id", updateProduct);
router.post("/upload", upload.single("image"), uploadProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
