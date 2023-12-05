const mongoose=require('mongoose');
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        requried: true,
      },
      email: {
        type: String,
        requried: true,
      },
      password: {
        type: String,
        requried: true,
      },
    },
    {
      timeStamp: true,
    }
  );
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  userSchema.pre("save", async function (next) {
    if (!this.isModified) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
const userModel=mongoose.model("User",userSchema);
module.exports=userModel