// lib/socket.ts
import io from "socket.io-client";

let socket: SocketIOClient.Socket;

export function getSocket(): SocketIOClient.Socket {
  if (!socket) {
    socket = io("http://16.171.42.229:4000");
  }
  return socket;
}
