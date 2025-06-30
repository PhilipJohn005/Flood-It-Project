'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { LogOut } from "lucide-react";

const SigninButton = () => {
  return (
    <div>
      <Button
      variant="default"
      onClick={() => signIn('google', { callbackUrl: '/' })}
      className="rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 cursor-pointer dark:bg-white dark:text-black dark:hover:bg-gray-200"
    >
        <LogOut/>
      Login with Google
      
    </Button>
    </div>
  )
}

export default SigninButton
