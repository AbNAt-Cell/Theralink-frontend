import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Trash2, ChevronLeft, ChevronRight, PenSquare, Inbox, SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ClientMessaging = () => {
  return (
    <div className="container max-w-[1350px] mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Messaging
          </CardTitle>
        </CardHeader>
        <CardContent className='flex gap-4'>
          <div className="w-80">
            <Card className="w-full max-w-5xl">
              <CardHeader className="pb-8">
                <Button variant="secondary" size="lg" className="w-full gap-2">
                <PenSquare className="mr-2 h-4 w-4" />
                  New Message
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-slate-100 text-slate-900">
                    <Inbox className="h-4 w-4" />
                    Inbox
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
                    <SendHorizontal className="h-4 w-4" />
                    Sent
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-red-600">
                    <Trash2 className="h-4 w-4" />
                    Trash
                  </button>
                </div>
              </CardContent>
            </Card>

          </div>

          <div className='flex-1'>
            <div className="rounded-md border">
              <Table>
                <TableHeader className='bg-slate-100'>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Victor Idusuyi</TableCell>
                    <TableCell>11/07/2024</TableCell>
                    <TableCell>Test document</TableCell>
                    <TableCell>nil</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page</span>
                <Select defaultValue="10">
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">1-1 of 1</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" disabled>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default ClientMessaging