const { jwt_secret } =require("../config/jwtConfig.js");

const jwt=require("jsonwebtoken");
const {errorHandler}=require("./error.utils.js");

const verifyJwtToken=async(req,res,next)=>{
    const token=req.cookies.access_token;
    if(!token){
        return next(errorHandler(401,"Unauthorized"));
    }
    jwt.verify(token,jwt_secret,(err,decodedUser)=>{
        if(err){
            return next(errorHandler(401,"Unauthorized"));
        } 
        console.log(decodedUser,"This is decoded user");
        
        req.user=decodedUser;
        next();
    });
    
}

module.exports={
    verifyJwtToken
}