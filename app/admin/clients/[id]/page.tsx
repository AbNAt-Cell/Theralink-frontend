import React from 'react'
import { Camera, Edit, Video, Plus, Printer } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

async function AdminClientProfilePage({ params, }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <>
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

          <div className="border rounded-lg p-6 bg-white">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-10">
        <Accordion type="single" collapsible className="w-full" defaultValue="insurance">
          <AccordionItem value="insurance">
            <AccordionTrigger className="bg-gray-200 px-4 rounded-t-md">Current Insurance</AccordionTrigger>
            <AccordionContent className="p-4 border rounded-b-md border-t-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Insurance</span>
                  <span>68059 - SUPERIOR HEALTHPLAN</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Policy #</span>
                  <span>727333179</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Start Date</span>
                  <span>6/1/2024</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">End Date</span>
                  <span>6/1/2024</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full" defaultValue="portal">
          <AccordionItem value="portal">
            <AccordionTrigger className="bg-gray-200 px-4 rounded-t-md">Client Portal Access</AccordionTrigger>
            <AccordionContent className="p-4 border rounded-b-md border-t-0">
              <div className="flex flex-wrap gap-2">
                <Button variant="outlineSecondary" className="flex gap-2">
                  <Plus className="h-4 w-4" />
                  Reset Login Credentials
                </Button>
                <Button variant="outlineSecondary" className="flex gap-2">
                  <Plus className="h-4 w-4" />
                  Manage Parental Access
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full" defaultValue="vitals">
          <AccordionItem value="vitals">
            <AccordionTrigger className="bg-gray-200 px-4 rounded-t-md">Vitals</AccordionTrigger>
            <AccordionContent className="p-4 border rounded-b-md border-t-0">
              <div className="space-y-2">
                <div>Date Record</div>
                <div>Blood Pressure #</div>
                <div>Temperature</div>
                <div>Height</div>
                <div>Heart Rate</div>
                <div>End Date</div>
                <div>Pulse Rate</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full" defaultValue="relationship">
          <AccordionItem value="relationship">
            <AccordionTrigger className="bg-gray-200 px-4 rounded-t-md">Relationship</AccordionTrigger>
            <AccordionContent className="p-4 border rounded-b-md border-t-0">
              <Button variant="outlineSecondary" size="sm" className="flex gap-2">
                <Plus className="h-4 w-4" />
                Add Relationship
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full" defaultValue="emergency">
          <AccordionItem value="emergency">
            <AccordionTrigger className="bg-gray-200 px-4 rounded-t-md">Emergency Contact</AccordionTrigger>
            <AccordionContent className="p-4 border rounded-b-md border-t-0">
              <Button variant="outlineSecondary" size="sm" className="flex gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full" defaultValue="referral">
          <AccordionItem value="referral">
            <AccordionTrigger className="bg-gray-200 px-4 rounded-t-md">Referral Source</AccordionTrigger>
            <AccordionContent className="p-4 border rounded-b-md border-t-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Referral Source</span>
                  <Button variant="outlineSecondary" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div>Referral Date</div>
                <div>Reason for Referral</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full" defaultValue="referring">
          <AccordionItem value="referring">
            <AccordionTrigger className="bg-gray-200 px-4 rounded-t-md">Referring Provider</AccordionTrigger>
            <AccordionContent className="p-4 border rounded-b-md border-t-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Referring Provider</span>
                  <Button variant="outlineSecondary" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div>Referral Date</div>
                <div>Reason for Referring</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full" defaultValue="primary">
          <AccordionItem value="primary">
            <AccordionTrigger className="bg-gray-200 px-4 rounded-t-md">Primary Care Physician</AccordionTrigger>
            <AccordionContent className="p-4 border rounded-b-md border-t-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Primary Physician</span>
                  <Button variant="outlineSecondary" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div>Address</div>
                <div>Phone</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full" defaultValue="pediatrician">
          <AccordionItem value="pediatrician">
            <AccordionTrigger className="bg-gray-200 px-4 rounded-t-md">Pediatrician</AccordionTrigger>
            <AccordionContent className="p-4 border rounded-b-md border-t-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Pediatrician</span>
                  <Button variant="outlineSecondary" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div>Address</div>
                <div>Phone</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  )
}

export default AdminClientProfilePage