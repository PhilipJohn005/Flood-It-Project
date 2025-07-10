"use client";

import Header from "@/components/pages/landing-page/Header";
import Afterheader from "@/components/pages/landing-page/Afterheader";
import { useSession } from "next-auth/react";
import { useState } from "react";


export default function LoginForm() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <div className="bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 min-h-screen">
      {loading ? (
        <div className="text-center py-10 text-white text-xl">Loading...</div>
      ) : (
        <div>
          <Header />
          <div className="p-4">
            <Afterheader />
          </div>
        </div>
      )}
    </div>
  );
}
