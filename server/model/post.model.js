const mongoose=require("mongoose");

const postSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
        trim:true
    },
    title:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    image:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/thumbnails/006/800/199/small/creative-abstract-book-feather-logo-design-vector.jpg"
    },
    category:{
        type:String,
        default:"Uncategorized",
    },
    slug:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true});


const Post=mongoose.model("Post",postSchema);

module.exports={Post};