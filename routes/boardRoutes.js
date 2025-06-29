import express from 'express';
import { getAllBoards, createBoard, getBoardsByUser, getBoardById, deleteBoard } from '../controllers/boardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();


router.get('/public', getAllBoards)    
router.use(authenticateToken);                  //GET /boards/all
router.post('/create', createBoard);       // POST /boards/create
router.get('/', getBoardsByUser);          // GET /boards
router.get('/:id', getBoardById);          // GET /boards/:id
router.delete('/delete/:id', deleteBoard)

export default router;
