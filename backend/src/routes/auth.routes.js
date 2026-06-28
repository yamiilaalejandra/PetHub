// Archivo que define las rutas /api/usuarios/*
// Cada ruta está conectada a un método del controlador.

import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/registro", authController.register);
router.post("/login", authController.login);

export default router;
