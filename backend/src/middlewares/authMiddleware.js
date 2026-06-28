// Middleware que verifica si el token enviado por el usuario es válido.
// Si no hay token o está mal, NO puede acceder a rutas privadas.

import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardo user en la req para usarlo después
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}
