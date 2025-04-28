import pkg, { Prisma } from "@prisma/client";
import axios from "axios";
import { connect } from "mongoose";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export async function addPet(req,res){
    try {
        const {id} = req.params;
        const {name,species,breed,age,profilePicture}=req.body;
        const petOwner = await prisma.user.findUnique({
            where:{id:Number(id)}
        })
        if(!petOwner){
            res.status(404).json({success:false,message:"petOwner not found"})
        }
        const pet = await prisma.pet.create({
            data:{
                name,
                species,
                breed,
                age,
                profilePicture,
                ownerId:petOwner.id,
            }
        })
        res.status(200).json({success:true,petCreated:pet})

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export async function updatePet(req,res){
    try {
        const {id,petId}=req.params;
        const { name, species, breed, age, profilePicture } = req.body;
        const pet  = await prisma.pet.findUnique({
            where:{id:Number(petId)}
        })
        if(!pet){
            res.status(404).json({success:false,message:"pet not found"})
        }
        const updatedPet = prisma.pet.update({
            where:{id:pet.id},
            data:{
                name,
                species,
                breed,
                age,
                profilePicture
            }
        })
        res.status(200).json({success:true, updatedPet:updatedPet,message:"pet updated successfuly"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function deletePet(req,res){
    try {
        const {petId} = req.params;
        const pet = await prisma.pet.findUnique({
            where: {id:Number(petId)}
        })
        if(!pet){
            res.status(404).json({success:false,message:"pet not found"})
        }
        const deletePet = await prisma.pet.delete({
            where:{id:Number(petId)}
        })
        res.status(200).json({success:true,message:"pet deleted successfuly"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getAllPets(req,res){
    try {
        const {id}=req.params;
        const petOwner = await prisma.user.findUnique({
            where:{id : Number(id)},
            include:{
                pets:true
            }
        })
        if(!petOwner){
            res.status(404).json({success:false,message:"user not found"})
        }
        res.status(200).json({success:true,pets:petOwner.pets})
    } catch (error) {
         console.error(error);
         res.status(500).json({ error: "Internal server error" });
    }
}

export async function getPetById(req,res) {
    try {
        const {petId} = req.params;
        const pet = await prisma.pet.findUnique({
            where:{id:Number(petId)}
        })
        if(!pet){
            res.status(404).json({success:false,message:"pet not found"})
        }
        res.status(200).json({success:true,pet:pet})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getMedicalHistory(req,res) {
    try {
        const {petId} = req.params;
        const medicalReports = await prisma.medicalReport.findMany({
            where:{petId:Number(petId)}
        })
        res.status(200).json({success:true,medicalReports:medicalReports})
    } catch (error) {
         console.error(error);
         res.status(500).json({ error: "Internal server error" });
    }
}

export async function createApp(req,res) {
    try {
        const {id}=req.params;
        const {date,reason,petId,vetId} = req.body;
        const appointment =await prisma.appointment.create({
            data:{
                date,
                reason,
                pet:{
                    connect:{id:petId}
                },
                vet:{
                    connect:{id:vetId}
                },
                owner:{
                    connect:{id:Number(id)}
                }
            }
        })
        res.status(200).json({success:true,appointment:appointment})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}