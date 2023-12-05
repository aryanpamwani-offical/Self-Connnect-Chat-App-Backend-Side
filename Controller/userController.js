const userModel=require('../Model/userModel');
const generateToken = require("../Config/generateToken");
const expressAsyncHandler=require('express-async-handler');

exports.registerController=expressAsyncHandler( async(req,res)=>{
    const { name, email, password } = req.body;

    // check for all fields
    if (!name || !email || !password) {
      res.send(400);
      throw Error("All necessary input fields have not been filled");
    }
  
    // pre-existing user
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      // res.send(405);
      throw new Error("User already Exists");
    }
  
    // // userName already Taken
    // const userNameExist = await UserModel.findOne({ name });
    // if (userNameExist) {
    //   // res.send(406);
    //   throw new Error("UserName already taken");
    // } 
  
    // create an entry in the db
    const user = await userModel.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Registration Error");
    }
})


exports.loginController=expressAsyncHandler(async(req,res)=>{
    const { email, password } = req.body;

  const user = await userModel.findOne({ email });

 
  if (user && (await user.matchPassword(password))) {
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    };
   
    res.json(response);
  } else {
    res.status(401);
    throw new Error("Invalid UserName or Password");
  }
    });

exports.fetchAllUser=async(req,res)=>{
    try {
        const keyword=req.query.search
        ?{
            $or:[
                {name:{$regex:req.query.search,$options:"i"}},
                {email:{$regex:req.query.search,$options:"i"}},
            ]
        }:{};
        const user=await userModel.find(keyword).find({
            _id:{$ne:req.user.id}
        });
       return res.status(200).json({message:"Fetch all user",data:user})

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Fetching user Failure',
        });
    }
};
