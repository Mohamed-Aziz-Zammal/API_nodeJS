const route=require('express').Router()
const studentModel=require('../models/student.model')
const jwt =require('jsonwebtoken')
require('dotenv').config()


route.get('/',(req,res,next)=>{
    studentModel.testcontect().then((msg)=>res.send(msg)).catch((err)=>res.send(err))
})


var privatkey =process.env.PRIVAT_KEY
verifyToken=(req,res,next)=>{
   let token= req.headers.authorization
   if(!token){
        res.status(400).json({meg:" access rejected.....!!!"})
   }

   try{
    jwt.verify(token,privatkey)
    next()

   }catch(e){
    res.status(400).json({meg:e})

   }
}

var setKey=process.env.SET_KEY
var clien=process.env.CLIEN

setKeyclien=((req,res,next)=>{
 let sk=req.params.set
 let ck =req.params.cli
 if(sk==setKey && ck==clien){
    next()
 }else{
    res.status(400).json({error:"error not setkey "})
}

})


route.post('/addstudent',verifyToken,(req,res,next)=>{
    studentModel.postnewStudent(req.body.firsName,req.body.lastName,req.body.email,req.body.age,req.body.phone)
    .then((meg)=>res.status(200).json(meg))
    .catch((err)=>res.status(400).json({error:err}))
})

route.get('/student/:set/:cli',setKeyclien,verifyToken,(req,res,next)=>{

    

        let token= req.headers.authorization
        let user=jwt.decode(token,{complete:true})
         studentModel.getAllStudent()
        .then((doc)=>res.status(200).json({student:doc,user:user}))
        .catch((err)=>res.status(400).json(err))

    

    
})

route.get('/student/:id',verifyToken,(req,res,next)=>{
    studentModel.getOneStudent(req.params.id)
    .then((meg)=>res.status(200).json(meg))
    .catch((err)=>res.status(400).json(err))
})

route.delete('/student/:id',verifyToken,(req,res,next)=>{
    studentModel.deleteOneStudent(req.params.id)
    .then((meg)=>res.status(200).json(meg))
    .catch((err)=>res.status(400).json(err))
})

route.patch('/student/:id',verifyToken,(req,res,next)=>{
    studentModel.updateOneStudent(req.params.id,req.body.firsName,req.body.lastName,req.body.email,req.body.age,req.body.phone)
    .then((meg)=>res.status(200).json(meg))
    .catch((err)=>res.status(400).json(err))
})

module.exports=route