const mongoose = require('mongoose')
const bcrypt=require('bcrypt')
const jwt =require('jsonwebtoken')
require('dotenv').config()

var SchemaUser=mongoose.Schema({
    userName:String,
    email:String,
    pwd:String,
    
})
var url =process.env.URL
var User =mongoose.model('user',SchemaUser)

exports.register=(userName,email,pwd)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
           return User.findOne({email:email})
        }).then((doc)=>{
            if(doc){
                mongoose.disconnect()
                reject('this email is exist')
            }else{
                bcrypt.hash(pwd,10).then((hashpwd)=>{
                    let user =new User({
                        userName:userName,
                        email:email,
                        pwd:hashpwd
                    })
                    user.save().then((doc)=>{
                        mongoose.disconnect()
                        resolve(doc)
                    }).catch((err)=>{
                        mongoose.disconnect()
                        reject(err)
                    })
                }).catch((err)=>{
                    mongoose.disconnect()
                        reject(err)
                })
            }
        })
    })
}
var privatkey =process.env.PRIVAT_KEY
exports.login=(email,pwd)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>{
            return User.findOne({email:email})
        }).then((user)=>{
            if(!user){
                mongoose.disconnect()
                reject('don t have mail') 
            }else{
                bcrypt.compare(pwd,user.pwd)
                .then((same)=>{
                    if(same){
                      let token= jwt.sign({id:user._id,username:user.userName},privatkey,{
                        expiresIn:'1h'
                       })
                       mongoose.disconnect()  
                       resolve(token)
                    }else{
                        mongoose.disconnect() 
                        reject('inalid pwd') 
                    }

                }).catch((err)=>{
                    mongoose.disconnect()
                        reject(err)
                })
            }
        })
        })
    }