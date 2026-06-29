import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/dashboard", authMiddleware, requireAdmin, adminController.dashboard);
router.get("/turnos", authMiddleware, requireAdmin, adminController.listarTurnos);
router.get("/turnos/history", authMiddleware, requireAdmin, adminController.historial);
router.get("/turnos/:id", authMiddleware, requireAdmin, adminController.detalleTurno);

export default router;
