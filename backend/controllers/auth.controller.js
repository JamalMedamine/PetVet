
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export async function signup(req,res){
    try{
    const {firstName , lastName , email , phoneNumber,sex,password,role}= req.body
        if(!firstName || !lastName || ! email || !phoneNumber || !role || !password||!sex){
            res.status(400).json({success:false ,message : "all field are required"})
        }
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if(!emailRegex.test(email)){
            res.status(400).json({success:false , message:"invalid email"})
        }
        if(password.length < 8){
            res.status(400).json({success: false , message:"password too short"})
        }
        const existingByEmail = await prisma.user.findUnique({
            where:{email:email}
        });
         const existinByPhoneNumber = await prisma.user.findUnique({
            where : { phoneNumber : phoneNumber }
         });
        if(existingByEmail || existinByPhoneNumber){
            res.status(400).json({success:false , message:"User already exist"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = await prisma.user.create({
            data:{
                firstName : firstName,
                lastName : lastName,
                email : email,
                phoneNumber : phoneNumber,
                password : hashedPassword,
                sex,
                role : role
            }
        })
       generateTokenAndSetCookie(newUser._id,res);
       res.status(201).json({success:true,message:"user created"})
    }catch(error){
        res.status(500).json({success:false,message:error.message})
    }
}

export async function login(req,res) {
    try {
         const { email, password } = req.body;
         const user = await prisma.user.findUnique({
            where:{email : email}
         })

         if (user) {
            const checkPass = await bcrypt.compare(password,user.password)
           if (checkPass) {
             generateTokenAndSetCookie(user._id, res);
            res
               .status(200)
               .json({ success: true, message: "loged in successfully" });
           } else {
            return res
               .status(404)
               .json({ success: false, message: "incorrect password" });
           }
         } else {
        res
              .status(404)
              .json({ success: false, message: "invalid email" });
         }
    } catch (error) {
        console.log("Error in login controller ", error.message);
        res
          .status(500)
          .json({ success: false, message: "server internal error " });
    }
 

}

export async function logout(req,res) {
  try {
    res.clearCookie("jwt-pvet");
    return res.status(200).json({success:true,message:"loged out successfully"})
  } catch (error) {
    console.log("Error in logout controller ",error.message);
    return res.status(500).json({success:false , message:"server internal error "})
  }
}