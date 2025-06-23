import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./usuario.js";

const Board = sequelize.define('Board', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  },

  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

Board.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

User.hasMany(Board, {
  foreignKey: 'userId',
});

export default Board;