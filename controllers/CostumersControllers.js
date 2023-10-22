const { Customer }=require("../models/Sinema.js")
const jwt = require('jsonwebtoken')



class Costumer{

async getAll(req,res){
    try{
        let users = await Customer.find({})
        return res.send(users)
    }catch(e){
        console.log(e)
        return res.status(404).send('Ошибка')
    }
}

async getOne(req,res){
    try{
        let trackId = req.params['id']
        let costumer = await Customer.findById(trackId)
        if(!costumer){
             return res.status(404).send('Такого пользователя нет')
        }else{
        return res.send(costumer)     
        }
    }catch(e){
        console.log(e)
        return res.status(404).send('Ошибка')
    }
}

async register(req, res){
    try{
        let {email, password,name} = req.body
            let exists = await User.findOne({email})
            if(exists){return res.status(404).send({error:'Пользователь с таким email уже существует'})}else{
               let user = await Customer.create({
                email,
                password,
                name
            })
            const token = jwt.sign({email:user.email, admin:user.admin, manager:user.manager}, process.env.TOKEN_SECRET, { expiresIn: '12800s' });   
            }
          
            return res.cookie('user',token, { maxAge: 900000, httpOnly: true }).send(user)
    }catch(e){
        console.log(e)
        return res.status(404).send({error:'Ошибка'})
    }
}



}
let manager = new Costumer()
module.exports = manager