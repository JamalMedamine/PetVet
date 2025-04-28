import express from "express"
import authRoutes from './routes/auth.routes.js'
import usersRoutes from "./routes/users.routes.js";
import vetRoutes from "./routes/vet.routes.js"
import petOwnerRoutes from "./routes/petOwnerRoutes.js"
import appointmentRoutes from "./routes/appointment.routes.js"
import { ENV_VARS } from "./config/enVars.js";
import bodyParser from "body-parser";

const PORT = ENV_VARS.PORT ;
const app = express();


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",usersRoutes);
app.use("/api/v1/vets",vetRoutes);
app.use("/api/v1/petOwners",petOwnerRoutes)
app.use("/api/v1/appointment",appointmentRoutes)


app.listen(PORT,()=>{
    console.log(`server listening to port ${PORT}`)
})
