importScripts('https://cdn.socket.io/4.8.1/socket.io.min.js'); // Importer socket.io

let socket = null;

self.addEventListener('message', (event) => {
  console.log('Message reçu dans le service worker :', event.data); // Log pour déboguer

  if (event.data.type === 'INIT_SOCKET') {
    console.log('Initialisation du socket demandée'); // Log pour déboguer
    const { token } = event.data;

    // Initialiser le socket
    socket = io('ws://localhost:7777', {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Gestion des événements du socket
    socket.on('connect', () => {
      console.log('Connecté au serveur');
    });

    socket.on('message', (data) => {
      console.log('Message reçu :', data);
    });

    socket.on('notification', (data) => {
      console.log('Notification reçue :', data); // Log pour déboguer
      // Afficher la notification
      self.registration.showNotification(data.title, {
        body: data.message,
        icon: data.icon,
      });
    });
  } else if (event.data.type === 'UPDATE_TOKEN') {
    console.log('Mise à jour du token demandée'); // Log pour déboguer
    // Mettre à jour le token dans le socket
    if (socket) {
      socket.auth = { token: event.data.token };
      socket.connect();
    }
  }
});