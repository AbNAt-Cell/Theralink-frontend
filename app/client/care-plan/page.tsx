import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const ClientCarePlan = () => {
  return (
    <div className="container max-w-[1350px] mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-medium">Care Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Show Closed/Completed Plan</Label>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default ClientCarePlan