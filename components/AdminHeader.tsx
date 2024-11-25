import React from 'react'
import Image from 'next/image'
import { Search, AlarmClock, HelpCircle, Mail, Bell, SettingsIcon, PlusCircle, User, UserCircle, ChevronDown } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const AdminHeader = () => {
  return (
    <header className="bg-white border-b">
      <div className='border-b'>
        <div className='mx-auto max-w-[1350px]'>
          <div className="flex items-center justify-between h-[80px] px-6 py-3">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/logo.png"
                alt="Next.js logo"
                width={150}
                height={32}
                priority
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative mr-10 hidden md:block">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-gray-500" />
                <Input className='mt-0 pl-10' placeholder="Find Clients..." />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='text-primary hover:text-primary' asChild variant="ghost" size="icon">
                    <Bell className="h-7 w-7 cursor-pointer" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-52'>
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>New message</DropdownMenuItem>
                  <DropdownMenuItem>Appointment reminder</DropdownMenuItem>
                  <DropdownMenuItem>System update</DropdownMenuItem>
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className='text-primary hover:text-primary' asChild variant="ghost" size="icon">
                <AlarmClock className="h-7 w-7 cursor-pointer" />
              </Button>
              <Button asChild variant="ghost" size="icon">
                <PlusCircle fill='#021F55' color='white' className="h-8 w-8 cursor-pointer" />
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Mail className="h-7 w-7 cursor-pointer" />
              </Button>
              <Button asChild variant="ghost" size="icon">
                <UserCircle className="h-7 w-7 cursor-pointer" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='mx-auto max-w-[1350px]'>
        <div className='flex items-center justify-between h-[50px] px-6 py-3'>
          <div className="flex flex-row items-center space-x-4">
            <Button className="font-semibold rounded-sm text-[14px] h-7 w-22" variant="pill" size="sm">
              Dashboard
            </Button>
            <Button className="font-semibold rounded-sm text-[14px] h-7 w-22" variant="pill" size="sm">
              Staff
            </Button>
            <Button className="font-semibold rounded-sm text-[14px] h-7 w-22" variant="pill" size="sm">
              Clients
            </Button>
            <Button className="font-semibold rounded-sm text-[14px] h-7 w-22" variant="pill" size="sm">
              Messages
            </Button>
            <Button className="font-semibold rounded-sm text-[14px] h-7 w-22" variant="pill" size="sm">
              Calendar
            </Button>
            <Button className="font-semibold rounded-sm text-[14px] h-7 w-22" variant="pill" size="sm">
              Documents
            </Button>
            <Button className="font-semibold rounded-sm text-[14px] h-7 w-22" variant="pill" size="sm">
              Billing <ChevronDown />
            </Button>
            <Button className="font-semibold rounded-sm text-[14px] h-7 w-22" variant="pill" size="sm">
              More <ChevronDown />
            </Button>

          </div>

        </div>
      </div>
    </header>
  )
}

export default AdminHeader

