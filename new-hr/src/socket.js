import { reactive } from 'vue'
import { io } from 'socket.io-client'
import cookies from 'vue-cookies'

export const state = reactive({
  connected: false
})

const URL = import.meta.env.VITE_URL
// const URL = `http://192.168.24.142:4100`
// const URL = `http://localhost:3004`
// const URL = 'http://192.168.100.137:4100'



export const socket = io(URL, {
  extraHeaders: {
    Authorization:  `Bearer ${cookies.get('access-token')}`
  },
  withCredentials: true
})




export const connectSocket = () => {
  if (!state.socket) {
    state.socket = io(URL, {
      extraHeaders: {
        Authorization: `Bearer ${cookies.get("access-token")}`,
      },
      withCredentials: true,
    });

    state.socket.on("connect", () => {
      console.log("stateSocket", state.socket);
      
      state.connected = true;
      console.log("Socket ulandi!");
    });

    state.socket.on("disconnect", () => {
      state.connected = false;
      console.log("Socket uzildi!");
    });
  }
};


export const disconnectSocket = () => {
  if (state.socket) {
    state.socket.disconnect();
    state.socket = null;
    state.connected = false;
    console.log("Socket uzildi va o'chirildi.");
  }
};