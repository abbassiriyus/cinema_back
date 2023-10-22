const express=require("express")
const CostumerControllers=require("../controllers/CostumersControllers.js")


const userRouter=express.Router()


userRouter.get('/costumer',CostumerControllers.getAll)
userRouter.post('/register',CostumerControllers.register)
userRouter.get('/costumer/:id',CostumerControllers.getOne)
userRouter.post('/login',CostumerControllers.login)
userRouter.delete('/costumer',CostumerControllers.delete)
userRouter.patch('/costumer',CostumerControllers.updatesuperadmin)

module.exports=userRouter
