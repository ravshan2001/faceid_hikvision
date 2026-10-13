import dotenv from "dotenv";
dotenv.config();

import FormData from "form-data";
import axios, { isAxiosError } from "axios";
import https from 'https';

const uri = process.env.SERVER_URI;

const httpsAgent = new https.Agent({ keepAlive: true });

const instance = axios.create({
  httpsAgent,
  timeout: 10000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": process.env.MODE === "SCRIPT"
        ? "Bearer SCRIPT"
        : process.env.TOKEN,
  }
});

const apiRequest = async (config) => {
  try {
    const response = await instance.request(config); // 🔁 используем instance
    return { data: response.data, status: response.status, message: "ok" };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        error: {
          data: error.response.data,
          message: "Api error",
        },
      };
    } else {
      console.error(error);
      return {
        status: 500,
        error: {
          message: "Server error",
        },
      };
    }
  }
};

// ⬇️ Заголовки не нужны — instance уже содержит их

export const getAllDoors = async () => {
  return await apiRequest({
    url: `${uri}/api/door`,
    method: "GET",
  });
};

export const getAllOpenDoors = async () => {
  return await apiRequest({
    url: `${uri}/api/door/open-doors`,
    method: "GET",
  });
};

export const syncedDoor = async (userId, doorId, status) => {
  return await apiRequest({
    url: `${uri}/api/door/post-sync`,
    method: "POST",
    data: { userId, doorId, status },
  });
};

export const getUsersNotSynced = async () => {
  return await apiRequest({
    url: `${uri}/api/door/user-not-synced`,
    method: "GET",
  });
};

export const openDoorsUsersNotSynced = async (doors) => {
  return await apiRequest({
    url: `${uri}/api/door/open-doors/user-not-synced`,
    method: "POST",
    data: doors,
  });
};

export const uploadFace = async (buffer) => {
  const formData = new FormData();
  const filename = `${Date.now()}.jpg`;
  formData.append("file", buffer, filename);

  return await instance.request({ // ⬅️ можно и instance здесь
    url: `${uri}/upload/script-photo/event`,
    method: "POST",
    data: formData,
    headers: formData.getHeaders(), // ⬅️ обязательно
  });
};

export const eventExists = async (data) => {
  return await apiRequest({
    url: `${uri}/api/door/exists-event`,
    method: "POST",
    data,
  });
};
