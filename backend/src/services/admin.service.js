import prisma from "../prisma.js";

function obtenerOrderBy(order) {
  const direccion = order?.toLowerCase() === "asc" ? "asc" : "desc";
  return [{ fechaInicio: direccion }, { horaInicio: direccion }];
}

export const adminService = {
  async getDashboardSummary() {
    const [totalTurnos, turnosPendientes, turnosConfirmados, turnosCancelados, usuariosRegistrados, ultimosTurnos] = await Promise.all([
      prisma.turno.count(),
      prisma.turno.count({ where: { estado: "PENDIENTE" } }),
      prisma.turno.count({ where: { estado: "CONFIRMADO" } }),
      prisma.turno.count({ where: { estado: "CANCELADO" } }),
      prisma.usuario.count(),
      prisma.turno.findMany({
        take: 8,
        orderBy: [{ createdAt: "desc" }],
        include: {
          usuario: true,
          mascota: true,
          servicio: true,
          profesional: true
        }
      })
    ]);

    return {
      totalTurnos,
      turnosPendientes,
      turnosConfirmados,
      turnosCancelados,
      usuariosRegistrados,
      ultimosTurnos
    };
  },

  async getAllTurnos(filters = {}) {
    const where = {};

    if (filters.estado) {
      where.estado = String(filters.estado).toUpperCase();
    }

    if (filters.mascota) {
      where.mascota = {
        nombre: {
          contains: String(filters.mascota),
          mode: "insensitive"
        }
      };
    }

    if (filters.usuario) {
      where.usuario = {
        OR: [
          { nombre: { contains: String(filters.usuario), mode: "insensitive" } },
          { apellido: { contains: String(filters.usuario), mode: "insensitive" } },
          { correo: { contains: String(filters.usuario), mode: "insensitive" } }
        ]
      };
    }

    if (filters.fecha) {
      const fecha = new Date(String(filters.fecha));
      if (!Number.isNaN(fecha.getTime())) {
        const inicio = new Date(fecha);
        inicio.setHours(0, 0, 0, 0);
        const fin = new Date(fecha);
        fin.setHours(23, 59, 59, 999);
        where.fechaInicio = { gte: inicio, lte: fin };
      }
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
        usuario: true,
        mascota: true,
        servicio: true,
        profesional: true,
        sucursal: true
      }
    });
  },

  async getTurnoById(id) {
    return prisma.turno.findUnique({
      where: { id },
      include: {
        usuario: true,
        mascota: true,
        servicio: true,
        profesional: true,
        sucursal: true
      }
    });
  },

  async getTurnosHistory(filters = {}) {
    return this.getAllTurnos(filters);
  }
};
