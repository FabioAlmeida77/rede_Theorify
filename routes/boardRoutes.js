import express from 'express';
import { getAllBoards, createBoard, getBoardsByUser, getBoardById, deleteBoard, editarBoard } from '../controllers/boardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();


router.get('/public', getAllBoards)    
router.use(authenticateToken);                  //GET /boards/all
router.post('/create', createBoard);       // POST /boards/create
router.get('/', getBoardsByUser);          // GET /boards
router.get('/:id', getBoardById);          // GET /boards/:id
router.delete('/delete/:id', authenticateToken, deleteBoard)
router.put('/edit/:id', authenticateToken, editarBoard);

export default router;
