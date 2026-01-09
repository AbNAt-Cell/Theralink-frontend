'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { logout } from '@/hooks/auth'
import { useRouter } from 'nextjs-toploader/app'
import { LogOut } from 'lucide-react'

const ClientHeader = () => {
  const pathname = usePathname()
  const { user } = useUser()
  const router = useRouter()

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    await logout();
    router.push('/client/login');
  }

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '??'

  return (
    <header className="bg-white border-b">
      <div className='border-b'>
        <div className='mx-auto max-w-[1350px]'>
          <div className="flex items-center justify-between h-[80px] px-6 py-3">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/logo.png"
                alt="Theralink logo"
                width={150}
                height={32}
                priority
              />
            </div>
            <div className="flex items-center space-x-9">
              <div className='hidden md:block space-x-3'>
                <Link className={`hover:text-primary ${isActive('/client/dashboard') ? 'text-primary' : ''}`} href="/client/dashboard">Home</Link>
                <Link className={`hover:text-primary ${isActive('/client/diagnosis') ? 'text-primary' : ''}`} href="/client/diagnosis">Diagnosis</Link>
                <Link className={`hover:text-primary ${isActive('/client/care-plan') ? 'text-primary' : ''}`} href="/client/care-plan">Care Plan</Link>
                <Link className={`hover:text-primary ${isActive('/client/appointments') ? 'text-primary' : ''}`} href="/client/appointments">Appointments</Link>
                <Link className={`hover:text-primary ${isActive('/client/messaging') ? 'text-primary' : ''}`} href="/client/messaging">Messaging</Link>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-secondary hover:bg-secondary text-white hover:text-white">
                    {initials}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Help</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default ClientHeader
