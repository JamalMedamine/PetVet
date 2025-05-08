const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function startAppointmentChecker() {
  cron.schedule("*/10 * * * * *", async () => {
    const now = new Date();

    try {
      const appointments = await prisma.appointment.findMany({
        where: {
          status: "confirmed"
        },
      });

      for (const appt of appointments) {
        const endTime = new Date(appt.date.getTime() + 60 * 60 * 1000); 

        if (now >= endTime) {
          await prisma.appointment.update({
            where: { id: appt.id },
            data: { status: "completed" },
          });
          console.log(`Appointment ${appt.id} marked as completed`);
        }
      }
    } catch (error) {
      console.error("Error in appointment checker:", error);
    }
  });
}

module.exports = startAppointmentChecker;
