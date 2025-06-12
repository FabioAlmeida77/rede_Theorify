import express from 'express';
import Criarteoria from '../models/criarteoria.js';
import User from '../models/usuario.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import Board from '../models/board.js';

const router = express.Router();


router.get('/teorias/board/:id', authenticateToken, async (req, res) => {
  try {
    const boardId = parseInt(req.params.id, 10);

    const teorias = await Criarteoria.findAll({
      where: {
        userId: req.user.id,
        boardId: boardId  // 👈 agora sim, boardId corretamente usado
      },
      attributes: ['id', 'nome_card', 'foto', 'video', 'x', 'y', 'createdAt', 'updatedAt'],
      include: {
        model: User,
        attributes: ['id', 'email', 'name_tag']
      }
    });

    res.json(teorias);
  } catch (error) {
    console.error("Erro ao buscar teorias:", error);
    res.status(500).json({ mensagem: "Erro ao buscar teorias" });
  }
});



router.get('/teorias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const teoria = await Criarteoria.findByPk(id, {
      include: {
        model: User,
        attributes: ['id', 'email', 'name_tag']
      }
    });
    if (!teoria) return res.status(404).json({ mensagem: "Teoria não encontrada" });

    res.json(teoria);
  } catch (error) {
    console.error("Erro ao buscar teoria:", error);
    res.status(500).json({ mensagem: "Erro ao buscar teoria" });
  }
});

router.post('/teorias/cad', authenticateToken, upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  const userId = req.user.id;

  // ⚠️ Conversão e validação
  const boardId = parseInt(req.body.boardId, 10);
  const { nome_card, x = 0, y = 0 } = req.body;

  if (!boardId || isNaN(boardId)) {
    return res.status(400).json({ mensagem: "boardId é obrigatório e deve ser um número válido" });
  }

  // 📌 Verifica se o board existe
  const board = await Board.findByPk(boardId);
  if (!board) {
    return res.status(404).json({ mensagem: "Board não encontrado" });
  }

  const foto = req.files['foto'] ? req.files['foto'][0].path : null;
  const video = req.files['video'] ? req.files['video'][0].path : null;

  try {
    const teoria = await Criarteoria.create({
      nome_card,
      foto,
      video,
      x,
      y,
      userId,
      boardId
    });

    res.status(201).json(teoria);
  } catch (error) {
    console.error("❌ Erro ao criar teoria:", error);
    res.status(500).json({ mensagem: "Erro ao criar teoria", erro: error.message });
  }
});



router.put('/teorias/edit/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { nome_card, foto, video, x, y } = req.body;
  const userId = req.user.id;

  try {
    const teoria = await Criarteoria.findByPk(id);
    if (!teoria) return res.status(404).json({ mensagem: "Teoria não encontrada" });

    if (teoria.userId !== userId) {
      return res.status(403).json({ mensagem: "Acesso negado: você não é o autor dessa teoria" });
    }

    teoria.nome_card = nome_card !== undefined ? nome_card : teoria.nome_card;
    teoria.foto = foto !== undefined ? foto : teoria.foto;
    teoria.video = video !== undefined ? video : teoria.video;
    teoria.x = x !== undefined ? x : teoria.x;
    teoria.y = y !== undefined ? y : teoria.y;

    await teoria.save();

    res.json(teoria);
  } catch (error) {
    console.error("Erro ao editar teoria:", error);
    res.status(500).json({ mensagem: "Erro ao editar teoria", erro: error.message });
  }
});

router.delete('/teorias/delete/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const teoria = await Criarteoria.findByPk(id);
    if (!teoria) return res.status(404).json({ mensagem: "Teoria não encontrada" });

    if (teoria.userId !== userId) {
      return res.status(403).json({ mensagem: "Acesso negado: você não é o autor dessa teoria" });
    }

    

    await teoria.destroy();
    res.status(200).json({ 
      mensagem: "Teoria deletada com sucesso",
      idDeletado: id
    });
  } catch (error) {
    console.error("Erro ao deletar teoria:", error);
    res.status(500).json({ mensagem: "Erro ao deletar teoria", erro: error.message });
  }
});

export default router;