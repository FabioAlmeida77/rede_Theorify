import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./usuario.js";

const Criarteoria = sequelize.define('Criarteoria',{
    nome_card:{ 
    type:DataTypes.STRING,
    allowNull:false
  }, 
    foto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  video: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
})

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

export default Criarteoria