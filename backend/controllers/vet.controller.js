import pkg, { Prisma } from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();


export async function getAllVets(req,res){
    try {
        const vets = await prisma.user.findMany({
            where: {role:"vet"},
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
        })
        res.status(200).json({success : true,veterinarians : vets})
    } catch (error) {
        res.status(500).json({success:false , message :"error fetching vets" , error : error.message})
    }
}

export async function getVetById(req,res){
    try {
        const {id} = req.params;
        const vet = await prisma.user.findUnique({
          where: { id: Number(id) }
        });
        const { password, ...safeUser } = vet;
        if(!vet){
            res.status(404).json({success:false, message:"Vetenarian Not Found"})
        }else{
            res.status(200).json({success:true,vet : safeUser})
        }
    } catch (error) {
        res.status(500).json({success:false,message:"error fetching vets" , error:error.message})
    }
}

export async function setProfile(req,res){
    try {
        const {id} = req.params
        const {licenceNumber , specialties , availability , bio} = req.body;
        if(!licenceNumber || !specialties || !availability || !bio){
            res.status(404).json({success:false,message:"All fields are required"})
        }
        const checkExistance = await prisma.user.findUnique({
            where: {id : Number(id)}
        })
        if(!checkExistance){
            res.status(404).json({success:true,message:"Vet not found"})
        }
        const vet  = await prisma.user.update({
            where:{id:Number(id)},
            data:{
                licenceNumber,
                specialties,
                availability,
                bio
            }
        })
        const { password, ...safeUser } = vet;
        res.status(200).json({success:true,veterinarian:safeUser})
    } catch (error) {
        res.status(500).json({success:false,message:"error setuping vet profile",error:error.message})
    }
}



export async function vetAppDecision(req,res){
    try {
        const {id,decision,appId} = req.params;
         if (!["accept", "decline","cancel"].includes(decision)) {
           return res
             .status(400)
             .json({
               error: 'Invalid decision. Must be "accept" or "decline" or "cancel.',
             });
         }
        const app = await prisma.appointment.findUnique({
            where:{id:Number(appId)}
        })
        if(!app){
            res.status(404).json({success:true,message:"appointment not found"})
        }
        const updatedAppointment = await prisma.appointment.update({
          where: { id: Number(appId) },
          data: {
            status:
              decision === "accept"
                ? "confirmed"
                : decision === "decline"
                ? "declined"
                : "cancelled",
          },
        });
        res.json({
            success:true,
          message: `Appointment ${decision}ed successfully.`,
          appointment:updatedAppointment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function makeMedicalReport(req,res) {
    try {
        const{id,appId} = req.params;
        const {title,description,diagnosis,treatment} = req.body;
        const app = await prisma.appointment.findUnique({
            where:{id:Number(appId)},
        })
        if(!app){
            res.status(404).json({success:false,message:"appointment not found"})
        }
        MedicalReport = await prisma.medicalReport.create({
            data:{
                petId:app.petId,
                vetId : Number(id),
                appointmentId:appId,
                title,
                description,
                diagnosis,
                treatment,
            }
        })
        res.status(200).json({success:true,Report : MedicalReport})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getVetsAvailable(req,res){
    try {
        const {date,slotsArray} = req.params;
        const vetsAvailable = prisma.vet.findMany({
          where: {
            role: "vet",
            availability: {
              path: [date], 
              array_contains: slotsArray, 
            },
          },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}