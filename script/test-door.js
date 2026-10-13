import mongoose from "mongoose";
import { testDoorConnection } from "./utils/door-health.js";

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/new-hr-script";

async function testDoor() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected!");

    // Door model
    const DoorSchema = new mongoose.Schema({}, { strict: false, collection: "doors" });
    const DoorModel = mongoose.models.door || mongoose.model("door", DoorSchema);

    // Find door by IP
    const door = await DoorModel.findOne({ ip: "83.222.7.162" }).lean();

    if (!door) {
      console.error("❌ Door not found with IP: 83.222.7.162");
      process.exit(1);
    }

    console.log("\n📋 Door info:");
    console.log("  IP:", door.ip);
    console.log("  Port:", door.port);
    console.log("  Login:", door.login);
    console.log("  useHttps:", door.useHttps);
    console.log("  isOpen:", door.isOpen);
    console.log("  doorStatus:", door.doorStatus);

    console.log("\n🔍 Testing connection...");
    const result = await testDoorConnection(door);

    console.log("\n📊 Result:");
    console.log("  Success:", result.success);
    console.log("  Status:", result.status);
    if (result.error) {
      console.log("  Error:", result.error);
    }

    // Verify doorStatus updated
    const updatedDoor = await DoorModel.findOne({ ip: "83.222.7.162" }).lean();
    console.log("\n✅ Updated doorStatus:", updatedDoor.doorStatus);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testDoor();
