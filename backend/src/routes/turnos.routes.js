import { Router } from "express";
import { turnosController } from "../controllers/turnos.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, turnosController.crear);
router.get("/", authMiddleware, turnosController.listar);

export default router;
