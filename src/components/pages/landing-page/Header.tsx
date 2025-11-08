"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import SigninButton from "@/components/pages/landing-page/SigninButton";
import Image from "next/image";
import { useEffect } from "react";


const Header = () => {
  const { data: session } = useSession();

  useEffect(()=>{
    if(typeof window!==window.undefined){
      fetch('api/tracker',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({path:window.location.pathname})
      })
    }   
  },[]);

  return (
    <div className="bg-gradient-to-br shadow-inner pb-10">
      {/* Top login bar */}
      <div className="flex justify-end px-6 pt-4">
        {session?.user ? (
          <div className="flex items-center gap-4">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt="profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="text-right text-gray-800">
              <p className="text-sm font-semibold">{session.user.name}</p>
              <p className="text-xs">{session.user.email}</p>
            </div>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
            >
              Logout
            </Button>
          </div>
        ) : (
          <SigninButton />
        )}
      </div>

      {/* Hero section */}
      <div className="text-center mt-10 px-4">
        <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-800 mb-6 tracking-tight leading-tight">
          Flood<span className="text-gray-600">Fill</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 font-medium">
          The ultimate color puzzle challenge. Fill the board in the fewest moves.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {["Strategic Thinking", "Quick Reflexes"].map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-300 text-gray-800 text-sm font-medium px-4 py-1 rounded-full shadow-sm border border-gray-400/40 hover:scale-105 transition-transform duration-200"
            >
              {tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Header;
