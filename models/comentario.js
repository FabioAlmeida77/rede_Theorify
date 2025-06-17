import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./usuario.js";
import Board from "./board.js";

const Comentario = sequelize.define('Comentario', {
  conteudo: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  
  
  boardId: { // ← ADICIONE ESTE BLOCO
     type: DataTypes.INTEGER,
     allowNull: false,
     references: {
       model: 'boards', // ou 'boards' dependendo de como sua tabela está no banco
       key: 'id'
     }
   }
 }, {
  timestamps: true
});

Comentario.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

User.hasMany(Comentario, {
  foreignKey: 'userId'
});

Comentario.belongsTo(Board, { foreignKey: 'boardId', onDelete: 'CASCADE' });

Board.hasMany(Comentario, {
  foreignKey: 'boardId'
});

export default Comentario;