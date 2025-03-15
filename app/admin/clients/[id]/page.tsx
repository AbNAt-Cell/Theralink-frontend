import React from 'react'
import { Camera, Edit, Video, Printer } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import AdminUserProfileNavigation from '@/components/AdminUserProfileNavigation'

async function AdminClientProfilePage({ params, }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className='flex flex-row gap-4'>
      <div className='w-1/4'>
        <AdminUserProfileNavigation id={id} />
      </div>
      <div className='w-3/4'>
        <div className="grid md:grid-cols-[400px,1fr] gap-6">
          {/* Left Column - Profile Card */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-red-600 relative overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Profile picture"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <h2 className="mt-4 text-xl font-semibold">Jaleigh B Bolton</h2>
              <address className="mt-2 not-italic text-muted-foreground">
                3413 E Main St Apt 417
                <br />
                Nacogdoches, TX 75961
              </address>
              <p className="mt-2">
                <span className="text-muted-foreground">Balance:</span> $0.00
              </p>
              <p className="mt-1">(936) 201-2168</p>
              <p className="text-sm text-muted-foreground">J.caraway290@gmail.com</p>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <span className="mr-1">+</span> Add Flags
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Demographics */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-lg font-semibold">Demographics</h1>
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Video className="mr-2 h-4 w-4" />
                  Telehealth
                </Button>
                <Button variant="outlineSecondary">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outlineSecondary">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Row 1 */}
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <p className="mt-1">Active</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Username</label>
                  <p className="mt-1">jaleighbolton</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Gender</label>
                  <p className="mt-1">Female</p>
                </div>

                {/* Row 2 */}
                <div>
                  <label className="text-sm text-muted-foreground">Date of Birth</label>
                  <p className="mt-1">6/27/2018 (6 years, 4 months)</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Start Date</label>
                  <p className="mt-1">8/8/2024</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Record#</label>
                  <p className="mt-1">-</p>
                </div>

                {/* Row 3 */}
                <div>
                  <label className="text-sm text-muted-foreground">Race</label>
                  <p className="mt-1">Black or African American</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Ethnicity</label>
                  <p className="mt-1">Nii</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Smoker</label>
                  <p className="mt-1">Nii</p>
                </div>

                {/* Row 4 */}
                <div>
                  <label className="text-sm text-muted-foreground">Hair Color</label>
                  <p className="mt-1">Black</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Eye Color</label>
                  <p className="mt-1">Black</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">SSN</label>
                  <p className="mt-1">Nii</p>
                </div>

                {/* Row 5 */}
                <div>
                  <label className="text-sm text-muted-foreground">Comm. Pref</label>
                  <p className="mt-1">Black or African American</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Sites</label>
                  <p className="mt-1">Auspicious Community Service</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Physical Address</label>
                  <p className="mt-1">Nii</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminClientProfilePage