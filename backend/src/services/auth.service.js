// Servicio dedicado a manejar toda la lógica de usuarios.
// Acá NO manejo req/res, solamente reglas de negocio.

import prisma from "../prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authService = {
  
  // Registro de usuario
  async register({ nombre, apellido, correo, password }) {

    // Verifico si ya existe un usuario con ese correo
    const userExists = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (userExists) {
      throw new Error("El correo ya está registrado");
    }

    // Encripto la contraseña antes de guardarla
    const hashed = await bcrypt.hash(password, 10);

    // Guardo el usuario en la base
    const user = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        correo,
        password_hash: hashed 
      }
    });

    return user;
  },

  // Login
  async login({ correo, password }) {

    // Busco el usuario en la base
    const user = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (!user) {
      throw new Error("Credenciales incorrectas");
    }

    // Comparo contraseñas contra password_hash
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      throw new Error("Credenciales incorrectas");
    }

    // Genero token
    const token = jwt.sign(
      { id: user.id, correo: user.correo },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token, user };
  }
};
