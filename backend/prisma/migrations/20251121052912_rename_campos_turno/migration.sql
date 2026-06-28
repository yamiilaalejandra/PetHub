/*
  Warnings:

  - You are about to drop the column `fecha` on the `Turno` table. All the data in the column will be lost.
  - You are about to drop the column `hora` on the `Turno` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_servicio` on the `Turno` table. All the data in the column will be lost.
  - Added the required column `fechaInicio` to the `Turno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaInicio` to the `Turno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoServicio` to the `Turno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Turno" DROP COLUMN "fecha",
DROP COLUMN "hora",
DROP COLUMN "tipo_servicio",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaInicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "horaInicio" TEXT NOT NULL,
ADD COLUMN     "tipoServicio" TEXT NOT NULL;
