const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const config=require('./../config/config').get(process.env.NODE_ENV)

const mongoose=require('mongoose')
mongoose.connect(config.DATABASE)
const SALT_I=10


const userSchema=mongoose.Schema(
{
    password:{
        type:String,
        
     
    },
    email:{
        type:String,
       
    
    },
    name:{
        type:String,
 

    },
    lastname:{
        type:String,
       

    },
    role:{
        type:String,
        default:0
    },
    token:{
        type:String,
    }
})
//before saving
userSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
//create salt
    bcrypt.genSalt(SALT_I,function(err,salt){
        if(err)return next(err)
        //create hash and hash password
    bcrypt.hash(user.password,salt,function(err,hash){
        if(err)return next(err)
        user.password=hash
        next()
        
    }) 

    })

}else{
    next()
}
});

userSchema.methods.comparePassword=function(candidatepasword,cb){
//use compare method to compare cadidate pasword and req.body.password
bcrypt.compare(candidatepasword,this.password,function(err,isMatch){
    if(err)return cb(err);
    cb(null,isMatch)

})
}


userSchema.methods.generateToken=function(cb){
    const user=this
    
//generate a token by passing token id and secret key into method
    const token=jwt.sign(user._id.toHexString(),config.SECRET)
  
   //save the token to the user data
     user.token=token
     user.save(function(err,user){
        if (err)  return cb(err)
        //if no error send a call back with err being null and the user
        cb(null,user)
     })    

}
userSchema.statics.findByToken = function(token,cb){
    var user  = this;

    jwt.verify(token,config.SECRET,function(err,decode){
        user.findOne({"_id":decode,"token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user)
        })
    })
}

userSchema.methods.deleteToken = function(token,cb){
    var user = this;

    user.update({$unset:{token:1}},(err,user)=>{
        if(err) return cb(err);
        cb(null,user)
    })
}
const User=mongoose.model('User',userSchema)
module.exports={User}