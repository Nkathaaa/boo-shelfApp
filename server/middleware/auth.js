const {User}=require('./../models/user')

//auth function should return user,from the token details
const auth=(req,res,next)=>{
    const token=req.cookies.auth
    User.findByToken(token,(user,err)=>{
        if(err)throw err
        if(!user) return res.json({
            error:true
        });
     
            req.token=token;
            req.user=user
            next();
    
    })
    
}

module.exports={auth} 

