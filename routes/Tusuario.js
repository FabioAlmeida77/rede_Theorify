import express from 'express';
import User from '../models/usuario.js';
import jwt from 'jsonwebtoken';

const secret = 'autenticandoMeulogin';
const router = express.Router();

router.get('/user', async (req,res)=>{
    console.log("ok")
    try {
      const users = await User.findAll({
        attributes:['id','email','name_tag','senha']
      })
      return res.json(users)
    } catch (error) {
      console.log("Erro ao selecionar usuarios:", error)
      res.status(500).send("<h1> Erro ao gerar a pagina de usuarios </h1>")
    }
})

router.get('/user/:id', async (req,res)=>{
    const{id} = req.params
    try {
      const users = await User.findByPk(id)
      return res.json(users)
    } catch (error) {
      console.log("Erro ao encontar usuario")
      res.status(500).json({mensagem:"Erro ao encontra usuario"})
    }
    
})

router.post('/user/cad', async (req, res) => {
  const { email, name_tag, senha } = req.body;
  try {
    const user = await User.create({ email, name_tag, senha });
    return res.json(user);
  } catch (error) {
    console.error("Erro ao criar usuario:", error);
    res.status(500).json({ mensagem: "Erro ao criar usuario", erro: error.message });
  }
});

router.put('/user/edit/:id', async (req,res)=>{
    const {id} = req.params
    const {email,name_tag,senha} =  req.body
    try {
      const user = await User.findByPk(id)
      if(!user){
        res.status(404).json({mensagem:"usuario não encontrado"})
      }else{
        user.email=email
        user.name_tag=name_tag
        user.senha=senha
        await user.save()
        
      }
      return res.json(user)
    } catch (error) {
      res.status(500).json({mensagem:"Error ao editar"})
    }
})

router.delete('/user/delete', async (req,res)=>{
  console.log("teste")
    try {
      const users = await User.findAll()
      if(users.length === 0){
        return res.status(404).json({mensagem:"Usuario não encontrado"})
      }else{
        
        for(const user of users){
        
        await user.destroy()          
        }
        console.log("Consegui deletar todos os users")
        return res.status(204).send();
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({error})
    }
})

router.delete('/user/delete/:id', async (req,res)=>{
    const {id} = req.params
    try {
      const user = await User.findByPk(id)
      if(user){
        await user.destroy()
        res.status(200).json({mensagem:"Excluido com sucesso"})
        
      }else{
        res.status(404).json({mensagem:"Usuario não encontrado"})
      }
    } catch (error) {
      res.status(500).json({mensagem:"Error"})
    }
})

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || user.senha !== senha) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '2h' });

    res.json({ mensagem: 'Login bem-sucedido', token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ mensagem: 'Erro ao tentar logar.' });
  }
});

export default router