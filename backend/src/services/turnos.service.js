// Servicio de turnos: acá va TODA la lógica de negocio.
// Valido datos, guardo en la base, obtengo turnos, etc.

import prisma from "../prisma.js";

const MAX_MONTHS_AHEAD = 12;
const SERVICE_KEYS = ["guarderia", "paseo", "cuidado"];

function parseFecha(fechaInicio) {
  const fecha = new Date(fechaInicio);
  if (Number.isNaN(fecha.getTime())) {
    throw new Error("Fecha inválida");
  }
  return fecha;
}

function validarFechaNoPasada(fecha) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fecha < hoy) {
    throw new Error("La fecha no puede ser anterior a hoy");
  }

  const limite = new Date();
  limite.setMonth(limite.getMonth() + MAX_MONTHS_AHEAD);
  if (fecha > limite) {
    throw new Error("La fecha excede el límite permitido");
  }
}

function validarHora(horaInicio) {
  if (!/^\d{2}:\d{2}$/.test(horaInicio)) {
    throw new Error("Hora inválida");
  }
}

function obtenerOrderBy(order) {
  const direccion = order?.toLowerCase() === "asc" ? "asc" : "desc";
  return [
    { fechaInicio: direccion },
    { horaInicio: direccion }
  ];
}

export const turnosService = {
  async crearTurno({ tipoServicio, fechaInicio, horaInicio, cantidadMascotas, id_usuario }) {
    if (!SERVICE_KEYS.includes(tipoServicio)) {
      throw new Error("Tipo de servicio inválido");
    }

    const fecha = parseFecha(fechaInicio);
    validarFechaNoPasada(fecha);
    validarHora(horaInicio);

    if (!cantidadMascotas || Number(cantidadMascotas) < 1) {
      throw new Error("La cantidad de mascotas debe ser al menos 1");
    }

    const servicio = await prisma.servicio.findUnique({
      where: { clave: tipoServicio }
    });

    const profesional = await prisma.profesional.findFirst();
    const sucursal = await prisma.sucursal.findFirst();

    return await prisma.turno.create({
      data: {
        tipoServicio,
        fechaInicio: fecha,
        horaInicio,
        cantidadMascotas: Number(cantidadMascotas),
        id_usuario,
        servicioId: servicio?.id,
        profesionalId: profesional?.id,
        sucursalId: sucursal?.id,
        observaciones: null
      }
    });
  },

  async obtenerTurnos(id_usuario) {
    return prisma.turno.findMany({
      where: { id_usuario },
      orderBy: [{ fechaInicio: "asc" }, { horaInicio: "asc" }],
      include: {
        servicio: true,
        profesional: true,
        sucursal: true,
        mascota: true
      }
    });
  },

  async obtenerTurnoPorId(id_usuario, id) {
    return prisma.turno.findFirst({
      where: { id, id_usuario },
      include: {
        usuario: true,
        mascota: true,
        servicio: true,
        profesional: true,
        sucursal: true
      }
    });
  },

  async obtenerHistorial(id_usuario, filters) {
    const where = { id_usuario: id_usuario };

    if (filters.mascota) {
      where.mascota = {
        nombre: {
          contains: String(filters.mascota),
          mode: "insensitive"
        }
      };
    }

    if (filters.estado) {
      const estadoUpper = String(filters.estado).toUpperCase();
      where.estado = estadoUpper;
    }

    if (filters.servicio) {
      where.servicio = {
        OR: [
          { clave: String(filters.servicio).toLowerCase() },
          { nombre: { contains: String(filters.servicio), mode: "insensitive" } }
        ]
      };
    }

    return prisma.turno.findMany({
      where,
      orderBy: obtenerOrderBy(filters.order),
      include: {
        mascota: true,
        servicio: true,
        profesional: true,
        sucursal: true
      }
    });
  },

  async actualizarTurno(id_usuario, id, { fechaInicio, horaInicio, tipoServicio, observaciones }) {
    const turno = await prisma.turno.findFirst({
      where: { id, id_usuario }
    });

    if (!turno) {
      throw new Error("Turno no encontrado");
    }

    if (!fechaInicio || !horaInicio || !tipoServicio) {
      throw new Error("Fecha, hora y servicio son obligatorios");
    }

    validarHora(horaInicio);
    const fecha = parseFecha(fechaInicio);
    validarFechaNoPasada(fecha);

    const servicio = await prisma.servicio.findUnique({
      where: { clave: tipoServicio }
    });

    if (!servicio) {
      throw new Error("Servicio inválido");
    }

    const conflicto = await prisma.turno.findFirst({
      where: {
        id: { not: id },
        id_usuario,
        fechaInicio: fecha,
        horaInicio
      }
    });

    if (conflicto) {
      throw new Error("Ya existe otro turno en ese horario");
    }

    return prisma.turno.update({
      where: { id },
      data: {
        fechaInicio: fecha,
        horaInicio,
        tipoServicio,
        observaciones,
        servicioId: servicio.id,
        estado: turno.estado
      },
      include: {
        usuario: true,
        mascota: true,
        servicio: true,
        profesional: true,
        sucursal: true
      }
    });
  }
};
