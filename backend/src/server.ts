import cors from "cors";
import "dotenv/config";
import express from "express";
import { alertRoutes } from "./routes/alertRoutes";
import { categoryRoutes } from "./routes/categoryRoutes";
import { authRoutes } from "./routes/authRoutes";
import { favoriteRoutes } from "./routes/favoriteRoutes";
import { notificationRoutes } from "./routes/notificationRoutes";
import { priceHistoryRoutes } from "./routes/priceHistoryRoutes";
import { productRoutes } from "./routes/productRoutes";
import { storeRoutes } from "./routes/storeRoutes";
import { userRoutes } from "./routes/userRoutes";

const app = express();
const port = Number(process.env.PORT ?? 3333);

app.use(cors());
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
app.use("/notifications", notificationRoutes);
app.use("/stores", storeRoutes);
app.use("/categories", categoryRoutes);
app.use("/price-history", priceHistoryRoutes);
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`PriceWatch API running on http://localhost:${port}`);
});
