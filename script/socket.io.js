import { io } from "socket.io-client";
import { sleep, addUser, updateUser, removeUser, syncUser, eventSync } from "./utils/service.js";

let socket = null;

export const socketCon = () => {
  socket = io(process.env.SERVER_URI, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    timeout: 20000,
    transports: ['websocket', 'polling'],
    extraHeaders: {
      Authorization: process.env.MODE === "SCRIPT" ? "Bearer SCRIPT" : process.env.TOKEN,
    }
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected to API server");
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });

  socket.on("error", (error) => {
    console.error("❌ Socket error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.warn("⚠️  Socket disconnected:", reason);
    if (reason === "io server disconnect") {
      socket.connect();
    }
  });

  socket.on("new-user", async (data) => {
    await sleep(1500);
    console.log(`[Socket] New user request: ${data.fullName} (${data.employeeNo})`);
    await addUser(data);
  });

  socket.on("update-user", async (data) => {
    await sleep(1500);
    console.log(`[Socket] Update user request: ${data.fullName} (${data.employeeNo})`);
    await updateUser(data);
  });

  socket.on("start-user-sync", async () => {
    console.log("[Socket] Starting user sync...");
    await syncUser();
  });

  socket.on("user-remove", async ({ door, employeeNo }) => {
    console.log(`[Socket] User remove request: ${employeeNo}`);
    await removeUser(door, employeeNo);
  });

  socket.on("event-sync", async ({ start, end, door }) => {
    console.log(`[Socket] Manual event sync: ${start} → ${end}`);
    await eventSync(start, end, 0, door);
  });
};

export const getSocket = () => {
  return new Promise((resolve, reject) => {
    if (socket) {
      resolve(socket);
    } else {
      console.error("Socket.io not initialized");
      reject("Socket.io not initialized");
    }
  });
};
