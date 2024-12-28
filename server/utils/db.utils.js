const { default: mongoose } = require("mongoose");
const { URI } = require("../config/dbConfig");

async function connectDB(){
    try {
        console.log("Connecting to db...");
        
        await mongoose.connect(URI);
        console.log("connection successful to DB");
        
    } catch (error) {
       console.error("Database Connection failed");
        process.exit(0);
    }
}

module.exports={
    connectDB
}