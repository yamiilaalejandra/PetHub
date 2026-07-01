import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import turnosRoutes from "./routes/turnos.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://pet-hub-sable.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
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