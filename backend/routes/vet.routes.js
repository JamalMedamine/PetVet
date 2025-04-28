import express from "express";
import {makeMedicalReport,vetAppDecision,getAllVets,getVetById,setProfile,getVetsAvailable} from "../controllers/vet.controller.js"

const router = express.Router();

router.get("/",getAllVets);
router.get("/:id",getVetById);
router.get("/available",getVetsAvailable);
router.post("/:id/setProfile",setProfile);
router.post("/:id/:appId/medicalReport", makeMedicalReport);
router.patch("/:id/appointments/:appId/:decision", vetAppDecision);







export default router