// Controlador: recibe req/res y delega en el service

import { turnosService } from "../services/turnos.service.js";

export const turnosController = {

  async crear(req, res) {
    try {
      const id_usuario = req.user.id;
      const turno = await turnosService.crearTurno({
        ...req.body,
        id_usuario
      });

      return res.status(201).json({
        message: "Turno creado exitosamente",
        turno
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async listar(req, res) {
    try {
      const id_usuario = req.user.id;
      const turnos = await turnosService.obtenerTurnos(id_usuario);
      return res.json(turnos);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async detalle(req, res) {
    try {
      const id_usuario = req.user.id;
      const { id } = req.params;

      const turno = await turnosService.obtenerTurnoPorId(id_usuario, Number(id));

      if (!turno) {
        return res.status(404).json({ message: "Turno no encontrado" });
      }

      return res.json(turno);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async historial(req, res) {
    try {
      const id_usuario = req.user.id;
      const { mascota, estado, servicio, order = "desc" } = req.query;

      const turnos = await turnosService.obtenerHistorial(id_usuario, {
        mascota,
        estado,
        servicio,
        order,
      });

      return res.json(turnos);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async editar(req, res) {
    try {
      const id_usuario = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      const turno = await turnosService.actualizarTurno(
        id_usuario,
        Number(id),
        updateData
      );

      return res.json({ message: "Turno actualizado correctamente", turno });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
};
