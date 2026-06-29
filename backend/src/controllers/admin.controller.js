import { adminService } from "../services/admin.service.js";

export const adminController = {
  async dashboard(req, res) {
    try {
      const summary = await adminService.getDashboardSummary();
      return res.json(summary);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async listarTurnos(req, res) {
    try {
      const turnos = await adminService.getAllTurnos(req.query);
      return res.json(turnos);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async detalleTurno(req, res) {
    try {
      const turno = await adminService.getTurnoById(Number(req.params.id));

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
      const turnos = await adminService.getTurnosHistory(req.query);
      return res.json(turnos);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async actualizarTurno(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const turno = await adminService.actualizarTurno(Number(id), data);
      return res.json({ message: "Turno actualizado correctamente", turno });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
};
