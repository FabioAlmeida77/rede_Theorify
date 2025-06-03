import express from 'express';
import session from 'express-session';
import cors from 'cors';
import routerUser from './routes/Tusuario.js';
import comentarioRoutes from './routes/rotas_comentario.js';
import teoriaRoutes from './routes/rotas_Criarteoria.js';

import sequelize from './config/db.js';
import User from './models/usuario.js';


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(session({
  secret: 'turma-88417',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(comentarioRoutes);
app.use(routerUser);
app.use(teoriaRoutes);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tabelas sincronizadas com sucesso.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar tabelas:', err);
  });
