const mongoose=require("mongoose");

const dbConnect=()=>{
    try {
       mongoose.connect(process.env.MONGO_URL)
       console.log("Mongoose Connected Successfully"); 
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}
module.exports= dbConnect