import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export async function getAppById(req,res){
    try {
        const{id} = req.params;
        const appointment = prisma.appointment.findUnique({
            where:{id:Number(id)}
        })
        res.status(200).json({success:true,appointment:appointment})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}