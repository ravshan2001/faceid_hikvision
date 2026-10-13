import dotenv from "dotenv";
dotenv.config();

import { socketCon } from "./socket.io.js";
import { appCronSchedule } from "./utils/cron.js";
import { connect } from "mongoose";

(async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log('MongoDB connected!');

    socketCon(); // await yo'q - background'da ishlaydi
    
    await appCronSchedule();
    console.log(`Server is running!`);
  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
})();
