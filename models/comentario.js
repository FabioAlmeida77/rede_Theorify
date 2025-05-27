import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./usuario.js";

const Comentario = sequelize.define('Comentario', {
  conteudo: {
    type: DataTypes.STRING,
    allowNull: false,
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

export default Comentario;