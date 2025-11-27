import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha sao obrigatorios" });
    }

    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ message: "Senha deve ter no minimo 6 caracteres" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email ja cadastrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, plan: "free" });

    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (e) {
    console.error("Erro no registro:", e);
    res.status(500).json({ message: "Falha no registro", error: e.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha sao obrigatorios" });
    }

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ message: "Credenciais invalidas" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciais invalidas" });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (e) {
    console.error("Erro no login:", e);
    res.status(500).json({ message: "Erro no login", error: e.message });
  }
}

export async function getUserByEmail(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email e obrigatorio" });
    }

    const user = await User.findOne({ email }).select("email plan createdAt updatedAt");
    if (!user) {
      return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    res.json({ user });
  } catch (e) {
    console.error("Erro ao buscar usuario:", e);
    res.status(500).json({ message: "Erro ao buscar usuario", error: e.message });
  }
}
