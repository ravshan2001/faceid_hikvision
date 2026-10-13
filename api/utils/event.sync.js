import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { DoorModel } from "../models/settings/door.js";
import { UserModel } from "../models/data/user.js";
import { EventModel } from "../models/data/event.js";
import { getIo } from "./socket.io.js";
import { Worker } from "worker_threads";

const __dirname = dirname(fileURLToPath(import.meta.url));

const populateOptions = [
  {
    path: "user",
    select: "fullName department faceUrl",
    populate: { path: "department", select: "-_id name type" }
  },
  {
    path: "door",
    select: "branch title",
    populate: { path: "branch", select: "-_id title" }
  }
];

export const syncing = async (data) => {
  try {
    const workerPath = join(__dirname, "workers/door-worker.js");
    const worker = new Worker(workerPath, { workerData: data });

    worker.on("message", async (rawEvents) => {
      let toInsert = await Promise.all(rawEvents.map(async (event) => {
        let findUser = await UserModel.findOne({ employeeNo: event.employeeNoString }, "_id");
        if (!findUser) return null;

        let duplicate = event?.time ? await EventModel.findOne({
          time: {
            $gte: new Date(new Date(event.time).getTime() - 60000),
            $lte: new Date(new Date(event.time).getTime() + 60000)
          },
          door: event.door,
          user: findUser._id
        }) : null;
        if (duplicate) return null;

        let findDoor = await DoorModel.findById(event.door, "-_id type").lean();
        if (!findDoor) return null;

        return { ...event, user: findUser._id, action: findDoor.type };
      }));

      toInsert = toInsert.filter(Boolean);
      if (!toInsert.length) return;

      const saved = await EventModel.insertMany(toInsert);

      // Populate qilib frontendga to'liq ma'lumot bilan jo'natish
      const populated = await EventModel.find(
        { _id: { $in: saved.map(e => e._id) } },
        "type action time user door pictureURL employeeNoString"
      )
        .populate(populateOptions)
        .sort({ time: -1 })
        .lean();

      const io = await getIo();
      io.emit("new-events", { count: populated.length, events: populated });

      // Security: faqat o'z eshigidagi eventlar
      const uniqueDoorIds = [...new Set(toInsert.map(e => e.door.toString()))];
      for (const doorId of uniqueDoorIds) {
        const findSecurity = await UserModel.findOne({ role: "security", door: doorId }, "_id").lean();
        if (findSecurity) {
          const doorEvents = populated.filter(e => e.door?._id?.toString() === doorId);
          io.to(findSecurity._id.toString()).emit("new-events", { count: doorEvents.length, events: doorEvents });
        }
      }
    });

    worker.on("error", (error) => { console.error("Worker error:", error); });
    worker.on("exit", (code) => { if (code !== 0) console.error(`Worker exit code ${code}`); });
  } catch (error) {
    console.error("syncing error:", error);
  }
};
