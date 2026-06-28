import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import turnosRoutes from "./routes/turnos.routes.js";

// Cargo las variables de entorno (como DATABASE_URL, JWT_SECRET, etc)
dotenv.config();

const app = express();

// Habilito CORS para permitir que el frontend pueda hacer peticiones al backend.
app.use(cors());

// Middleware para que Express pueda leer JSON enviados desde el frontend.
app.use(express.json());

// Rutas separadas por responsabilidad.
app.use("/api/auth", authRoutes);
app.use("/api/turnos", turnosRoutes);

app.use("/api/usuarios", authRoutes);

app.get("/", (req, res) => res.send("API funcionando"));

// Puerto configurable por entorno.
app.listen(process.env.PORT || 5000, () => {
  console.log("Servidor corriendo en puerto 5000");
});
