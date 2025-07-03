"use client";

import React, { useState } from "react";
import { Key } from "lucide-react";
import io from "socket.io-client";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";

const Joinroom = () => {
  const [roomKey, setRoomKey] = useState("");
  const [name]=useState("john");
  const [username,setUsername]=useState("");

  const router=useRouter();


  const socket=getSocket();


  const handleJoinRoom = () => {  
     router.push(`/multi-player/${roomKey}?name=${name}`);
  };

  return (
    <div className="rounded-xl p-6 border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
          <Key size={20} className="text-slate-300" />
        </div>
        <h2 className="text-xl font-medium">Join Existing Room</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Room Key
          </label>
          <input
            type="text"
            value={roomKey}
            onChange={(e) => setRoomKey(e.target.value)}
            placeholder="Enter 6-character room key"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none transition-colors text-center font-mono tracking-wider"
            maxLength={6}
          />
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <h3 className="text-sm font-medium mb-3">
            How to Join
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className=" mt-0.5">1.</span>
              <span>Get a room key from someone who created a room</span>
            </div>
            <div className="flex items-start gap-2">
              <span className=" mt-0.5">2.</span>
              <span>Enter the 6-character key above</span>
            </div>
            <div className="flex items-start gap-2">
              <span className=" mt-0.5">3.</span>
              <span>Click join to start collaborating</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleJoinRoom}
          disabled={!roomKey.trim() || roomKey.length !== 6}
          className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Joinroom;
