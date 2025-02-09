"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, ChevronRight, Users2, User } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'

export default function AdminDashboard() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 mx-auto max-w-[1350px]">
        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
          <Card className="bg-secondary text-white p-4 cursor-pointer">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row justify-center items-center gap-4">
                <div className="flex justify-center items-center rounded-full bg-[#E7EAF017] h-14 w-14">
                  <Building2 className="" />
                </div>
                <div>
                  <p className="font-semibold text-lg uppercase">Site</p>
                  <p className="text-sm">3</p>
                </div>
              </div>
              <ChevronRight />

            </div>
          </Card>
          <Card className="bg-secondary text-white p-4 cursor-pointer">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row justify-center items-center gap-4">
                <div className="flex justify-center items-center rounded-full bg-[#E7EAF017] h-14 w-14">
                  <Users2 className="" />
                </div>
                <div>
                  <p className="font-semibold text-lg uppercase">Staff</p>
                  <p className="text-sm">100</p>
                </div>
              </div>
              <ChevronRight />

            </div>
          </Card>
          <Card className="bg-secondary text-white p-4 cursor-pointer" onClick={() => router.push('/admin/clients')}>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row justify-center items-center gap-4">
                <div className="flex justify-center items-center rounded-full bg-[#E7EAF017] h-14 w-14">
                  <User className="" />
                </div>
                <div>
                  <p className="font-semibold text-lg uppercase">Clients</p>
                  <p className="text-sm">100</p>
                </div>
              </div>
              <ChevronRight />

            </div>
          </Card>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Amount Collected:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span># of Billing Submissions:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span># of Claims Created:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span># of Documents Billed:</span>
                  <span>0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  {/* Add appointment items here */}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Days Since Clients Last Seen */}
          <Card>
            <CardHeader>
              <CardTitle>Days Since Clients Last Seen</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>14 or more days</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30 or more days</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clients Never Seen</span>
                    <span>0</span>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Clients by Payer */}
          <Card>
            <CardHeader>
              <CardTitle>Clients by Payer</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>PRIVATE PAY</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SUPERIOR HEALTH PLAN STAR</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">0</span>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Logged in Staff */}
          <Card>
            <CardHeader>
              <CardTitle>Logged in Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {/* Add logged in staff items here */}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Upcoming Compliance */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Within 30 Days</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Within 60 Days</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Within 90 Days</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">0</span>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-600">
          <p>Therasoft Community Service LLC</p>
          <p>2617 E 7th St, Austin TX</p>
          <p>Suite 100</p>
          <p>(512) 779-7141</p>
        </footer>
      </main>
    </div>
  )
}

