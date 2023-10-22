const express=require("express")
const CostumerControllers=require("../controllers/CostumersControllers.js")


const userRouter=express.Router()


userRouter.get('/costumer',CostumerControllers.getAll)





module.exports=userRouter
