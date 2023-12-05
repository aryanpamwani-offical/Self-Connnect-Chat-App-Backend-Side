const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const userModel = require("../Model/userModel");
require("dotenv").config();
exports.authMiddleware = expressAsyncHandler(async(req,res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
   
});

// exports.isAdmin = (req,res,next) => {
//     try{
//         if(req.user.groupAdmin !== true) {
//             return res.status(401).json({
//                 success:false,
//                 message:'THis is a protected route for admin',
//             });
//         }
//         next();
// }
// catch(error) {
//     return res.status(500).json({
//         success:false,
//         message:'User Role is not matching',
//     })
// }
// }