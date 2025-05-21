import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./confingDB.js";
import userRouter from "./routes/auth.route.js"
import productsRouter from "./routes/products.route.js"
import stripeRouter from "./routes/stripe.route.js"
import purchaseRouter from "./routes/purchase.route.js"

configDotenv()

const app = express();
app.use(express.json());
app.use(cors({
   origin: "*",
  credentials: true,
}));
app.use("/", userRouter)
app.use("/products", productsRouter)
app.use("/payment", stripeRouter)
app.use("/", purchaseRouter)


const PORT = process.env.PORT
app.listen(PORT, () => {
    connectDB()
  console.log(`server is running on port ${PORT}...`);
});