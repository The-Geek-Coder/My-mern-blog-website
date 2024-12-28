const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    userProfileImageUrl:{
        type:String,
        default:"https://res.cloudinary.com/drydego54/image/upload/v1724089445/userImages/user-6380868_640_iywzvs.webp"
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
},{timestamps:true});

//bcrypt is actually not compatible and may give error during deployment so use bcryptjs

const User=mongoose.model("User",userSchema);

module.exports={User};