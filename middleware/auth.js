// auth.js (ou onde está seu middleware de autenticação)
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'autenticandoMeulogin';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ mensagem: 'Token inválido.' });
    req.user = user;
    next();
  });
};
