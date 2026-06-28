// Controlador = Se encarga de recibir la request y devolver la response.
// La lógica pesada está en los services, acá sólo gestiono el flujo.

import { authService } from "../services/auth.service.js";

export const authController = {

  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json({
        message: "Usuario registrado correctamente"
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

};
