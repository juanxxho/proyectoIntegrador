const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const axios = require("axios");

exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  console.log("Rol recibido en backend:", role);

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Por favor, ingresa todos los campos." });
  }

  const rolesValidos = [
    "administrador",
    "jefe de brigada",
    "botanico",
    "auxiliar",
    "coinvestigador",
  ];
  if (!rolesValidos.includes(role)) {
    return res.status(400).json({ message: "Rol no válido." });
  }

  try {
    let id_ideam = null;

    // Validar contra el microservicio solo si NO es administrador
    if (role !== "administrador") {
      const response = await axios.get(
        `http://gateway/brigadas/experto/correo/${encodeURIComponent(email)}`
      );

      if (!response.data || response.data.rol !== role) {
        return res.status(400).json({
          message:
            "El correo no está asociado con un experto o el rol no coincide.",
        });
      }

      id_ideam = response.data.id; // 👈 acá extraés el ID del experto
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario con id_ideam
    await userModel.createUser(email, hashedPassword, role, id_ideam);

    return res
      .status(201)
      .json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al procesar la solicitud." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, ingresa ambos campos." });
  }

  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role === "jefe_brigada" ? "jefe de brigada" : user.role,
        id_ideam: user.id_ideam, // 👈 esto lo mete en el token
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al procesar la solicitud." });
  }
};
