import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RemittanceView from './_remittance'
import ClaimView from './_claim'

const AdminBillingRemittancePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="remittance">
        <TabsList>
          <TabsTrigger value="remittance">Remittance View</TabsTrigger>
          <TabsTrigger value="claim">Claim View</TabsTrigger>
        </TabsList>
        <TabsContent value="remittance">
          <RemittanceView />
        </TabsContent>
        <TabsContent value="claim">
          <ClaimView />
        </TabsContent>
      </Tabs>

    </div>
  )
}

export default AdminBillingRemittancePage