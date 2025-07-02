import express from "express";
import http from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";
import cors from "cors";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // use actual frontend domain in prod
  },
});

// In-memory room store
type Player = { id: string; name: string };
type Room = {
  host: string;
  players: Player[];
  settings: { gridSize: number; colors: number; rounds: number };
  started: boolean;
};
const rooms: { [roomKey: string]: Room } = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Create room
  socket.on("create-room", ({ name, gridSize, colors, rounds }, cb) => {
    const roomKey = nanoid(6);
    rooms[roomKey] = {
      host: socket.id,
      players: [{ id: socket.id, name }],
      settings: { gridSize, colors, rounds },
      started: false,
    };
    socket.join(roomKey);
    cb({ roomKey });
    io.to(roomKey).emit("room-updated", rooms[roomKey]);
  });

  // Join room
  socket.on("join-room", ({ roomKey, name }, cb) => {
    const room = rooms[roomKey];
    if (!room || room.started) return cb({ error: "Room not found or already started" });

    room.players.push({ id: socket.id, name });
    socket.join(roomKey);
    cb({ success: true });
    io.to(roomKey).emit("room-updated", room);
  });

  // Start game
  socket.on("start-game", (roomKey) => {
    const room = rooms[roomKey];
    if (room && socket.id === room.host) {
      room.started = true;
      io.to(roomKey).emit("game-started", room.settings);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    for (const [roomKey, room] of Object.entries(rooms)) {
      room.players = room.players.filter((p) => p.id !== socket.id);
      if (room.players.length === 0) {
        delete rooms[roomKey];
      } else {
        io.to(roomKey).emit("room-updated", room);
      }
    }
  });
});

server.listen(3001, () => {
  console.log("Socket server running on port 3001");
});
