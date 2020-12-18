const express=require('express')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const config=require('./../config/config').get(process.env)

const mongoose=require('mongoose')
mongoose.connect(config.DATABASE)


const bookSchema=mongoose.Schema(
{
    author:{
        type:String,
        unique:1,
        
    },
    review:{
        type:String,
      
       
    },
    name:{
        type:String
    },
    pages:{
        type:Number,
        
    },
    price:{
        type:Number,
       
    },
    rating:{
        type:Number,
        min:1,
        max:5
        
    },
    orderId:{
        type:String,
      
    },
    ownerId:{
        type:String,

    }
},{timestamps:true})
const Book=mongoose.model('Book',bookSchema)
module.exports={Book}