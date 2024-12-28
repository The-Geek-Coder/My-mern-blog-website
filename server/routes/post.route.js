const express=require("express");
const { verifyJwtToken } = require("../utils/verifyJWT.utils");
const { create, getPosts, deletePost, updatePost } = require("../controllers/post.controller");

const postRouter=express.Router();

postRouter.post("/create",verifyJwtToken,create);
postRouter.get("/getposts",getPosts);
postRouter.delete("/delete/:userId/:postId",verifyJwtToken,deletePost);
postRouter.put("/update/:userId/:postId",verifyJwtToken,updatePost);
module.exports={postRouter};