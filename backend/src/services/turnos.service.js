// Servicio de turnos: acá va TODA la lógica de negocio.
// Valido datos, guardo en la base, obtengo turnos, etc.

// Servicio de turnos
import prisma from "../prisma.js";

export const turnosService = {

  async crearTurno({ tipoServicio, fechaInicio, horaInicio, cantidadMascotas, id_usuario }) {

    const validos = ["guarderia", "paseo", "cuidado"];
    if (!validos.includes(tipoServicio)) {
      throw new Error("Tipo de servicio inválido");
    }

    // Validar fecha
    const fecha = new Date(fechaInicio);
    if (isNaN(fecha.getTime())) {
    throw new Error("Fecha inválida");
    }

    // Fecha pasada
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    if (fecha < hoy) {
    throw new Error("La fecha no puede ser anterior a hoy");
    }

    // Máximo 1 año
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    if (fecha > maxDate) {
    throw new Error("La fecha excede el límite permitido");
    }

    // Validar hora (HH:mm)
    if (!/^\d{2}:\d{2}$/.test(horaInicio)) {
      throw new Error("Hora inválida");
    }

    return await prisma.turno.create({
      data: {
        tipoServicio,
        fechaInicio: fecha,
        horaInicio,
        cantidadMascotas: Number(cantidadMascotas),
        id_usuario
      }
    });
  },

  async obtenerTurnos(id_usuario) {
    return prisma.turno.findMany({
      where: { id_usuario },
      orderBy: { fechaInicio: "asc" }
    });
  }
};
