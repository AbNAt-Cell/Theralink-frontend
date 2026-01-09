import AdminStaffProfile from "@/components/AdminStaffProfile"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function CertificationsPage() {
  return (
    <div className="space-y-6">
      <AdminStaffProfile />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Certifications</h2>
          <Button className="bg-blue-900 hover:bg-blue-800">Add Certification</Button>
        </div>

        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="relative w-48 h-48 mb-4">
            <Image
              src="/placeholder.svg?height=200&width=200&text=No+Certifications"
              alt="No certifications"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-gray-500">No certifications found</p>
        </div>
      </div>
    </div>
  )
}
