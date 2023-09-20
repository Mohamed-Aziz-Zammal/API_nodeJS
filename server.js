const express=require('express')
const studentRoute=require('./routers/student.route')
const userRoute=require('./routers/user.route')
const app=express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin',"*")
    res.setHeader('Access-Control-Request-Method',"*")
    res.setHeader('Access-Control-Request-Headers',"*")
    next()
})

app.use('/',studentRoute)
app.use('/',userRoute)




app.listen(3000,()=>console.log('server run'))