"use client"

import { useState } from "react"
import { Search, Trash2 } from "lucide-react"

interface Email {
  id: number
  sender: string
  subject: string
  category?: string
  time: string
  isChecked: boolean
  isStarred: boolean
}

export default function EmailInbox() {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: 1,
      sender: "Jullu Jalal",
      subject: "Our Bachelor of Commerce program is ACBSP-accredited.",
      category: "Primary",
      time: "8:38 AM",
      isChecked: true,
      isStarred: false,
    },
    {
      id: 2,
      sender: "Minerva Barnett",
      subject: "Get Best Advertiser In Your Side Pocket",
      category: "Client",
      time: "8:13 AM",
      isChecked: true,
      isStarred: false,
    },
    {
      id: 3,
      sender: "Peter Lewis",
      subject: "Vacation Home Rental Success",
      category: "Staff",
      time: "7:52 PM",
      isChecked: false,
      isStarred: false,
    },
    {
      id: 4,
      sender: "Anthony Briggs",
      subject: "Free Classifieds Using Them To Promote Your Stuff Online",
      category: "",
      time: "7:52 PM",
      isChecked: true,
      isStarred: true,
    },
    {
      id: 5,
      sender: "Clifford Morgan",
      subject: "Enhance Your Brand Potential With Giant Advertising Blimps",
      category: "Social",
      time: "4:13 PM",
      isChecked: false,
      isStarred: false,
    },
    {
      id: 6,
      sender: "Cecilia Webster",
      subject: "Always Look On The Bright Side Of Life",
      category: "Staff",
      time: "3:52 PM",
      isChecked: false,
      isStarred: false,
    },
    {
      id: 7,
      sender: "Harvey Manning",
      subject: "Curling Irons Are As Individual As The Women Who Use Them",
      category: "",
      time: "2:30 PM",
      isChecked: false,
      isStarred: true,
    },
    {
      id: 8,
      sender: "Willie Blake",
      subject: "Our Bachelor of Commerce program is ACBSP-accredited.",
      category: "Primary",
      time: "8:38 AM",
      isChecked: false,
      isStarred: false,
    },
    {
      id: 9,
      sender: "Minerva Barnett",
      subject: "Get Best Advertiser In Your Side Pocket",
      category: "Client",
      time: "8:13 AM",
      isChecked: true,
      isStarred: false,
    },
    {
      id: 10,
      sender: "Fanny Weaver",
      subject: "Free Classifieds Using Them To Promote Your Stuff Online",
      category: "",
      time: "7:52 PM",
      isChecked: false,
      isStarred: true,
    },
  ])

  const toggleCheck = (id: number) => {
    setEmails(emails.map((email) => (email.id === id ? { ...email, isChecked: !email.isChecked } : email)))
  }

  const toggleStar = (id: number) => {
    setEmails(emails.map((email) => (email.id === id ? { ...email, isStarred: !email.isStarred } : email)))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Primary":
        return "bg-emerald-100 text-emerald-600"
      case "Client":
        return "bg-orange-100 text-orange-600"
      case "Staff":
        return "bg-purple-100 text-purple-600"
      case "Social":
        return "bg-blue-100 text-blue-600"
      default:
        return ""
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none"
            placeholder="Search mail..."
          />
        </div>
        <button className="p-2.5 ml-2 text-gray-700 rounded-lg">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <div className="divide-y">
        {emails.map((email) => (
          <div
            key={email.id}
            className={`flex items-center px-4 py-3 hover:bg-gray-50 ${email.isChecked ? "bg-blue-50" : ""}`}
          >
            <div className="flex items-center mr-4">
              <input
                type="checkbox"
                checked={email.isChecked}
                onChange={() => toggleCheck(email.id)}
                className="w-4 h-4 border-gray-300 rounded"
              />
            </div>
            <button onClick={() => toggleStar(email.id)} className="mr-4">
              {email.isStarred ? (
                <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <p className="text-sm font-medium text-gray-900 truncate w-40">{email.sender}</p>
                {email.category && (
                  <span className={`ml-2 px-2.5 py-0.5 text-xs rounded-full ${getCategoryColor(email.category)}`}>
                    {email.category}
                  </span>
                )}
                <p className="ml-4 text-sm text-gray-700 truncate flex-1">{email.subject}</p>
                <p className="text-sm text-gray-500 whitespace-nowrap ml-4">{email.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

