import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";


// Routes
import patientRoutes from "./routes/patients";
import mealPlanRoutes from "./routes/mealPlans";
import kitchenRoutes from "./routes/kitchen";
import trackingRoutes from "./routes/tracking";
import inventoryRoutes from "./routes/inventory";
import dietGroupRoutes from "./routes/dietGroups";
import reportRoutes from "./routes/reports";
import authRoutes from "./routes/auth";
import suggestionRoutes from "./routes/suggestions";
import chatRoutes from "./routes/chat";
import meRoutes from "./routes/me";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: /^http:\/\/localhost(:\d+)?$/, credentials: true }));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/kitchen", kitchenRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/diet-groups", dietGroupRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/me", meRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 NutriSync backend running on http://localhost:${PORT}`);
  console.log(`📦 Database: Cloudflare D1 (${process.env.CF_D1_DATABASE_ID ?? "not configured"})`);
});

export default app;
