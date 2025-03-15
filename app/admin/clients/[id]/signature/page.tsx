import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const AdminClientSignaturePage = () => {
  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-6">
            <div className="relative h-32 w-32 overflow-hidden rounded-full bg-red-600">
              <Image
                src="/placeholder.svg?height=128&width=128"
                alt="Patient avatar"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Jaleigh Bolton</h2>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div className='flex flex-col'>
                    <span className="font-semibold text-foreground">DOB: </span>
                    <p>6/27/2018 (6 years)</p>
                  </div>
                  <div className='flex flex-col'>
                    <span className="font-semibold text-foreground">Email: </span>
                    <p>J.caraway99@gmail.com</p>
                  </div>
                  <div className='flex flex-col'>
                    <span className="font-semibold text-foreground">Record #: </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-auto space-y-1 text-sm">
              <div className='flex flex-col'>
                <span className="font-semibold">Phone: </span>
                <p>(936) 201-2168</p>
              </div>
              <div className='flex flex-col'>
                <span className="font-semibold">Insurance: </span>
                <div className="mt-1">
                  68689 - SUPERIOR
                  <br />
                  HEALTHPLAN (727333179)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className='flex flex-row flex-wrap items-center gap-2 justify-between mt-5 px-5'>
        <h3 className="text-lg font-semibold">Signature</h3>
        <div className="mt-2 flex gap-2">
          <Button variant="outlineSecondary">
            + Add Client Signature
          </Button>
          <Button variant="outlineSecondary">
            + Add Parents Signature
          </Button>
        </div>
      </div>
      <Card className='mt-5'>
        <CardContent className='p-4'>
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Image
              src="/images/notfound.png"
              alt="No signature illustration"
              width={600}
              height={400}
              className="opacity-60"
            />
            <p className="text-sm text-muted-foreground">No Signature Available</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default AdminClientSignaturePage