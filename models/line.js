import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./usuario.js";
import Criarteoria from "./criarteoria.js";

const Line = sequelize.define('Line', {
    startCardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Criarteoria,
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      endCardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Criarteoria,
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
    }, {
      timestamps: true
    });
    
    // Para relacionar a linha ao usuário (autor das conexões)
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

export default Line