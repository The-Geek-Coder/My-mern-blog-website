const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("../model/user.model.js");
const { errorHandler } = require("../utils/error.utils.js");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/jwtConfig.js");
const signup = async (req, res, next) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || password === '' || email === '') {
        next(errorHandler(400, "All fields are required!!")); //error handler will create this error and return.
        // return res.status(400).json({msg:"All fields are required"});
    }
    console.log((username.toLowerCase()).includes("supreme"),"true or false");
    
    if((username.toLowerCase()).includes("supreme")){
        console.log((username.toLowerCase()).includes("supreme"),"inside error");
        next(errorHandler(403, "This username is not allowed")); //error handler will create this error and return.
        return;
    }
    console.log("outside error!!");
    
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({ username, email, password: hashedPassword });

    try {
        const createdUser = await newUser.save();
        return res.json({ msg: "User signed up successfully!!", id: createdUser._id });
    } catch (error) {
        return next(errorHandler(400, "Failed to signup try using different username and email!!"));
        // next({...error,message:"Error while signing up."});
        // return res.status(500).json({msg:"Failed to signup, try using different username and email!!"});
    }
}

const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
        next(errorHandler(400, "All fields are required!!"));
    }
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found!!"));
        }

        const validPassword = await bcrypt.compare(password, validUser.password);
        console.log(validPassword);

        if (!validPassword) {
            return next(errorHandler(400, "Invalid Credentials"));
        }
        const token = jwt.sign({ id: validUser._id, isAdmin:validUser.isAdmin }, jwt_secret); //going to get expired as soon as the user closes the broweser.
        const { password: pass, ...rest } = validUser._doc; //password is the what I want to destructure and pass is the renamed name after destructuring.
        console.log(pass);

        return res.cookie("access_token", token, {
            httpOnly: true,
        }).json({msg:"Signin successful",user:rest}); //check the cookie section to get the cookie;
    } catch (error) {
        next(403,"Something went wrong");
    }
}

const googleSignin = async (req, res, next) => {
    const { name: username, email, googlePhotoUrl } = req.body;
    console.log(username);
    try {
        if((username.toLowerCase()).includes("supreme")){
            console.log((username.toLowerCase()).includes("supreme"),"inside error");
            next(errorHandler(403, "This username is not allowed")); //error handler will create this error and return.
            return;
        }
        console.log("outside error!!");
        
        const userExsist = await User.findOne({ email });
        if (userExsist) {
            const token = jwt.sign({ id: userExsist._id,isAdmin:userExsist.isAdmin }, jwt_secret);
            const { password, ...rest } = userExsist._doc;
            return res.cookie('access_token', token, {
                httpOnly: true
            }).json({ msg: "user signin successful", user: rest });
        } else {
            //in case the user is new and not in database.
            //since we cannot create a new user without a password we need to create a random password;

            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); //Base-36 is a numeral system that uses 36 symbols: the digits 0-9 and the letters a-z.
            //It allows for a compact representation of numbers, using both numbers and letters.
            //and then we slice the last 8 chars.
            //Total 16 characters because we are concatinating 8+8.

            const hashedPassword = await bcrypt.hash(generatedPassword, 10);
            console.log(username);
            
            const newUser = new User({
                username: (username.toLowerCase().split(' ').join('') + ((Math.random().toString(9)).slice(-4))), //generating unique username.
                email,
                password:hashedPassword,
                userProfileImageUrl:googlePhotoUrl
                
            }); //toString(base) converts a number to a string in the specified base.
            //Base-2: 0, 1
            // Base-8: 0, 1, 2, 3, 4, 5, 6, 7
            // Base-10: 0-9
            // Base-16: 0-9, a-f
            // Base-36: 0-9, a-z
            // Decimal 100 to Base-9
            /*
            Decimal 100 to Base-9:
            100 ÷ 9 = 11 remainder 1
            11 ÷ 9 = 1 remainder 2
            1 ÷ 9 = 0 remainder 1
            Read the remainders from bottom to top: 121 in base-9.
            */
            const createdUser=await newUser.save();
            const token=jwt.sign({id:createdUser._id,isAdmin:createdUser.isAdmin},jwt_secret);
            const {password,...rest}=createdUser._doc;

            return res.cookie('access_token', token, {
                httpOnly: true
            }).json({ msg: "user signin successful", user: rest });
        }
    } catch (error) {
      return  next(500,"Something went wrong");
    }
}

module.exports = {
    signup,
    signin,
    googleSignin
}