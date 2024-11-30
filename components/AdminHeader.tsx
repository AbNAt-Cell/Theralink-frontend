import React from 'react'
import Image from 'next/image'
import { Search, AlarmClock, Mail, Bell, PlusCircle, UserCircle, ChevronDown, LogOut, AtSign, User, UserCog } from 'lucide-react'
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
import { useRouter } from 'next/navigation'
import { getStoredUser, logout } from '@/lib/auth'

const LogoutMenuItem = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <DropdownMenuItem 
      onClick={handleLogout}
      className="text-red-600 focus:text-red-600 cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
};

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
            <div className="flex items-center gap-2">
              <div className="relative mr-10 hidden md:block">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-gray-500" />
                <Input className='mt-0 pl-10' placeholder="Find Clients..." />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='text-primary hover:text-primary' asChild variant="ghost" size="icon">
                    <Bell className="h-6 w-6 cursor-pointer" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-52'>
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    No new notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className='text-primary hover:text-primary' asChild variant="ghost" size="icon">
                <AlarmClock className="h-6 w-6 cursor-pointer" />
              </Button>
              <Button asChild variant="ghost" size="icon">
                <PlusCircle fill='#021F55' color='white' className="h-6 w-6 cursor-pointer" />
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Mail className="h-6 w-6 cursor-pointer" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button asChild variant="ghost" size="icon">
                    <UserCircle className="h-6 w-6 cursor-pointer" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {getStoredUser()?.username}
                    </div>
                    <div className="text-muted-foreground flex items-center">
                      <AtSign className="mr-2 h-4 w-4" />
                      {getStoredUser()?.email}
                    </div>
                    <div className="text-xs mt-1 text-muted-foreground flex items-center">
                      <UserCog className="mr-2 h-4 w-4" />
                      Role: {getStoredUser()?.role}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <LogoutMenuItem />
                </DropdownMenuContent>
              </DropdownMenu>
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
