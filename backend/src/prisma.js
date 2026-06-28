// Este archivo crea una instancia de Prisma para usar en cualquier parte del backend

// Importo el cliente de Prisma para manejar consultas a la base
import { PrismaClient } from "@prisma/client";

// Uso la configuración de datasource desde prisma/schema.prisma
const prisma = new PrismaClient();

export default prisma;
