const express=require("express");
const { signup, signin, googleSignin } = require("../controllers/auth.controller");

const authRouter=express.Router();

authRouter.post("/signup",signup);
authRouter.post("/signin",signin);
authRouter.post("/google",googleSignin);
module.exports={authRouter};