import jwt from 'jsonwebtoken';

const secret = 'autenticandoMeulogin';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ mensagem: 'Token inválido.' });
    req.user = user;
    next();
  });
};