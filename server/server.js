
const express=require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const mongoose=require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV);
const app=express();
//we are using bodysparser ie json

mongoose.Promise=global.Promise,
mongoose.connect(config.DATABASE)
//const {User}=require('./models/user')
const{Book}=require('./models/book');
const user = require('./models/user');
const { json } = require('body-parser');
const { User } = require('./models/user');
const { auth }= require('./middleware/auth')
//if we are in heroku...use get and have acess to this data

app.use(bodyParser.json())
app.use(cookieParser())

//post
app.post('/api/book',(req,res)=>{
    const book=new Book(req.body)

    book.save((err,doc)=>{
    if(err) return res.status(400).send(err);
    //if no error...return doc in json format ..assign true to post
     res.status(200).json({
         post:true,
         bookId:doc._id

     })
      })
    
})

app.get ('/api/auth',auth,(req,res)=>{
    res.json({
        isAuth:true,
        id:req.user._id,
        name:req.user.name,

    })
})
app.get('/api/logout',auth,(req,res)=>{
    req.user.deleteToken(req.token,(err,user)=>{
        if(err) return res.status(400).send(err);
        res.sendStatus(200)
    })
})
app.post('/api/register',(req,res)=>{
    const user = new User(req.body);

    user.save((err,doc)=>{
        if(err) return res.json({success:false});
        res.status(200).json({
            success:true,
            user:doc
        })
    })
})

//Get and compare entered password to password in db
app.post('/api/login',(req,res)=>{
   User.findOne({'email':req.body.email},(err,user)=>{
       if(!user)return res.json({isAuth:false, message:'email is not found'})
       //ComparePassword method in server.js that returns isMatch of true
      user.comparePassword(req.body.password,(err,isMatch)=>{
          if(!isMatch)return res.json({isAuth:false,message:'Password is incorrect'})
      })

      //pass the req.body.id data to the genarateToken method
      user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err)
        res.cookie('auth',user.token).json({
            isAuth:true,
            id:user._id,
            email:user.email

        })
          //Add the returned user data to  a cookie
          
      })
   })
    
})
//Get all users
app.get('/api/users',(req,res)=>{
  
    User.find({},(err,user)=>{
        if(err)res.status(400)
        res.json({ user })

    })
})

//Get the reviewers details
app.get('/api/getReviewers',(req,res)=>{
    const id= req.query.id
    User.findById(id,(err,doc)=>{
        if(err) res.status(400)
        res.json({
            doc
        })
    })
})


app.get('/api/book',(req,res)=>{
  const skip=parseInt(req.query.skip);
  const limit=parseInt(req.query.limit);
  const order=req.query.order
  Book.find().skip(skip).limit(limit).sort({_id:order}).exec((err,doc)=>{
      if(err)return res.status(400).send(err);
      res.send(doc)
  })
})
//get
app.get('/api/getbook',(req,res)=>{
    const id=req.query.id
    Book.findById(id,(err,doc)=>{
        if(err) return res.status(400).send(err);
        res.send(doc)
    })


})
//update
app.get('/api/updatebook',(req,res)=>{
    Book.findByIdAndUpdate(req.body.id,req.body,{new:true},(err,doc)=>{
        if(err)return res.status(400).send(err);
        res.json({
        success:true,
        doc
        })

    })
  
  
})
//delete
app.get('api/deleteBook',(req,res)=>{
    const id=req.query.id
    Book.findByIdAndRemove(id,(err,doc)=>{
        if(err)return res.status(400).send(err);
        res.json({
            success:true,
            doc
        })
    })
})






const port=process.env.PORT || 3001
app.listen(port,()=>{
    console.log('SERVER RUNNING')
})