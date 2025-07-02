
import React from 'react'
import Createroom from '@/components/pages/multi-player-page/Createroom'
import Joinroom from '@/components/pages/multi-player-page/Joinroom'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const page = () => {
  return (
    <div className='min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-50 to-blue-200'>
      <div className='max-w-4xl mx-auto'>
        
        <div className="mb-8">
          <Link href={"/"}>
          <button
            className="inline-flex items-center gap-2 text-black transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft size={18} className="" />
            Back to Home
          </button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold text-black mb-2">Setup Canvas</h1>
          <p className="text-black">Create a new room or join an existing one</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <Createroom/>
          <Joinroom/>
        </div>
        
      </div>
      
    </div>
  )
}

export default page
