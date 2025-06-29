import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./usuario.js";
import Criarteoria from "./criarteoria.js";
import Board from "./board.js";

const Line = sequelize.define('Line', {
  startCardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Criarteoria,
      key: 'id'
    }
  },
  endCardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Criarteoria,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Relacionamento com User
Line.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

User.hasMany(Line, {
  foreignKey: 'userId'
});

// Relacionamento com Board
Line.belongsTo(Board, {
  foreignKey: {
    name: 'boardId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Board.hasMany(Line, {
  foreignKey: 'boardId'
});

// Relacionamentos com Criarteoria
Line.belongsTo(Criarteoria, {
  foreignKey: 'startCardId',
  onDelete: 'CASCADE'
});

Line.belongsTo(Criarteoria, {
  foreignKey: 'endCardId',
  onDelete: 'CASCADE'
});

export default Line;
