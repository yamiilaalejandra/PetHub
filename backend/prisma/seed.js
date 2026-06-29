import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.servicio.createMany({
    skipDuplicates: true,
    data: [
      { nombre: "Guardería Canina", clave: "guarderia", descripcion: "Cuidado integral de día para tu mascota." },
      { nombre: "Paseo Canino", clave: "paseo", descripcion: "Paseos seguros y personalizados." },
      { nombre: "Cuidado e Higiene", clave: "cuidado", descripcion: "Baños, cepillado y cuidado básico." }
    ]
  });

  await prisma.profesional.createMany({
    skipDuplicates: true,
    data: [
      { nombre: "Agustina Marquez", especialidad: "Guardería y ejercicios" },
      { nombre: "Lucía González", especialidad: "Paseos y socialización" },
      { nombre: "Camila Torres", especialidad: "Cuidado e higiene" }
    ]
  });

  await prisma.sucursal.createMany({
    skipDuplicates: true,
    data: [
      { nombre: "Sucursal Centro", direccion: "Av. Principal 123", ciudad: "Ciudad" },
      { nombre: "Sucursal Norte", direccion: "Calle Norte 45", ciudad: "Ciudad" },
      { nombre: "Sucursal Sur", direccion: "Boulevard Sur 89", ciudad: "Ciudad" }
    ]
  });

  const existingAdmin = await prisma.usuario.findFirst({
    where: { role: "ADMIN" }
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin123*", 10);
    await prisma.usuario.create({
      data: {
        nombre: "Admin",
        apellido: "PetHub",
        correo: "admin@pethub.com",
        password_hash: passwordHash,
        role: "ADMIN"
      }
    });
  }

  const existingDemo = await prisma.usuario.findUnique({
    where: { correo: "demo@pethub.com" }
  });

  if (!existingDemo) {
    const passwordHash = await bcrypt.hash("PetHub123", 10);
    await prisma.usuario.create({
      data: {
        nombre: "Demo",
        apellido: "Usuario",
        correo: "demo@pethub.com",
        password_hash: passwordHash
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
