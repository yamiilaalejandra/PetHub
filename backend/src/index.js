import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import turnosRoutes from "./routes/turnos.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// 1. Cargar variables de entorno
dotenv.config();

const app = express();

// 2. Configurar CORS (Usando los imports modernos que ya tenías)
app.use(cors({
  origin: [
    'postgresql://postgres:iboSLhUoYjlVKaMrVVtOChvBGCRUvMjT@reseau.proxy.rlwy.net:16565/railway',                  // Para cuando pruebes en tu compu
    'https://pet-hub-sable.vercel.app'        // Tu frontend de Vercel
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 3. Middleware para leer JSON
app.use(express.json());

// 4. Rutas de tu API
app.use("/api/auth", authRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/usuarios", authRoutes); // Mantengo esta por si la usas en el login de la foto

app.get("/", (req, res) => res.send("API funcionando"));

// 5. Puerto dinámico para producción (¡Súper importante para Render/Railway!)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
