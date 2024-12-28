const express =require("express");
const { test, updateUser, deleteUser, signoutUser, getUsers, getUser } = require("../controllers/user.controllers.js");
const { verifyJwtToken } = require("../utils/verifyJWT.utils.js");

const userRouter=express.Router();

userRouter.get("/test",test);
//getUser only  for admin access.
userRouter.get("/getUsers",verifyJwtToken,getUsers);
//for all in general.
userRouter.get("/:userId",getUser);
userRouter.put("/update/:userId",verifyJwtToken,updateUser);
userRouter.delete("/delete/:userId",verifyJwtToken,deleteUser);
userRouter.post("/signout",signoutUser);
module.exports={userRouter};
