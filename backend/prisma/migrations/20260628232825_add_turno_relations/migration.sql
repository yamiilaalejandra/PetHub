-- CreateEnum
CREATE TYPE "EstadoTurno" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'COMPLETADO', 'CANCELADO');

-- AlterTable
ALTER TABLE "Turno" ADD COLUMN     "estado" "EstadoTurno" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "mascotaId" INTEGER,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "profesionalId" INTEGER,
ADD COLUMN     "servicioId" INTEGER,
ADD COLUMN     "sucursalId" INTEGER;

-- CreateTable
CREATE TABLE "Mascota" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" TEXT,
    "raza" TEXT,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profesional" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "especialidad" TEXT,

    CONSTRAINT "Profesional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sucursal" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "ciudad" TEXT,

    CONSTRAINT "Sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mascota_usuarioId_idx" ON "Mascota"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Servicio_clave_key" ON "Servicio"("clave");

-- CreateIndex
CREATE INDEX "Turno_id_usuario_idx" ON "Turno"("id_usuario");

-- CreateIndex
CREATE INDEX "Turno_fechaInicio_idx" ON "Turno"("fechaInicio");

-- CreateIndex
CREATE INDEX "Turno_servicioId_idx" ON "Turno"("servicioId");

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_mascotaId_fkey" FOREIGN KEY ("mascotaId") REFERENCES "Mascota"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
