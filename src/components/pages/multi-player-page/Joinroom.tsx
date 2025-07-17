"use client";

import React, { useState } from "react";
import { Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";

const Joinroom = () => {
  const [roomKey, setRoomKey] = useState("");
  const {data:session}=useSession();


  const name=session?.user?.name ?? "Guest";

  const router = useRouter();
  const socket = getSocket();

  const handleJoinRoom = () => {
    router.push(`/multi-player/${roomKey}?name=${name}`);
  };

  return (
    <div className="rounded-xl p-6 border border-gray-300 bg-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
          <Key size={20} className="text-gray-200" />
        </div>
        <h2 className="text-xl font-medium text-gray-900">Join Existing Room</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Room Key</label>
          <input
            type="text"
            value={roomKey}
            onChange={(e) => setRoomKey(e.target.value)}
            placeholder="Enter 6-character room key"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none text-center font-mono tracking-wider"
            maxLength={6}
          />
        </div>

        <div className="bg-gray-200 rounded-lg p-4 border border-gray-300">
          <h3 className="text-sm font-medium mb-3 text-gray-700">How to Join</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="mt-0.5">1.</span>
              <span>Get a room key from someone who created a room</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">2.</span>
              <span>Enter the 6-character key above</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">3.</span>
              <span>Click join to start collaborating</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleJoinRoom}
          disabled={!roomKey.trim() || roomKey.length !== 6}
          className="w-full bg-gray-700 hover:bg-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Joinroom;
