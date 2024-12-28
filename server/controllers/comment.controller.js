const { Comment } = require("../model/comment.model");
const { User } = require("../model/user.model");
const { errorHandler } = require("../utils/error.utils");

const createComment=async(req,res,next)=>{
    try {
        const {content,postId,userId}=req.body;
        if(req.user.id!==userId){
            return res.status(403).json({msg:"Unauthorized"});
        }
        if(!postId || !content){
            console.log(postId,content);
            
            return res.status(401).json({msg:"Cannot post comment"});
        }
        const newComment=new Comment({
            content,
            postId,
            userId
        });
        await newComment.save();
        return res.json({msg:"Comment posted!!",newComment});
    } catch (error) {
        
    }
}

const getPostComments=async(req,res,next)=>{
    try {
        const {postId}=req.params;
        const comments=await Comment.find({postId}).sort({
            createdAt:-1, //newest ones.
        });
        console.log(comments.length+"length");
        
        return res.json({comments});
    } catch (error) {
        next(errorHandler())
    }
}

const likeComment=async(req,res,next)=>{
    try {
        const {commentId}=req.params;
        const comment=await Comment.findById(commentId);
        if(!comment) return next(errorHandler(404,"Comment not found"));

        const userIndex=comment.likes.indexOf(req.user.id); //if liked by the user or not.
        if(userIndex===-1) {
            //not liked so...
            comment.numberOfLikes+=1;
            comment.likes.push(req.user.id);
        } else{
            comment.numberOfLikes-=1;
            comment.likes.splice(userIndex,1); //remove like.
        }
        await comment.save();
       return res.json({comment});
    } catch (error) {
        return next(errorHandler());
    }
}

const editComment=async(req,res,next)=>{
    try {
        const {commentId}=req.params;
        const comment=await Comment.findById(commentId);
        const user=await User.findById(req.user.id);

        if(!comment){
            return next(errorHandler(404,"Comment not found! Refresh!"));
        }

        if(comment.userId!==req.user.id && !req.user.isAdmin) return next(errorHandler(403,"You are not authorized to use this feature"));

        const userId=comment.userId;
        const userCheckSupreme=await User.findById(userId);
        console.log(req.user,userCheckSupreme.isSupreme,"supreme",!req.user.isSupreme,req.user.id);
        console.log("result",!req.user.isSupreme,"Here",(!req.user.isSupreme && !!userCheckSupreme.isSupreme),userCheckSupreme.__v, userCheckSupreme._doc.isSupreme,userCheckSupreme);
        //we are using _doc because since isSupreme is not there in the schema but in the _docs(database) so to access that.
        if(!user._doc.isSupreme && userCheckSupreme._doc.isSupreme)  return next(errorHandler(403,"Not authorized to access this feature!"));


        const  editedComment=await Comment.findByIdAndUpdate(commentId,{
            content:req.body.content,
        },{new:true});

        return res.json({comment:editedComment});
        
    } catch (error) {
        next(errorHandler(500,"Something went wrong from our side! Please try again!"));
    }
}

const deleteComment=async(req,res,next)=>{
    try {
        const {commentId}=req.params;
        const comment=await Comment.findById(commentId);
        const user=await User.findById(req.user.id);

        if(!comment) return next(errorHandler(404,"Comment was not found"));

        console.log(comment,req.user.isSupreme,comment.userId,req.user.id,!req.user.isAdmin);

        if(comment.userId!==req.user.id && !req.user.isAdmin) return next(errorHandler(403,"Not authorized to access this feature!"));

        const userId=comment.userId;
        const userCheckSupreme=await User.findById(userId);
        console.log(userCheckSupreme,userCheckSupreme.isSupreme,"supreme",!req.user.isSupreme);
        //we are using _doc because since isSupreme is not there in the schema but in the _docs(database) so to access that.
        if(!user._doc.isSupreme && userCheckSupreme._doc.isSupreme)  return next(errorHandler(403,"Not authorized to access this feature!"));

        const deletedComment=await Comment.findByIdAndDelete(commentId);

        return res.json({msg:"Comment deleted successfully!"});
    } catch (error) {
        return next(errorHandler(500,"Something went wrong in server!"));
    }
}

const getComments=async(req,res,next)=>{
    try {
        if(!req.user.isAdmin) return next(errorHandler(403,"Not authorized!"));
        
        const startIndex= Number(req.query.startIndex) || 0;
        const limit= Number(req.query.limit) || 9;
        const sortDirection=req.query.sort==="asc"?1:-1;
        const user=await User.findById(req.user.id);
        let comments=null;
        if(user._doc.isSupreme)
         comments=await Comment.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit).populate({
            path: 'userId', // The field to populate
            select: 'isSupreme' // Specify which fields to include from the User model
          });      //inside userId there will be userId :{userId,isSupreme} so to access isSupreme you have to do 

        if(!user._doc.isSupreme)
         comments=await Comment.find({userId:req.user.id}).sort({createdAt:sortDirection}).skip(startIndex).limit(limit).populate({
            path: 'userId', // The field to populate
            select: 'isSupreme' // Specify which fields to include from the User model
          });      //inside userId there will be userId :{userId,isSupreme} so to access isSupreme you have to do 


          console.log(comments[0]);
             
        const totalComments=await Comment.countDocuments();
        const now=new Date();
        const oneMonthAgo=new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        );
        const lastMonthComments=await Comment.countDocuments({createdAt:{$gte:oneMonthAgo}});
        res.json({comments,totalComments,lastMonthComments});
    } catch (error) {
        return next(errorHandler(500,"Something went wrong!"));
    }
}

module.exports={
    createComment,
    getPostComments,
    likeComment,
    editComment,
    deleteComment,
    getComments
}