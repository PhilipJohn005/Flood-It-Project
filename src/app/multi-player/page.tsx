"use client"

import React from 'react';
import Createroom from '@/components/pages/multi-player-page/Createroom';
import Joinroom from '@/components/pages/multi-player-page/Joinroom';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const page = () => {
  const {data:session,status}=useSession()

  useEffect(()=>{
    fetch('/api/tracker',{
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        path: window.location.pathname,
        user: session?.user?.name || null,
        email: session?.user?.email || null,
        uid: session?.user?.id || null
      }),
    }).catch((err)=>console.error("Tracking failed. The error is ->" + err));
  },[])

  return (
    <div className='min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600'>
      <div className='max-w-4xl mx-auto'>

        <div className="mb-8">
          <Link href={"/"}>
            <button className="inline-flex items-center gap-2  hover:text-gray-100 transition-colors mb-6 group cursor-pointer">
              <ArrowLeft size={18} />
              Back to Home
            </button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">Setup Canvas</h1>
          <p className="">Create a new room or join an existing one</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <Createroom />
          <Joinroom />
        </div>

      </div>
    </div>
  );
};

export default page;
