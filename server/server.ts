import express from "express";
import http from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";
import cors from "cors";
import { DynamoDBClient, PutItemCommand,QueryCommand  } from "@aws-sdk/client-dynamodb";
 

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket", "polling"], // Explicitly enable both
  allowEIO3: true // For compatibility with older clients
});

const dynamo=new DynamoDBClient({region:"eu-north-1"})

// In-memory room store
type Player = { id: string; name: string };
type Room = {
  host: string;
  players: Player[];
  settings: { gridSize: number; colors: number; rounds: number };
  started: boolean;
};
const rooms: { [roomKey: string]: Room } = {};


console.log("Backend restarted. Cleared all rooms.");

const roomStats: { [roomKey: string]: any[] } = {};


io.on("connection", (socket) => {
  console.log("Connection Established:", socket.id);

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

    // Remove disconnected players
    room.players = room.players.filter(p => io.sockets.sockets.has(p.id));

    // Avoid duplicates
    if (!room.players.some(p => p.id === socket.id)) {
      room.players.push({ id: socket.id, name });
    }

    socket.join(roomKey);
    cb({ success: true });
    io.to(roomKey).emit("room-updated", room);

  });



  socket.on("player-finished",async({roomKey,playerId,name,moves,time})=>{
      const room = rooms[roomKey];

    if(!roomStats[roomKey])roomStats[roomKey]=[];

    const { colors,gridSize,rounds } = room.settings;


     const avgMoves = moves / rounds;
    const avgTime = time / rounds; // Keep in milliseconds!
    const colorFactor = 1 + (colors - 5) * 0.15; // 15% per extra color

     // FINAL SCORE (lower = better)
    const score = (avgMoves * 1e6 + avgTime) / colorFactor;



    roomStats[roomKey].push({id:playerId,name,moves,time,score});  //person has completed it locally so put in room

    const boardSize=`${gridSize}x${gridSize}`
    const dynamoParams={           //person has completed it locally so put in dynamodb as well
      TableName:"Flood-It-Leaderboard",
      Item:{
        boardSize:{S:boardSize},
        score:{N:score.toFixed(3)},
        username:{S:name},
        playerId: { S: playerId },
        moves: { N: moves.toString() },
        time: { N: time.toString() },
        timestamp: { N: Date.now().toString() },
        colors: { N: String(colors) }
      }}

      try{
        await dynamo.send(new PutItemCommand(dynamoParams));
        console.log("Success in inserting to DynamoDB");
      }catch(e){
        console.log("Error occured while inserting to dynamoDB"+e)
      }

    const numOfPlayers=io.sockets.adapter.rooms.get(roomKey)?.size || 0  //how many are currently playing

    if(roomStats[roomKey].length===numOfPlayers){
      io.to(roomKey).emit("leaderboard-update",roomStats[roomKey]);
      delete roomStats[roomKey];
    }
  })

  socket.on("get-leaderboard", async ({ boardSize, limit = 10 }, cb) => {
  const queryParams = {
    TableName: "Flood-It-Leaderboard",
    IndexName: "ScoreIndex", // Name of the GSI
    KeyConditionExpression: "boardSize = :boardSize",
    ExpressionAttributeValues: {
      ":boardSize": { S: boardSize }
    },
    ScanIndexForward: true, // ascending order (lower score = better)
    Limit: limit
  };

  try {
    const data = await dynamo.send(new QueryCommand(queryParams));
    const results = (data.Items || []).map(item => ({
      name: item.username.S,
      moves: Number(item.moves.N),
      time: Number(item.time.N),
      score: Number(item.score.N),
      boardSize:item.boardSize.S,
      playerId: item.playerId.S,
      colors:Number(item.colors.N)
    }));
    cb({ success: true, leaderboard: results });
  } catch (err) {
    console.error("Error querying leaderboard:", err);
    cb({ success: false, error: "Failed to fetch leaderboard" });
  }
});



  // Start game
  socket.on("start-game", (roomKey) => {
    const room = rooms[roomKey];
    if (room && socket.id === room.host) {
      // Remove stale sockets before starting
      room.players = room.players.filter(p => io.sockets.sockets.has(p.id));

      room.started = true;
      io.to(roomKey).emit("game-started", room.settings);
    }
  });

  socket.on("leave-room", ({ roomKey }) => {
    const room = rooms[roomKey];
    if (!room) return;

    room.players = room.players.filter(p => p.id !== socket.id);
    socket.leave(roomKey);

    // If no one left, delete room
    if (room.players.length === 0) {
      delete rooms[roomKey];
    }
  });


  // Handle disconnect
  socket.on("disconnect", () => {
    setTimeout(() => {
      for (const [roomKey, room] of Object.entries(rooms)) {
        room.players = room.players.filter((p) => p.id !== socket.id);
        if (room.players.length === 0) {
          delete rooms[roomKey];
        } else {
          io.to(roomKey).emit("room-updated", room);
        }
      }
    }, 5000); // wait 5 seconds before deleting room
  });

});

app.post("/insertSinglePlayer",async(req,res)=>{
  const {playerId,player,gridSize,rounds,colors,moves,endTime}=req.body;
  if (!playerId || !player || !gridSize || !rounds || !colors || moves == null || endTime == null) {
    res.status(400).json({ error: "Missing or invalid fields in body" });
    return;
  }

    const avgMoves = moves / rounds;
    const avgTime = endTime / rounds; // Keep in milliseconds!
    const colorFactor = 1 + (colors - 5) * 0.15; // 15% per extra color

    // FINAL SCORE (lower = better)
    const score = (avgMoves * 1e6 + avgTime) / colorFactor;


    const boardSize=`${gridSize}x${gridSize}`
    const dynamoParams={           
      TableName:"Flood-It-Leaderboard",
      Item:{
        boardSize:{S:boardSize},
        score:{N:score.toFixed(3)},
        username:{S:player},
        playerId: { S: playerId },
        moves: { N: moves.toString() },
        time: { N: endTime.toString() },
        timestamp: { N: Date.now().toString() },
        colors: { N: String(colors) }
      }}

      try{
        await dynamo.send(new PutItemCommand(dynamoParams));
        console.log("Success in inserting to DynamoDB");
        res.status(200).json({ message: "inserted into db" })
      }catch(e){
        console.log("Error occured while inserting to dynamoDB"+e);
        res.status(500).send("Failed to insert into DB");
      }

})

server.listen(4000, () => {
  console.log("Socket server running on port 4000");
});