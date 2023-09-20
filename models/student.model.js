const mongoose = require('mongoose')
const Joi=require('joi')
require('dotenv').config()

const schemaValidation = Joi.object({
    firsName:Joi.string().alphanum().min(3).max(30).required(),
    lastName:Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    age:Joi.number().required(),
    phone:Joi.number().required(),  

})


var SchemaStudent=mongoose.Schema({
    firsName:String,
    lastName:String,
    email:String,
    age:Number,
    phone:Number
})

var Student =mongoose.model('student',SchemaStudent)

var url =process.env.URL

exports.testcontect=()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
            mongoose.disconnect()
            resolve('connected')
        }).catch((err)=>reject(err))
    })
}

exports.postnewStudent=async (firsName,lastName,email,age,phone)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }).then(async ()=>{

            let validate= await schemaValidation.validateAsync({firsName:firsName,lastName:lastName,email:email,age:age,phone:phone})

            if(validate.error){
                mongoose.disconnect()
                reject(validate.error.details[0].message)
            }

            let student =new Student({
                firsName:firsName,
                lastName:lastName,
                email:email,
                age:age,
                phone:phone

            })
            student.save().then((doc)=>{
                mongoose.disconnect()
                resolve(doc)
            }).catch((err)=>{
                mongoose.disconnect()
                reject(err)
            })
        }).catch((err)=>reject(err))
    })
}

exports.getAllStudent=()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
         return  Student.find()
        }).then((doc)=>{
            mongoose.disconnect()
                resolve(doc)
        }).catch((err)=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.getOneStudent=(id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
         return  Student.findById(id)
        }).then((doc)=>{
            mongoose.disconnect()
                resolve(doc)
        }).catch((err)=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.deleteOneStudent=(id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
         return  Student.deleteOne({_id:id})
        }).then((doc)=>{
            mongoose.disconnect()
                resolve(doc)
        }).catch((err)=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.updateOneStudent=(id,firsName,lastName,email,age,phone)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
         return  Student.updateOne({_id:id},{firsName:firsName, lastName:lastName, email:email,age:age, phone:phone})
        }).then((doc)=>{
            mongoose.disconnect()
                resolve(doc)
        }).catch((err)=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}