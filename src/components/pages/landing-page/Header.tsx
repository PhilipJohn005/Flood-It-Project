"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import SigninButton from "@/components/pages/landing-page/SigninButton";
import Image from "next/image";

const Header = () => {
  const { data: session } = useSession();

  return (
    <div>
      <header className="border-b shadow-lg p-4 bg-gray-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="font-bold text-2xl text-white">FloodFill Arena</h1>
          </div>
          <div>
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
                <div className="text-white text-right">
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
        </div>
      </header>

      <div className="text-center space-y-4 bg-gray-800">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 p-8 shadow-xl">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-gray-900">
            FloodFill
          </h1>
          <p className="text-lg sm:text-xl mb-6 text-gray-700">
            The ultimate color puzzle challenge! Fill the entire board with one
            color in the minimum moves possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-gray-300 px-3 py-1 rounded-full text-gray-800">Strategic Thinking</div>
            <div className="bg-gray-300 px-3 py-1 rounded-full text-gray-800">Quick Reflexes</div>
            <div className="bg-gray-300 px-3 py-1 rounded-full text-gray-800">High Scores</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
