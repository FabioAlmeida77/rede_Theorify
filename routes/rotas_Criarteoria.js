import express from 'express';
import Criarteoria from '../models/criarteoria.js';
import User from '../models/usuario.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();


router.get('/teorias', async (req, res) => {
  try {
    const teorias = await Criarteoria.findAll({
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

router.post('/teorias/cad', authenticateToken, async (req, res) => {
  const { nome_card, foto, video } = req.body;
  const userId = req.user.id;

  try {
    const teoria = await Criarteoria.create({ nome_card, foto, video, userId });
    res.status(201).json(teoria);
  } catch (error) {
    console.error("Erro ao criar teoria:", error);
    res.status(500).json({ mensagem: "Erro ao criar teoria", erro: error.message });
  }
});

router.put('/teorias/edit/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { nome_card, foto, video } = req.body;
  const userId = req.user.id;

  try {
    const teoria = await Criarteoria.findByPk(id);
    if (!teoria) return res.status(404).json({ mensagem: "Teoria não encontrada" });

    if (teoria.userId !== userId) {
      return res.status(403).json({ mensagem: "Acesso negado: você não é o autor dessa teoria" });
    }

    teoria.nome_card = nome_card;
    teoria.foto = foto;
    teoria.video = video;
    await teoria.save();

    res.json(teoria);
  } catch (error) {
    console.error("Erro ao editar teoria:", error);
    res.status(500).json({ mensagem: "Erro ao editar teoria" });
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
    res.status(200).json({ mensagem: "Teoria deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar teoria:", error);
    res.status(500).json({ mensagem: "Erro ao deletar teoria" });
  }
});

export default router;