// Controlador: recibe req/res y delega en el service

import { turnosService } from "../services/turnos.service.js";

export const turnosController = {

  async crear(req, res) {
    try {
      const id_usuario = req.user.id; // viene del middleware JWT

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
  }
};
