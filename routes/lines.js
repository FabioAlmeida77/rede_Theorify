import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Line from "../models/line.js";

const router = express.Router();

// Buscar linhas
router.get('/lines', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 [DEBUG] userId do token:', req.user.id);

    const lines = await Line.findAll({ where: { userId: req.user.id } });

    console.log('📦 [DEBUG] Linhas encontradas:', lines.length, lines);

    res.json(lines);
  } catch (error) {
    console.error('❌ Erro ao buscar linhas:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar linhas' });
  }
});

// Salvar (substituir) linhas do usuário
router.post('/lines/save', authenticateToken, async (req, res) => {
  const { lines } = req.body; // Ex: [{ startCardId, endCardId }]
  const userId = req.user.id;

  try {
    console.log('📤 [DEBUG] Substituindo linhas para userId:', userId, 'com:', lines);

    await Line.destroy({ where: { userId } });

    const createdLines = await Promise.all(
      lines.map(line => Line.create({ ...line, userId }))
    );

    console.log('✅ Linhas salvas:', createdLines);
    res.status(201).json({ mensagem: 'Linhas salvas com sucesso', createdLines });
  } catch (error) {
    console.error('❌ Erro ao salvar linhas:', error);
    res.status(500).json({ mensagem: 'Erro ao salvar linhas', erro: error.message });
  }
});

export default router;
