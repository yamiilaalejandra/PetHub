import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import turnosRoutes from "./routes/turnos.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  "https://pet-hub-sable.vercel.app"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isAllowedOrigin = allowedOrigins.includes(origin) || /https:\/\/.*\.vercel\.app$/i.test(origin);
    if (isAllowedOrigin) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/usuarios", authRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.send("API funcionando");
});

export default app;
