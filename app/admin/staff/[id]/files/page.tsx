
import AdminStaffProfile from "@/components/AdminStaffProfile"
import { Button } from "@/components/ui/button"

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <AdminStaffProfile />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Files</h2>
          <Button className="bg-blue-900 hover:bg-blue-800">Add Files</Button>
        </div>

        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <img src="/placeholder.svg?height=200&width=200&text=No+Files" alt="No files" className="w-48 h-48 mb-4" />
          <p className="text-gray-500">No files found</p>
        </div>
      </div>
    </div>
  )
}
