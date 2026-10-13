import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import { createServer } from "http";

import { ErrorMiddleware } from "./middleware/error.js";
import PassportAuth from "./middleware/auth.js";
import Router from "./routes.js";

import { scheduleCron } from "./utils/cron.js";
import { initializeRedis } from "./utils/redis.js";
import { initSocket } from "./utils/socket.io.js"

import { logger, auth } from "./middleware/logger.js";

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(PassportAuth.initialize());
app.use(auth, logger);
app.use('/files', express.static('files'));
app.use(Router);
app.use(ErrorMiddleware);

(async () => {
  try {
    await initializeRedis();
    await connect(process.env.MONGO_URI);
    console.log('MongoDB connected!');

    server.listen(process.env.PORT, () => {
      console.log(`Server is running on PORT: ${process.env.PORT}`);
      initSocket(server);
      console.log('✅ Socket.io initialized');
    });

    scheduleCron();
  } catch (error) {
    console.error(error);
  }
})();
