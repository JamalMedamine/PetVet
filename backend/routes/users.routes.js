import express from "express"
import { deleteUser, updateUser , getAllUser, getUserById,getConfirmedApp,getCompletedAndCancelledApp,getPendingApp ,createMessage,getAllMessages} from "../controllers/users.controller.js";

const router = express.Router();
router.get("/",getAllUser);
router.get("/:id", getUserById);
router.patch("/:id",updateUser);
router.delete("/:id",deleteUser);
router.get("/:id/appointments/schedule", getConfirmedApp);
router.get("/:id/appointments/history", getCompletedAndCancelledApp);
router.get("/:id/appointments/requests",getPendingApp)
router.post("/:id/message/send",createMessage)
router.get("/:id/message/all",getAllMessages)


export default router