"use client";

import Header from "@/components/pages/landing-page/Header";
import Afterheader from "@/components/pages/landing-page/Afterheader";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Ellipsis } from "lucide-react";

export default function LoginForm() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <div className="bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Ellipsis className="w-10 h-10 text-white animate-spin" />
        </div>

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
