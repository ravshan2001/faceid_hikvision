import { UserModel } from "../models/user.js";
import { EventModel } from "../models/event.js";
import { getAllDoors, getAllOpenDoors, getUsersNotSynced } from "./request.js";

// ✅ FAQAT HIKVISION
import { hikEventsSync, newHikUser, removeHikUser } from "./hikvision.js";
import { getSocket } from "../socket.io.js";

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Add new user to Hikvision device
 */
export const addUser = async (userData) => {
  try {
    await newHikUser(userData);
  } catch (error) {
    console.error("Service addUser error:", error);
  }
};

/**
 * Update existing user on Hikvision device
 */
export const updateUser = async (userData) => {
  try {
    console.log("Hikvision update: remove and re-add");
    await removeHikUser(userData.door, userData.employeeNo);
    await sleep(500);
    await newHikUser(userData);
  } catch (error) {
    console.error("Service updateUser error:", error);
  }
};

/**
 * Sync user list
 */
export const syncUser = async () => {
  try {
    let { data, status } = await getUsersNotSynced();
    if (status === 200) {
      for (const value of data) {
        await UserModel.findOneAndUpdate(
          { employeeNo: value.employeeNo },
          { employeeNo: value.employeeNo },
          { upsert: true }
        );
      }
    }
  } catch (error) {
    console.error("Service syncUser error:", error);
  }
};

/**
 * Remove user from Hikvision device
 */
export const removeUser = async (door, employeeNo) => {
  try {
    await removeHikUser(door, employeeNo);
  } catch (error) {
    console.error("Service removeUser error:", error);
  }
};

/**
 * Format date for Hikvision API
 * Hikvision expects: "2025-03-17T14:30:00+05:00"
 */
const formatHikDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}+05:00`;
};

/**
 * Fetch events from Hikvision devices
 */
export const getEvents = async (start, end, type, offset, syncDoors) => {
  try {
    let response = null;
    
    if (process.env.MODE === "APP") {
      response = await getAllDoors();
    } else if (process.env.MODE === "SCRIPT") {
      response = await getAllOpenDoors();
    }

    if (!response || response.status !== 200) {
      console.log("Doors not available:", response?.status);
      return {};
    }

    // Hikvision date format
    const hikStart = formatHikDate(new Date(start));
    const hikEnd = formatHikDate(new Date(end));

    if (type === "sync") {
      // Manual sync
      let io = await getSocket();
      let totalSaved = 0;

      for (const door of syncDoors) {
        const doorEvents = await hikEventsSync([door], offset, { 
          start: hikStart, 
          end: hikEnd 
        });

        const count = Object.values(doorEvents).flat().length;
        totalSaved += count;
        console.log(`[SYNC] Door ${door.ip}: ${count} events`);
        await new Promise((res) => setTimeout(res, 1500));
      }

      if (totalSaved === 0) {
        console.log("Sync completed - no new events");
        io.emit("sync-end", "sync-end");
        return {};
      }

      const nextOffset = offset + 20;
      setTimeout(async () => {
        await eventSync(start, end, nextOffset, syncDoors);
      }, 2000);

      io.emit("new-events", { count: totalSaved });
      return {};

    } else {
      // Automatic sync (cron)
      let doors = response.data;
      let totalSaved = 0;

      for (const door of doors) {
        try {
          const doorEvents = await hikEventsSync([door], 0, { 
            start: hikStart, 
            end: hikEnd 
          });

          const count = Object.values(doorEvents).flat().length;
          totalSaved += count;
          
          if (count > 0) {
            console.log(`[CRON] Door ${door.ip}: ${count} new events`);
          }
        } catch (doorError) {
          console.error(`[CRON] Door ${door.ip} error:`, doorError.message);
        }
        
        await new Promise((res) => setTimeout(res, 1000));
      }

      if (totalSaved > 0) {
        console.log(`[CRON] Total: ${totalSaved} events saved`);
        try {
          let io = await getSocket();
          io.emit("new-events", { count: totalSaved });
        } catch (e) {
          // Socket not connected
        }
      }

      return {};
    }
  } catch (error) {
    console.error("Service getEvents error:", error);
    return {};
  }
};

/**
 * Trigger manual event sync
 */
export const eventSync = async (start, end, offset, syncDoors) => {
  try {
    await getEvents(start, end, "sync", offset, syncDoors);
  } catch (error) {
    console.error("Service eventSync error:", error);
  }
};
