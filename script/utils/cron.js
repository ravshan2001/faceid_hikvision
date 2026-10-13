import { schedule } from "node-cron";
import { getEvents } from "./service.js";
import { checkAllDoorsHealth } from "./door-health.js";

export const appCronSchedule = async () => {
  // Har 30 soniyada — oxirgi 35 soniyalik window (5s zapas)
  schedule("*/30 * * * * *", async () => {
    const end = new Date();
    const start = new Date(end.getTime() - 35 * 1000);
    console.log(`[CRON] Fetching events ${start.toLocaleTimeString('uz-UZ')} → ${end.toLocaleTimeString('uz-UZ')}`);
    await getEvents(start, end, "normal", 0);
  });

  console.log("✅ Cron scheduled: event sync every 30 seconds (35s window)");

  schedule("*/10 * * * * *", async () => {
    await checkAllDoorsHealth();
  });

  console.log("✅ Cron scheduled: door health check every 10 seconds");

  setTimeout(async () => {
    console.log("[Health] Running initial door health check...");
    await checkAllDoorsHealth();
  }, 3000);
};
