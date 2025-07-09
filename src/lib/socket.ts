// lib/socket.ts
import io from "socket.io-client";

let socket: SocketIOClient.Socket;

export function getSocket(): SocketIOClient.Socket {
  if (!socket) {
    socket = io("http://16.170.202.4:4000");
  }
  return socket;
}
