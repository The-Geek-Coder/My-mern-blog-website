const express=require("express");
const { createComment, getPostComments, likeComment, editComment, deleteComment, getComments } = require("../controllers/comment.controller");
const { verifyJwtToken } = require("../utils/verifyJWT.utils");

const commentRouter=express.Router();

commentRouter.post("/create",verifyJwtToken,createComment);
commentRouter.get("/getPostComment/:postId",getPostComments);
commentRouter.get("/getComments",verifyJwtToken,getComments);
commentRouter.put("/likeComment/:commentId",verifyJwtToken,likeComment);
commentRouter.put("/editComment/:commentId",verifyJwtToken,editComment);
commentRouter.delete("/deleteComment/:commentId",verifyJwtToken,deleteComment);
module.exports={
    commentRouter
}