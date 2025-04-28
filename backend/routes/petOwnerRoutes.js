import express from "express";
import {addPet,updatePet,deletePet,getAllPets,getPetById,getMedicalHistory,createApp} from "../controllers/petOwner.controller.js"

const router = express.Router();

router.get("/:id/pets",getAllPets);
router.get("/:id/pets/:petId",getPetById)
router.get("/:id/pets/:petId/medicalHistory",getMedicalHistory)
router.post("/:id/pets/addPet",addPet);
router.patch("/:id/pets/:petId/updatePet",updatePet)
router.delete("/:id/pets/:petId/deletePet",deletePet)
router.post("/:id/apointments/makeAppointment",createApp)






export default router