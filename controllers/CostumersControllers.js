const { Customer }=require("../models/Sinema.js")
require("dotenv").config()
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
        let userid = req.params['id']
        let costumer = await Customer.findById(userid)
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
        let { email , password , name } = req.body
        // console.log({email,password,name},req.body);
           let exists = await Customer.findOne({email})
           if(exists){
               return res.status(404).send({error:'Пользователь с таким email уже существует'})}else{
         let user = await Customer.create({
                email,
                password,
                name
            })
            //  console.log(user);
            const token = jwt.sign({email:user.email, password:user.password, name:user.name}, process.env.TOKEN_SECRET, { expiresIn: '12800s' }); 
            user.token=token  
            return res.send({user,token})
           }
    }catch(e){
        console.log(e)
        return res.status(404).send({error:'Ошибка'})
    }
}
async login(req,res){
    try{
        let {email, password} = req.body
        let user = await Customer.findOne({email})
        if(!user)
            return res.status(401).send({error:'Такого пользователя не существует'})
        if(user.password==password){
            const token = jwt.sign({email:user.email, name:user.name}, process.env.TOKEN_SECRET, { expiresIn: '12800s' });
            return res.send({user,token})
        }else{
            return res.status(404).send({error:'Неверный пароль'})
        }
    }catch(e){
        return res.status(404).send({error:'Неверный пароль'})
    }
}

async delete(req,res){
    try {    
        let order = await Customer.findOne({email:req.user.email})
        if(!order)
            return res.status(404).send('Такого пользователя нет')
        if(req.user.email==order.email || req.user.admin){
            let result = await User.deleteOne({email:req.user.email})
            // console.log(res)
            return res.send('Успешно удалено')
        }else{
            return res.status(404).send('Вы не можете удалить этого пользователя')
        }
       
    } catch (error) {
        console.log(error)
        return res.status(404).send(error)
    }
}
async updatesuperadmin(req, res){
        try {
          const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
          res.send(customer);
        } catch (error) {
          res.status(500).send(error);
        }
   
}
}
let manager = new Costumer()
module.exports = manager