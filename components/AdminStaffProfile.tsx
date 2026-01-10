import { Button } from "@/components/ui/button"
import { PenSquare } from "lucide-react"

interface AdminStaffProfileProps {
  name: string;
  email?: string;
  phone?: string;
  site?: string;
}

export default function AdminStaffProfile({ name, email, phone, site }: AdminStaffProfileProps) {
  return (
    <div className="border rounded-md p-4 bg-white flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="flex-shrink-0">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden relative text-white font-bold text-2xl">
          {name.charAt(0)}
        </div>
      </div>

      <div className="flex-grow">
        <h1 className="text-xl font-bold">{name}</h1>
        <div className="space-y-1 text-sm text-gray-600">
          <p>{site || "Default Site"}</p>
          <p>{phone || "(000) 000-0000"}</p>
          <p>{email || "no-email@theralink.com"}</p>
        </div>
      </div>

      <div className="flex-shrink-0 ml-auto">
        <Button variant="outline" className="flex items-center gap-2 bg-blue-900 text-white hover:bg-blue-800">
          <PenSquare className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    </div>
  )
}
