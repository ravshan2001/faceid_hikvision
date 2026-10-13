import Queue from "bull";
import { syncing } from "../event.sync.js";

const eventQueue = new Queue("event-sync", {
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1',
    password: process.env.REDIS_PASSWORD
  }
});

eventQueue.process(2, async (job) => {
  try {
    await syncing(job.data);
  } catch (error) {
    console.error("Error processing job:", error);
  }
});

export default eventQueue;
