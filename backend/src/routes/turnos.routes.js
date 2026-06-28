import { Router } from "express";
import { turnosController } from "../controllers/turnos.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, turnosController.crear);
router.get("/", authMiddleware, turnosController.listar);
router.get("/history", authMiddleware, turnosController.historial);
router.get("/:id", authMiddleware, turnosController.detalle);
router.put("/:id", authMiddleware, turnosController.editar);

export default router;
