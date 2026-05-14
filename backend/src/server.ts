import cors from "cors";
import "dotenv/config";
import express from "express";
import { alertRoutes } from "./routes/alertRoutes";
import { favoriteRoutes } from "./routes/favoriteRoutes";
import { productRoutes } from "./routes/productRoutes";

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

app.listen(port, () => {
  console.log(`PriceWatch API running on http://localhost:${port}`);
});
