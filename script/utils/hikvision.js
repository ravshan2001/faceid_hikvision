import fetch from "node-fetch";
globalThis.fetch = fetch;

import https from "https";
import DigestFetch from "digest-fetch";
import FormData from "form-data";
import mongoose from "mongoose";

import { EventModel } from "../models/event.js";
import { UserModel as SyncedUserModel } from "../models/user.js";
import { syncedDoor, uploadFace } from "./request.js";
import { sleep } from "./service.js";

/**
 * SETTINGS (env)
 *  - SERVER_URI or PUBLIC_BASE_URL: public URL where face images are reachable
 *  - HIK_MAJOR / HIK_MINOR: event filter (default 5/75)
 *  - HIKVISION_USE_HTTPS: true/false (default: auto-detect from door.port)
 */
const PUBLIC_BASE = (process.env.PUBLIC_BASE_URL || process.env.SERVER_URI || "").replace(/\/+$/, "");
const HIK_MAJOR = Number(process.env.HIK_MAJOR || 5);
const HIK_MINOR = Number(process.env.HIK_MINOR || 75);

// ✅ HTTPS Agent - SSL sertifikat xatolarini ignore qiladi
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // self-signed sertifikatlar uchun
  keepAlive: true,
  timeout: 10000,
});

// --- helpers ---

// ✅ HTTP yoki HTTPS avtomatik aniqlash
const devBase = (door) => {
  // ✅ 7443 ham qo'shildi
  const useHttps = door.useHttps || 
                   door.port === 443 || door.port === "443" ||
                   door.port === 7443 || door.port === "7443";
  const protocol = useHttps ? "https" : "http";
  return `${protocol}://${door.ip}:${door.port}`;
};

const safeJson = (txt) => {
  try { return JSON.parse(txt); } catch { return null; }
};

const readText = async (res) => {
  try { return await res.text(); } catch { return ""; }
};

const buildFaceUrl = (userData) => {
  if (!PUBLIC_BASE) throw new Error("SERVER_URI (or PUBLIC_BASE_URL) is not set");
  const path = String(userData.faceUrl || "").replace(/^\/+/, "");
  if (!path) throw new Error("userData.faceUrl is empty");
  return `${PUBLIC_BASE}/${path}`;
};

const ensureEmployeeNo = (employeeNo) => {
  const v = String(employeeNo ?? "").trim();
  if (!v) return null;
  return v;
};

// API users collection
const ApiUserSchema = new mongoose.Schema(
  { employeeNo: mongoose.Schema.Types.Mixed },
  { strict: false, autoIndex: false, collection: "users" }
);
const ApiUserModel = mongoose.models.api_user || mongoose.model("api_user", ApiUserSchema);

// ✅ DigestFetch HTTPS bilan ishlash uchun
const createDigestClient = (login, password, useHttps) => {
  const options = {};
  
  if (useHttps) {
    options.agent = httpsAgent;
  }
  
  return new DigestFetch(login, password, options);
};

// --- 1) create/update user on device ---
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
};

const ensureUserExists = async (client, userData, useHttps) => {
  const emp = ensureEmployeeNo(userData.employeeNo);
  if (!emp) throw new Error("employeeNo is empty");

  let beginTime = new Date();
  let endTime = new Date();
  endTime.setFullYear(endTime.getFullYear() + 10);

  const payload = {
    UserInfo: {
      employeeNo: emp,
      name: String(userData.fullName || emp),
      userType: "normal",
      Valid: { enable: true, beginTime: formatDate(beginTime), endTime: formatDate(endTime), timeType: "local" },
      doorRight: "1",
      RightPlan: [{ doorNo: 1, planTemplateNo: "1" }],
      gender: userData.gender,
      localUIRight: false,
      maxOpenDoorTime: 0,
      userVerifyMode: "",
      floorNumbers: [],
      callNumbers: [],
    },
  };

  const url = `${devBase(userData.door)}/ISAPI/AccessControl/UserInfo/Record?format=json`;
  
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
  
  // ✅ HTTPS uchun agent qo'shamiz
  if (useHttps) {
    fetchOptions.agent = httpsAgent;
  }
  
  const res = await client.fetch(url, fetchOptions);

  if (res.ok) return { ok: true, existed: false };

  const txt = await readText(res);
  const j = safeJson(txt);

  if (j?.subStatusCode === "employeeNoAlreadyExist") return { ok: true, existed: true };

  const err = new Error(`Failed to create user: ${txt}`);
  err.hik = j || null;
  throw err;
};

// --- 2) upload face ---
const uploadFaceMultipart = async (client, userData, useHttps) => {
  const faceURL = buildFaceUrl(userData);

  // Download face image
  const imgFetchOptions = {};
  if (faceURL.startsWith("https://")) {
    imgFetchOptions.agent = httpsAgent;
  }
  
  const imgRes = await fetch(faceURL, imgFetchOptions);
  if (!imgRes.ok) throw new Error(`Cannot download face image: HTTP ${imgRes.status} (${faceURL})`);
  const imageNodeBuffer = Buffer.from(await imgRes.arrayBuffer());

  const emp = ensureEmployeeNo(userData.employeeNo);
  if (!emp) throw new Error("employeeNo is empty");

  const formData = new FormData();

  const faceDataForMultipart = {
    faceLibType: "blackFD",
    FDID: "1",
    FPID: emp,
    name: String(userData.fullName || emp),
  };

  formData.append("FaceDataRecord", JSON.stringify(faceDataForMultipart), {
    contentType: "application/json",
  });

  formData.append("img", imageNodeBuffer, {
    filename: "face.jpg",
    contentType: "image/jpeg",
  });

  const headers = formData.getHeaders();
  const contentLength = await new Promise((resolve, reject) => {
    formData.getLength((err, length) => (err ? reject(err) : resolve(length)));
  });
  headers["Content-Length"] = String(contentLength);

  const url = `${devBase(userData.door)}/ISAPI/Intelligent/FDLib/FaceDataRecord?format=json`;
  
  const fetchOptions = { 
    method: "POST", 
    body: formData, 
    headers,
    timeout: 30000  // ✅ 30 second timeout
  };
  
  // ✅ HTTPS agent qo'shish
  if (useHttps) {
    fetchOptions.agent = httpsAgent;
  }
  
  console.log(`[${emp}] Uploading face with ${useHttps ? 'HTTPS' : 'HTTP'} agent...`);
  
  const res = await client.fetch(url, fetchOptions);

  if (res.ok) return { ok: true };

  const txt = await readText(res);
  const j = safeJson(txt);
  const err = new Error(txt);
  err.hik = j || null;
  throw err;
};

// --- EXPORT: create user + face on device ---
export const newHikUser = async (userData) => {
  
  console.log(`[DEBUG] door object:`, JSON.stringify(userData.door, null, 2));
  console.log(`[DEBUG] door.useHttps = ${userData.door.useHttps}`);
  console.log(`[DEBUG] door.port = ${userData.door.port}`);

 const useHttps = userData.door.useHttps || userData.door.port === 443 || 
                   userData.door.port === "443" || userData.door.port === 7443 || 
                   userData.door.port === "7443";
   

  console.log(`[DEBUG] Calculated useHttps = ${useHttps}`);

  const client = createDigestClient(userData.door.login, userData.door.password, useHttps);
  const emp = ensureEmployeeNo(userData.employeeNo);

  try {
    if (!emp) throw new Error("employeeNo is empty");

    console.log(`[${emp}] Using ${useHttps ? 'HTTPS' : 'HTTP'} for ${userData.door.ip}:${userData.door.port}`);

    // 1) ensure user exists
    await ensureUserExists(client, userData, useHttps);
    await sleep(250);

    // 2) upload face
    console.log(`[${emp}] Upload face (multipart: FaceDataRecord + img)...`);
    await uploadFaceMultipart(client, userData, useHttps);

    await SyncedUserModel.findOneAndUpdate({ employeeNo: emp }, { employeeNo: emp }, { upsert: true });
    await syncedDoor(userData._id, userData.door._id, "success");
    console.log(`[${emp}] ✅ User + face OK`);
  } catch (error) {
    await syncedDoor(userData._id, userData.door._id, "error").catch(() => {});
    console.error(`[${emp || "?"}] Hikvision error:`, error?.message || error);
  }
};

// --- remove user ---
export const removeHikUser = async (door, employeeNo, isError) => {
  if (!employeeNo || String(employeeNo).trim() === "") {
    console.warn("removeHikUser: employeeNo empty, skipped");
    return;
  }
  const emp = ensureEmployeeNo(employeeNo);

  if (!emp) {
    console.warn("removeHikUser skipped: employeeNo empty");
    return;
  }

  try {
    const useHttps = door.useHttps || door.port === 443 || door.port === "443" || door.port === 7443 || door.port === "7443";
    const client = createDigestClient(door.login, door.password, useHttps);
    const data = { UserInfoDelCond: { EmployeeNoList: [{ employeeNo: emp }] } };

    const url = `${devBase(door)}/ISAPI/AccessControl/Userinfo/Delete?format=json`;
    
    const fetchOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    
    if (useHttps) {
      fetchOptions.agent = httpsAgent;
    }
    
    const response = await client.fetch(url, fetchOptions);

    if (!response.ok) {
      const txt = await readText(response);
      throw new Error(`Failed to remove user: ${txt}`);
    }

    if (!isError) await syncedDoor(emp, door._id, "removed").catch(() => {});
  } catch (e) {
    console.error("removeHikUser error:", e?.message || e);
  }
};

// --- EVENTS sync ---
// YANGI — attendanceStatus asosida

// YANGI — barcha Hikvision attendance statuslari + inOutStatus field
const mapAction = (d) => {
  const s = d?.attendanceStatus;
  if (s === "checkIn"  || s === "breakIn"  || s === "overtimeIn")  return "enter";
  if (s === "checkOut" || s === "breakOut" || s === "overtimeOut") return "exit";

  // Ba'zi firmware versiyalarda inOutStatus ishlatiladi (0=kirish, 1=chiqish)
  if (d?.inOutStatus === 0 || d?.inOutStatus === "0") return "enter";
  if (d?.inOutStatus === 1 || d?.inOutStatus === "1") return "exit";

  // Eski fallback
  if (d?.type === 0) return "enter";
  if (d?.type === 1) return "exit";
  return "enter";
};

/**
 * Fetch events from a single Hikvision door
 */
const getHikEvents = async (door, requestData) => {
  const useHttps = door.useHttps || 
                   door.port === 443 || door.port === "443" ||
                   door.port === 7443 || door.port === "7443";
  
  const client = createDigestClient(door.login, door.password, useHttps);

  const url = `${devBase(door)}/ISAPI/AccessControl/AcsEvent?format=json`;
  
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
    timeout: 10000  // ✅ 10 second timeout
  };
  
  // ✅ HTTPS agent qo'shish
  if (useHttps) {
    fetchOptions.agent = httpsAgent;
  }

  const response = await client.fetch(url, fetchOptions);
  const responseBody = await response.json();
  const list = responseBody?.AcsEvent?.InfoList || [];

// YANGI — attendanceStatus farqli bo'lsa ikkisini ham saqlaydi
	const filtered = list
	  .filter((d) => d.currentVerifyMode !== "invalid" && d.employeeNoString)
	  .sort((a, b) => new Date(a.time) - new Date(b.time))
	  .filter((d, idx, arr) => {
	    const next = arr[idx + 1];
	    if (!next) return true;
	    if (d.employeeNoString !== next.employeeNoString) return true;
	    if (new Date(next.time) - new Date(d.time) > 60000) return true;
	    // checkIn vs checkOut — ikkisini ham saqla
	    if (d.attendanceStatus !== next.attendanceStatus) return true;
	    return false;
	  });	

  const resData = await Promise.all(
    filtered.map(async (d) => {
      const apiUser = await ApiUserModel.findOne({ employeeNo: d.employeeNoString }, "_id").lean();
      if (!apiUser?._id) return null;

      const action = mapAction(d);

      const exists = await EventModel.findOne(
	  {
	    door: door._id,
	    employeeNoString: d.employeeNoString,
	    action: action,   // ← faqat bir xil action bo'lsa duplicate
	    time: { $gte: new Date(new Date(d.time).getTime() - 60000), $lte: new Date(new Date(d.time).getTime() + 60000) },
	  },
	  "_id"
	).lean();

      if (exists?._id) return null;

      let finalPicture = null;
      if (d.pictureURL) {
        const parseUrl = new URL(d.pictureURL);
        const path = encodeURI(parseUrl.pathname + parseUrl.search);
        const imgUrl = `${devBase(door)}${path}`;

        const imgFetchOptions = { method: "GET" };
        
        // ✅ HTTPS agent qo'shish (image download uchun)
        if (useHttps) {
          imgFetchOptions.agent = httpsAgent;
        }

        const fileResponse = await client.fetch(imgUrl, imgFetchOptions);
        if (fileResponse.ok) {
          const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());
          const uploadRes = await uploadFace(fileBuffer);
          finalPicture = uploadRes?.data || null;
        }
      }
       
     
      const type = finalPicture ? "face" : "card";
      

      await EventModel.create({
        type,
        action,
        time: new Date(d.time),
        user: apiUser._id,
        door: door._id,
        employeeNoString: d.employeeNoString,
        serialNo: d.serialNo,
        pictureURL: finalPicture,
      });

      return {
        type,
        action,
        time: d.time,
        employeeNoString: d.employeeNoString,
        serialNo: d.serialNo,
        pictureURL: finalPicture,
      };
    })
  );

  const clean = resData.filter(Boolean);
  return { [door._id]: clean };
};

/**
 * Sync events from Hikvision devices
 */
export const hikEventsSync = async (doors, offset, { start, end }) => {
  const requestData = {
    AcsEventCond: {
      searchID: "1",
      searchResultPosition: offset,
      maxResults: 20,
      major: HIK_MAJOR,
      minor: HIK_MINOR,
      startTime: start,
      endTime: end,
      timeReverseOrder: true,
    },
  };

  const eventRes = await Promise.all(doors.map((door) => getHikEvents(door, requestData)));

  return eventRes
    .filter(Boolean)
    .reduce((acc, curr) => {
      const [doorId, events] = Object.entries(curr)[0];
      acc[doorId] = events;
      return acc;
    }, {});
};
