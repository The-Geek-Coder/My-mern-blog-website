const mongoose=require("mongoose");

const CommentSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    postId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true,
        ref: 'User'
    },
    likes:{
        type:Array,
        default:[]
    },
    numberOfLikes:{
        type:Number,
        default:0
    }
},{timestamps:true});

const Comment=mongoose.model("Comment",CommentSchema);

module.exports={Comment};