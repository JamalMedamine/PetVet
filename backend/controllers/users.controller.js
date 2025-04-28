import pkg from "@prisma/client";
import { connect } from "mongoose";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export async function getUserById(req,res){
    try {
        const id = req.params.id
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          role: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
      });
        res.status(200).json({success:true, Users : user})
        
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching users" });
    }
}

export async function getAllUser(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).json({ success: true, Users: users });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching users" });
  }
}

export async function updateUser(req,res) {
    try {
        const {id} = req.params;
        const userCheck = await prisma.user.findUnique({
            where : {id : Number(id)}
        })
        if(!userCheck){
            res.status(404).json({success:false,message:"User Not Found"})
        }
        const {
            email,
            firstName,
            lastName,
            phoneNumber,
            role,
            address
        } = req.body;
        const updatedUser = await prisma.user.update({
            where: {id:Number(id)},
            data:{
                email,
                firstName,
                lastName,
                phoneNumber,
                role,
                address
            }
        })
        res.status(200).json({success:true,message : "user updated successfuly" , user : updateUser})
    } catch (error) {
        res.status(500).json({success:false,message:"error updating user",error : error.message})
    }
}

export async function deleteUser(req,res){
    try {
        const {id} = req.params;
        const userCheck = await prisma.user.findUnique({
          where: { id: Number(id) },
        });
        if (!userCheck) {
          res.status(404).json({ success: false, message: "User Not Found" });
        }
        else{
            const user = await prisma.user.delete({
                where : {id: Number(id)}
            })
            res.status(200).json({success:true,message:"User Deleted Successfyly"})
        }
    } catch (error) {
         res
           .status(500)
           .json({
             success: false,
             message: "error deleting user",
             error: error.message,
           });
    }
}

export async function getConfirmedApp(req,res){
  try {
    const {id}  = req.params;
    const confirmedApp = await prisma.appointment.findMany({
      where:{
        status:"confirmed",
        OR:[{vetId:Number(id)},{ownerId:Number(id)}]
      }
    })
    res.status(200).json({success:true,confirmedAppointments:confirmedApp})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCompletedAndCancelledApp(req, res) {
  try {
    const { id } = req.params;
    const AppHistory = await prisma.appointment.findMany({
      where: {
       OR:[{status:"completed"},{status:"cancelled"}], 
        OR: [{ vetId: Number(id) }, { ownerId: Number(id) }],
      },
    });
    res.status(200).json({success:true,appointmentHistory:AppHistory});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getPendingApp(req, res) {
  try {
    const { id } = req.params;
    const pendingApp = await prisma.appointment.findMany({
      where: {
        status:"pending",
        OR: [{ vetId: Number(id) }, { ownerId: Number(id) }],
      },
    });
    res.status(200).json({success:true,pendingAppointments:pendingApp})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function createMessage(req, res) {
  try {
    const {id}=req.params;
    const {receiverId,content} = req.body;
    const msg = await prisma.message.create({
      data:{
        sender:{connect:{id:Number(id)}},
        receiver:{connect:{id:receiverId}},
        content,
      }
    })
    res.status(200).json({success:true,message:"message sent successfuly!"})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllMessages(req,res){
  try {
    const {id} = req.params;
    const msgs = await prisma.message.findMany({
      where:{receiverId:Number(id)}
    })
    res.status(200).json({success:true,messages:msgs})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}