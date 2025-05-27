import { Sequelize } from "sequelize";
const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:'../theorify.db'
})
sequelize.authenticate()
        .then(()=> console.log("Conexão estabelecida com sucesso."))
        .catch(err=> console.log("Não foi possivel conectar ao banco", err))

export default sequelize