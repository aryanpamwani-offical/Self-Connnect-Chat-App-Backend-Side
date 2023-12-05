const express =require("express");
const { registerController, loginController, fetchAllUser } = require("../Controller/userController");
const {  authMiddleware } = require("../Middleware/authMiddleware");

const router=express.Router();
router.post('/auth/signup',registerController)
router.post('/auth/login',loginController)
router.get("/auth/user",authMiddleware, fetchAllUser);
module.exports=router