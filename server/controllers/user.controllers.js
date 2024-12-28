const { User } = require("../model/user.model");
const { errorHandler } = require("../utils/error.utils");
const bcrypt=require("bcrypt");
const test=async (req,res)=>{
  return  res.json({msg:"Hello this is a test"});
}

const updateUser=async (req,res,next)=>{
  // console.log(req.user,"Hi tehre",req.params.userId);
  try {
    console.log(req.params.userId);
  if(req.user.id!==req.params.userId){
    console.log(req.user.userId);
    return next(errorHandler(403,"Unauthorized access denied"));
  }

  if(req.body.password){
    if(req.body.password.length<8){
      return next(errorHandler(400,"Password length must be atleast of 8 characters."));
    }
    req.body.password=bcrypt.hashSync(req.body.password,10);
  }
  if(req.body.username){
    console.log(req.body.username.length,req.body.username);
    
    if(req.body.username.length<7 || req.body.username.length>20){
      console.log(req.body.username.length,req.body.username,"Not entered");
      return next(errorHandler(400,"Username must be between 7 to 20 characters."));
    }
    if(req.body.username.includes(' ')){
      return next(errorHandler(400,"Username cannot contain space."));
    }
    if(req.body.username!==req.body.username.toLowerCase()){
      return next(errorHandler(400,"Username must be in lowercase"))
    }
  if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){ //A to Z and 0 to 9.
    return next(errorHandler(400,"Username can only contain letters and numbers"))
  } 
}
  try {
    const unUpdatedUser=await User.findById(req.user.id);
    console.log(unUpdatedUser,"hello ther");

    const updateFields={
      username:(req.body.username || unUpdatedUser.username),
      userProfileImageUrl: req.body.userProfileImageUrl || unUpdatedUser.userProfileImageUrl,
      password:(req.body.password || unUpdatedUser.password)
    }
    console.log("Reached");
    const updatedUser=await User.findByIdAndUpdate(req.params.userId,{
      $set:updateFields
    },{new:true});
    console.log(updatedUser,"This is me");
    const {password,...rest}=updatedUser._doc;
    res.json({msg:"Updated user successfully",user: rest })
  } catch (error) {
    console.log(error.message);
    if (error.code === 11000) {
      console.log("entered");
      return next(errorHandler(403,"User already exsists"));
    }
   return next("Something went wrong");
  }
}
  catch (error) {
    console.log(error.message);
   return next(500,"Something went wrong");
  }
}

const deleteUser=async(req,res,next)=>{
  if(!req.user.isAdmin && req.user.id!==req.params.userId){
    return next(errorHandler(403,"Unauthorized access denied"));
  }
  const user= await User.findOne({_id:req.params.userId});
  console.log(req.body.deleteUserConsent,`I WanT To DeLeTe the aCcoUnT Of ${user.username}`);

  if(user.isSupreme) return res.status(403).json({msg:"Account deletion cancelled."});

  if(!req.body.deleteUserConsent || (req.body.deleteUserConsent!=="I WanT To DeLeTe mY acCoUnt" && req.body.deleteUserConsent!==`I WanT To DeLeTe the aCcoUnT Of ${user.username}`)){
    console.log(req.body.deleteUserConsent,`I WanT To DeLeTe the aCcoUnT Of ${user.username}`);
      return res.status(401).json({msg:"Account deletion cancelled."});
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({msg:"User deleted successfully"});
  } catch (error) {
    res.status(500).json({msg:"User deleted successfully"});
  }
}

const signoutUser=(req,res,next)=>{
  try {
    res.clearCookie("access_token").json("User has been signed out");
  } catch (error) {
    next(errorHandler(400,"There was a problem signin out!. Try Again."))
  }
}

const getUsers=async (req,res,next)=>{
  if(!req.user.isAdmin){
    next(errorHandler(403,"You are not authorized"));
  }
  try {
    const startIndex=parseInt(req.query.startIndex) || 0;
    const limit=parseInt(req.query.limit) || 9;
    const sortDirection=req.query.sort==='old'?1:-1; //1 for ascending

    const filteredUsers=await User.find({})
    .sort({createdAt:sortDirection})
    .skip(startIndex)
    .limit(limit);
    const filteredUsersWithoutPassword=filteredUsers.map((user)=>{
      // const {password,isSupreme,...rest}=user._doc; // user is a Mongoose document with methods (e.g., .save(), .remove()) and metadata, while user._doc is just the raw data object.
      const {password,userProfileImageUrl,...rest}=user._doc; // user is a Mongoose document with methods (e.g., .save(), .remove()) and metadata, while user._doc is just the raw data object.
      const userInsideMap={...rest,image:userProfileImageUrl};
      return userInsideMap;
  });

  const totalUser=await User.countDocuments(); //inbuilt method.
  const now=new Date();
  const oneMonthAgo=new Date(
    now.getFullYear(),
    now.getMonth()-1,
    now.getDate()
  )
  const lastMonthUsers=await User.countDocuments({
    createdAt:{$gte:oneMonthAgo}
  })
   return res.json({users:filteredUsersWithoutPassword,totalUser,lastMonthUsers});
  } catch (error) {
    return next(errorHandler());
  }
}

const getUser=async(req,res,next)=>{
  try {
    const {userId}=req.params;
    console.log(userId);
    
    const user=await User.findById(userId);
    if(!user) return res.json(errorHandler(404,"User not found"));

    const {password,...rest}=user._doc;
    return res.status(200).json({user:rest});
  } catch (error) {
    console.log(error.message);
    
    return next(errorHandler())
  }
}

module.exports={
    test,
    updateUser,
    deleteUser,
    signoutUser,
    getUsers,
    getUser
}