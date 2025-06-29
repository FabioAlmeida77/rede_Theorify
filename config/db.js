import { Sequelize } from "sequelize";
const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:'../theorify.db'
})
sequelize.authenticate().then(() => {
  return sequelize.query("PRAGMA foreign_keys = ON");
});

export default sequelize