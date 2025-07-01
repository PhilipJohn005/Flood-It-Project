"use client"

import React from 'react'
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import SigninButton from "@/components/pages/landing-page/SigninButton";
import Image from "next/image";

const Header = () => {
    const { data: session, status } = useSession();

  return (
    <div>
      <header className="border-b shadow-lg p-4 bg-blue-600">
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
                <div className="text-white dark:text-black">
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
    </div>
  )
}

export default Header
