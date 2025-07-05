import React from 'react'

interface Player {
  id: string;
  name: string;
}
interface Room {
  host: string;
  players: Player[];
  settings: { gridSize: number; colors: number; rounds: number };
  started: boolean;
}
type RoomInfoProps = {
  roomKey: string | string[];
  gridSize: number;
  colors: number;
  rounds: number;
  room?: Room | null;
};

const RoomInfo: React.FC<RoomInfoProps> = ({ roomKey, gridSize, colors, rounds, room }) => {
  return (
    <div>
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">Room Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Room Key</span>
                  <span className="font-mono">{roomKey}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Grid Size</span>
                  <span>{gridSize}×{gridSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Colors</span>
                  <span>{colors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rounds</span>
                  <span>{rounds}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Online</span>
                  <span className="text-green-400">{room?.players?.length ?? 1}</span>
                </div>
              </div>
            </div>
    </div>
  )
}

export default RoomInfo
