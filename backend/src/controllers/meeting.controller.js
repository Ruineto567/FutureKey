// src/controllers/meeting.controller.js

import Meeting from "../models/meeting.model.js";

const LIMITS = {
  starter: 1,
  pro: 3,
  agency: 10,
};

/**
 * @route   POST /api/meetings
 * @desc    Cria um novo agendamento de reunião
 * @access  Privado
 */
export async function createMeeting(req, res) {
  try {
    const { title, datetime } = req.body;

    if (!title || !datetime || isNaN(new Date(datetime))) {
      return res.status(400).json({ error: "Dados inválidos: título ou data ausente/incorreta" });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const userId = req.user._id;
    const existingCount = await Meeting.countDocuments({
      user: userId,
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const planLimit = LIMITS[req.user.plan] || LIMITS.starter;
    if (existingCount >= planLimit) {
      return res.status(403).json({ error: "Limite mensal de agendamentos atingido para seu plano" });
    }

    const meeting = await Meeting.create({
      user: userId,
      title,
      datetime,
      link: "", // pode ser preenchido futuramente
    });

    res.status(201).json({
      id: meeting._id,
      title: meeting.title,
      datetime: meeting.datetime,
      link: meeting.link || "",
      createdAt: meeting.createdAt,
    });
  } catch (e) {
    console.error("[createMeeting] error:", e);
    res.status(500).json({ error: "Erro interno ao criar agendamento" });
  }
}

/**
 * @route   GET /api/meetings
 * @desc    Lista reuniões do usuário autenticado
 * @access  Privado
 */
export async function listMeetings(req, res) {
  try {
    const docs = await Meeting.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();

    res.json(
      docs.map((m) => ({
        id: m._id,
        title: m.title,
        datetime: m.datetime,
        link: m.link || "",
        createdAt: m.createdAt,
      }))
    );
  } catch (e) {
    console.error("[listMeetings] error:", e);
    res.status(500).json({ error: "Erro ao listar reuniões" });
  }
}
