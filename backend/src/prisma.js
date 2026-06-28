// Este archivo crea una instancia de Prisma para usar en cualquier parte del backend

// Importo el cliente de Prisma para manejar consultas a la base
import { PrismaClient } from "@prisma/client";

// Creo una única instancia que se reutiliza en todo el proyecto
const prisma = new PrismaClient();

// La exporto para usar desde controllers y servicios
export default prisma;
