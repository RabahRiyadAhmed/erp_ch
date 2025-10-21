import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

const initialState = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  employeeData: JSON.parse(localStorage.getItem('employeeData')) || null,
  nbnotif: localStorage.getItem('nbnotif') || 0,
  //socket: null,
  notifications: [], // Ajout d'un tableau pour stocker les notifications
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, role, employeeData, nbnotif } = action.payload;
      state.token = token;
      state.role = role;
      state.employeeData = employeeData;
      state.nbnotif = nbnotif || 0;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('employeeData', JSON.stringify(employeeData));
      localStorage.setItem('nbnotif', nbnotif || 0);

      /*if (!state.socket) {
        if (Notification.permission === "default") {
          Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
              console.warn("Notifications non autorisées");
            }
          });
        }

        const socket = io(`${process.env.REACT_APP_API_URL}`, {
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        socket.on('connect', () => {
          console.log('Connecté au serveur');
        });

        socket.on('message', (data) => {
          console.log('Message reçu :', data);
        });

        socket.on('notification', (data) => {
          if (Notification.permission === 'granted') {
            new Notification(data.title, {
              body: data.message,
              icon: data.icon,
            });
          }

          state.notifications.unshift(data);
          state.nbnotif += 1;
        });
        state.socket = socket;
      }*/
    },
    logout: (state) => {
      /*if (state.socket) {
        state.socket.off();
        state.socket.disconnect();
        state.socket = null;
      }*/

      state.token = null;
      state.role = null;
      state.employeeData = null;
      state.nbnotif = 0;
      state.notifications = []; // Réinitialiser les notifications

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('employeeData');
      localStorage.removeItem('nbnotif');
    },
    setNbnotif: (state, action) => {
      state.nbnotif = action.payload;
      console.log(state.nbnotif)
      localStorage.setItem('nbnotif', parseInt(state.nbnotif));
    },
    updateToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);

      /*if (state.socket) {
        state.socket.auth = { token: action.payload };
        state.socket.connect();
      }*/
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload); // Ajouter une notification
      state.nbnotif += 1; // Incrémenter le nombre de notifications
    },
    clearNotifications: (state) => {
      state.notifications = []; // Réinitialiser les notifications
      state.nbnotif = 0; // Réinitialiser le compteur de notifications
    },
  },
});

export const { login, logout, setNbnotif, updateToken, addNotification, clearNotifications } = authSlice.actions;
export default authSlice.reducer;