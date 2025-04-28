import express from "express"
import {getAppById} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/:id",getAppById);



export default router