// composables/useSocket.ts

import { io, Socket } from "socket.io-client";

// 🚨 ATTENTION : L'URL est ici en dur. Pour la production, utilisez les variables d'environnement (comme discuté précédemment).
// Mettez l'adresse où tourne votre serveur Fastify.
// const SOCKET_URL: string = "http://172.20.10.14:4000";
const SOCKET_URL: string = "http://10.137.98.82:4000";

// Déclaration de l'instance socket et de l'état de connexion
// Utilisation du type Socket pour une meilleure vérification TypeScript
let socket: Socket | null = null;

interface ActionPayload {
  type: string;
  [key: string]: any; // Permet d'ajouter d'autres propriétés (comme 'duration', 'score', etc.)
}

export function useSocket() {
  const webSocketStore = useWebSocket();
  if (!socket) {
    // Initialisation de la connexion singleton
    socket = io(SOCKET_URL, {
      autoConnect: false, // Connexion manuelle
    });

    // Gestion des événements d'état
    socket.on("connect", () => {
      webSocketStore.isConnected = true;
      console.log("Client Socket.io connecté (Nuxt).");
    });

    socket.on("disconnect", () => {
      webSocketStore.isConnected = false;
      console.log("Client Socket.io déconnecté (Nuxt).");
    });
  }

  // --- Fonctions d'Exposition ---

  const connect = () => {
    if (socket && !webSocketStore.isConnected) {
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  // Envoi de l'événement 'join-room' au serveur Fastify
  const joinRoom = (roomId: string) => {
    if (socket && webSocketStore.isConnected) {
      socket.emit("join-room", roomId);
    }
  };

  // Envoi de l'événement 'action-client' avec la structure { roomId, payload }
  const sendAction = (roomId: string, payload: ActionPayload) => {
    if (socket && webSocketStore.isConnected) {
      socket.emit("action-client", { roomId, payload });
    }
  };

  // Fonction pour écouter un événement (utile pour 'update-client')
  const on = (eventName: string, callback: (payload: any) => void) => {
    if (socket) {
      socket.on(eventName, callback);
    }
  };

  // Fonction pour arrêter l'écoute d'un événement
  const off = (eventName: string, callback: (payload: any) => void) => {
    if (socket) {
      socket.off(eventName, callback);
    }
  };

  return {
    socket,
    connect,
    disconnect,
    joinRoom,
    sendAction,
    on,
    off,
  };
}
