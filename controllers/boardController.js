import Board from '../models/board.js';
import User from '../models/usuario.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth.js';

const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (error) {
    console.error('Token inválido:', error);
    return null;
  }
};

// Middleware opcional: extrair userId do token
export const getAllBoards = async (req, res) => {
  try {
    const boards = await Board.findAll({
      include: {
        model: User,
        attributes: ['name_tag'] // mostra o name_tag do criador
      }
    });
    res.json(boards);
  } catch (err) {
    console.error('Erro ao buscar boards públicos:', err);
    res.status(500).json({ error: 'Erro ao buscar boards públicos' });
  }
};

// POST /boards/create
export const createBoard = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { title } = req.body;

    console.log("Token userId:", userId);
    console.log("Título recebido:", title);

    if (!title) return res.status(400).json({ message: 'Título é obrigatório' });

    const board = await Board.create({ title, userId });

    console.log("Board criado com sucesso:", board);

    res.status(201).json(board);
  } catch (err) {
    console.error("Erro ao criar board:", err);
    res.status(500).json({ message: 'Erro ao criar o board', error: err.message });
  }
};

// GET /boards
export const getBoardsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const boards = await Board.findAll({
      where: { userId }
    });
    res.json(boards);
  } catch (err) {
    console.error('Erro ao buscar boards do usuário:', err);
    res.status(500).json({ message: 'Erro ao buscar os boards', error: err.message });
  }
};

// GET /boards/:id
export const getBoardById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const board = await Board.findOne({
      where: { id, userId }
    });

    if (!board) {
      return res.status(404).json({ message: 'Board não encontrado' });
    }

    res.json(board);
  } catch (err) {
    console.error('Erro ao buscar board por ID:', err);
    res.status(500).json({ message: 'Erro ao buscar o board', error: err.message });
  }
};