// lib/socket.ts
import io from "socket.io-client";

let socket: SocketIOClient.Socket;

export function getSocket(): SocketIOClient.Socket {
  if (!socket) {
    socket = io("https://flood-it-backend.duckdns.org", { //connects to ec2 backend port 4000   this is ec2->http://16.171.42.229 and this is port on ec2 where the backend running->4000
    transports: ["websocket"],
    secure: true
});

  }
  return socket;
}
