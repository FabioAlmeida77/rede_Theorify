import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Line from "../models/line.js";
import Board from "../models/board.js";
import User from "../models/usuario.js";

const router = express.Router();

// 🔍 Buscar linhas de um board específico
router.get('/lines/board/:id', authenticateToken, async (req, res) => {
  try {
    const boardId = parseInt(req.params.id, 10);
    if (isNaN(boardId)) {
      return res.status(400).json({ mensagem: 'ID do board inválido.' });
    }

    console.log('🔍 [DEBUG] userId do token:', req.user.id);

    const lines = await Line.findAll({ where: { boardId } });

    console.log('📦 [DEBUG] Linhas encontradas:', lines.length);
    res.json(lines);
  } catch (error) {
    console.error('❌ Erro ao buscar linhas:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar linhas', erro: error.message });
  }
});

// 💾 Salvar (substituir) linhas de um usuário em um board
router.post('/lines/save', authenticateToken, async (req, res) => {
  try {
    const { lines, boardId } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(lines)) {
      return res.status(400).json({ mensagem: "O campo 'lines' deve ser uma lista." });
    }

    if (!boardId || isNaN(parseInt(boardId, 10))) {
      return res.status(400).json({ mensagem: "boardId é obrigatório e deve ser um número válido." });
    }

    const board = await Board.findByPk(boardId);
    if (!board) {
      return res.status(404).json({ mensagem: "Board não encontrado." });
    }

    console.log(`📤 [DEBUG] Substituindo linhas do user ${userId} para board ${boardId}`);

    // Excluir linhas anteriores do usuário no board
    await Line.destroy({ where: { userId, boardId } });

    // Criar novas linhas
    const createdLines = await Promise.all(
      lines.map(line => Line.create({ ...line, userId, boardId }))
    );

    console.log('✅ Linhas salvas com sucesso.');
    res.status(201).json({ mensagem: 'Linhas salvas com sucesso', createdLines });

  } catch (error) {
    console.error('❌ Erro ao salvar linhas:', error);
    res.status(500).json({ mensagem: 'Erro ao salvar linhas', erro: error.message });
  }
});

export default router;
