require("dotenv").config();
const express=require("express");
const { connectDB } = require("./utils/db.utils");
const { userRouter } = require("./routes/user.route");
const { authRouter } = require("./routes/auth.route");
const { postRouter } = require("./routes/post.route");

const cookieParser=require("cookie-parser");
const { commentRouter } = require("./routes/comment.route");
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/u",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/posts",postRouter);
app.use("/api/comments",commentRouter);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message  || "Internal Server Error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        msg:message
    });
});

connectDB().then(()=>{
    app.listen(3000,()=>{
        console.log("Server running at http://localhost:3000");  
    });
}).catch(()=>{
    console.log("Internal Server Error!!");
    
});
