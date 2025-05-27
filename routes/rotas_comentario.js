import express from 'express';
import Comentario from '../models/comentario.js';
import User from '../models/usuario.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/comentario', async (req, res) => {
  try {
    const comentarios = await Comentario.findAll({
      include: {
        model: User,
        attributes: ['id', 'name_tag', 'email'],
      }
    });
    res.json(comentarios);
  } catch (error) {
    console.log("Erro ao buscar comentários:", error);
    res.status(500).json({ mensagem: "Erro ao buscar comentários" });
  }
});

router.get('/comentario/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const comentario = await Comentario.findByPk(id, {
      include: {
        model: User,
        attributes: ['id', 'name_tag', 'email'],
      }
    });
    if (!comentario) {
      return res.status(404).json({ mensagem: "Comentário não encontrado" });
    }
    res.json(comentario);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar comentário" });
  }
});

router.post('/comentario/cad', authenticateToken, async (req, res) => {
  const { conteudo } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ mensagem: "Usuário não encontrado" });
    }

    const novoComentario = await Comentario.create({ conteudo, userId });
    res.status(201).json(novoComentario);
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    res.status(500).json({ mensagem: "Erro ao criar comentário" });
  }
});

router.put('/comentario/edit/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { conteudo } = req.body;
  const userId = req.user.id;

  try {
    const comentario = await Comentario.findByPk(id);

    if (!comentario) {
      return res.status(404).json({ mensagem: "Comentário não encontrado" });
    }

    if (comentario.userId !== userId) {
      return res.status(403).json({ mensagem: "Você não tem permissão para editar este comentário." });
    }

    comentario.conteudo = conteudo;
    await comentario.save();

    res.json(comentario);
  } catch (error) {
    console.log("Erro ao editar comentário:", error);
    res.status(500).json({ mensagem: "Erro ao editar comentário" });
  }
});

router.delete('/comentario/delete/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const comentario = await Comentario.findByPk(id);

    if (!comentario) {
      return res.status(404).json({ mensagem: "Comentário não encontrado" });
    }

    if (comentario.userId !== userId) {
      return res.status(403).json({ mensagem: "Você não tem permissão para excluir este comentário." });
    }

    await comentario.destroy();
    res.status(200).json({ mensagem: "Comentário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao excluir comentário" });
  }
});

export default router;