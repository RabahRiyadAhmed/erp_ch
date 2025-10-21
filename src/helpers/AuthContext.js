import { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // auth est initialisé à null
  const [socket, setSocket] = useState(null);

  const connectSocket = (token) => {
    if (socket && socket.connected) return;

    const socketConnection = io('ws://localhost:7777', {
      extraHeaders: {
        Authorization: `Bearer ${token}`, // Envoyer le token dans le header
      },
    });
    setSocket(socketConnection);
    socketConnection.on('connect', () => {
      console.log('Connecté au serveur');
    });

    socketConnection.on('message', (data) => {
      console.log('Message reçu :', data);
    });

    socketConnection.on('notification', (data) => {
      console.log(data)
      if (Notification.permission === 'granted') {
        new Notification(data.title, {
          body: data.message,
          icon: data.icon,
        });
      }
      socketConnection.emit('notificationReceived',data)
    
     
    });

    
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      console.log('Déconnecté du serveur');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const data = localStorage.getItem('employeeData');
    const nbnotif = localStorage.getItem('nbnotif');

    if (token) {
      setAuth({ token, role, employeeData: JSON.parse(data), nbnotif: nbnotif ? nbnotif : 0 });
      connectSocket(token);
    } else {
      setAuth(false); // Met à jour pour indiquer que l'utilisateur n'est pas authentifié
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  const login = (token, role, employeeData, nbnotif = 0) => {
    setAuth({ token, role, employeeData, nbnotif });
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('employeeData', JSON.stringify(employeeData));
    localStorage.setItem('nbnotif', nbnotif);
    connectSocket(token);
  };

  const setNbnotif = (nbnotif) => {
    localStorage.setItem('nbnotif', nbnotif);
    setAuth((prevAuth) => ({ ...prevAuth, nbnotif }));
  };

  const logout = () => {
    setAuth(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nbnotif');
    localStorage.removeItem('employeeData');
    disconnectSocket();
  };

  const updateToken = (newToken) => {
    if (auth?.token === newToken) return;
    setAuth((prevAuth) => ({ ...prevAuth, token: newToken }));
    localStorage.setItem('token', newToken);

    if (socket) {
      socket.auth = { token: newToken };
      socket.connect();
    } else {
      connectSocket(newToken);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, socket, setNbnotif, login, logout, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};