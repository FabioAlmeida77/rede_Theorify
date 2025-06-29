import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./usuario.js";
import Board from "./board.js";

const Criarteoria = sequelize.define('Criarteoria', {
  nome_card: { 
    type: DataTypes.STRING,
    allowNull: false
  }, 
  foto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  video: {
    type: DataTypes.STRING,
    allowNull: true
  },
  x: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  y: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  boardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Board,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Relação com User
Criarteoria.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

User.hasMany(Criarteoria, {
  foreignKey: 'userId'
});

// Relação com Board
Criarteoria.belongsTo(Board, { 
  foreignKey: 'boardId', 
  onDelete: 'CASCADE' 
});

Board.hasMany(Criarteoria, {
  foreignKey: 'boardId'
});

export default Criarteoria;
