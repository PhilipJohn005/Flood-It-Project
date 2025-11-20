import { io, type Socket } from "socket.io-client";

let socket: Socket;

export function getSocket(): Socket {
  if (!socket) {
    console.log(" Initializing socket connection...");
    
    socket = io("https://flood-it-backend.duckdns.org", {
      transports: ["polling", "websocket"],
      upgrade: true,
      rememberUpgrade: true,
      secure: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      randomizationFactor: 0.5,
      timeout: 20000
    });

    // Connection lifecycle events
    socket.on("connect", () => {
      console.log(" Connected with ID:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log(" Disconnected:", reason);
      if (reason === "io server disconnect") {
        socket.connect(); 
      }
    });

    socket.on("connect_error", (err) => {
      console.error(" Connection error:", err.message);
      setTimeout(() => socket.connect(), 5000); 
    });

    socket.on("upgrade", (transport) => {
      console.log(" Transport upgraded to:", transport.name);
    });

    // Debug all events (remove in production)
    if (process.env.NODE_ENV === "development") {
      socket.onAny((event, ...args) => {
        console.debug("[Socket.IO]", event, args);
      });
    }
  }
  
  return socket;
}