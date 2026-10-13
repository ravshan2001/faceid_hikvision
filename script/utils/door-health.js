import fetch from "node-fetch";
globalThis.fetch = fetch;

import https from "https";
import DigestFetch from "digest-fetch";
import mongoose from "mongoose";

// Door model
const DoorSchema = new mongoose.Schema({}, { strict: false, collection: "doors" });
const DoorModel = mongoose.models.door || mongoose.model("door", DoorSchema);

// ✅ HTTPS Agent
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  timeout: 5000,
});

// Auto HTTP/HTTPS
const devBase = (door) => {
  const useHttps = door.useHttps || door.port === 443 || door.port === "443";
  const protocol = useHttps ? "https" : "http";
  return `${protocol}://${door.ip}:${door.port}`;
};

/**
 * Test Hikvision device connection
 */
export const testDoorConnection = async (door) => {
  try {
    const useHttps = door.useHttps || door.port === 443 || door.port === "443";
    const client = new DigestFetch(door.login, door.password, useHttps ? { agent: httpsAgent } : {});
    
    const url = `${devBase(door)}/ISAPI/System/deviceInfo`;
    
    const fetchOptions = { 
      method: "GET",
      timeout: 5000
    };
    
    if (useHttps) {
      fetchOptions.agent = httpsAgent;
    }

    console.log(`[Health] Testing ${door.ip}:${door.port} (${useHttps ? 'HTTPS' : 'HTTP'})...`);
    
    const response = await client.fetch(url, fetchOptions);
    
    if (response.ok) {
      console.log(`[Health] ✅ ${door.ip}:${door.port} - ONLINE`);
      
      // Update doorStatus to online
      await DoorModel.updateOne(
        { _id: door._id },
        { $set: { doorStatus: "online" } }
      );
      
      return { success: true, status: "online" };
    } else {
      console.log(`[Health] ❌ ${door.ip}:${door.port} - HTTP ${response.status}`);
      
      await DoorModel.updateOne(
        { _id: door._id },
        { $set: { doorStatus: "offline" } }
      );
      
      return { success: false, status: "offline", error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error(`[Health] ❌ ${door.ip}:${door.port} - ${error.message}`);
    
    await DoorModel.updateOne(
      { _id: door._id },
      { $set: { doorStatus: "offline" } }
    ).catch(() => {});
    
    return { success: false, status: "offline", error: error.message };
  }
};

/**
 * Check all doors health
 */
export const checkAllDoorsHealth = async () => {
  try {
    const doors = await DoorModel.find({ 
      status: "active",
      isOpen: true 
    }).lean();

    console.log(`[Health] Checking ${doors.length} doors...`);

    const results = await Promise.all(
      doors.map(door => testDoorConnection(door))
    );

    const online = results.filter(r => r.success).length;
    const offline = results.filter(r => !r.success).length;

    console.log(`[Health] Summary: ${online} online, ${offline} offline`);

    return { online, offline, total: doors.length };
  } catch (error) {
    console.error("[Health] Error checking doors:", error);
    return { online: 0, offline: 0, total: 0, error: error.message };
  }
};
