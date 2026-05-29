import cors from "cors";
import "dotenv/config";
import express from "express";
import { alertRoutes } from "./routes/alertRoutes";
import { categoryRoutes } from "./routes/categoryRoutes";
import { authRoutes } from "./routes/authRoutes";
import { favoriteRoutes } from "./routes/favoriteRoutes";
import { priceHistoryRoutes } from "./routes/priceHistoryRoutes";
import { productRoutes } from "./routes/productRoutes";
import { storeRoutes } from "./routes/storeRoutes";
import { userRoutes } from "./routes/userRoutes";

export const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/health", (_request, response) => {
  return response.json({
    status: "online",
    service: "PriceWatch API",
    timestamp: new Date().toISOString()
  });
});

app.use("/products", productRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/alerts", alertRoutes);
app.use("/auth", authRoutes);
app.use("/stores", storeRoutes);
app.use("/categories", categoryRoutes);
app.use("/price-history", priceHistoryRoutes);
app.use("/users", userRoutes);
