import prisma from "./prisma.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await prisma.$connect();
    console.log("✅ Conectado a PostgreSQL");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error conectando a PostgreSQL:", error);
    process.exit(1);
  }
}

start();