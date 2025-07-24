"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from 'nextjs-toploader/app';
import { useToast } from '@/hooks/Partials/use-toast';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Loader } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const newAuthorizationFormSchema = z.object({
  dateOfRequest: z.string().min(1, 'Date of birth is required'),
  status: z.enum(['APPROVED', 'APPROVED W/ CHANGES', 'DENIED', 'PENDING']),
  submittedBy: z.enum(['MFONISO IBOKETTE', 'OTHER USER']),
  selectClient: z.enum(['OTHER USER']),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  authId: z.string().min(1, 'Auth ID is required'),
  servicesCodes: z.string().min(1, 'Services codes are required'),
  services: z.string().min(1, 'Services are required'),
  totalUnits: z.string().min(1, 'Total units are required'),
  additionalNotes: z.string().optional(),
});

const formSchema = newAuthorizationFormSchema;

type FormValues = z.infer<typeof formSchema>;

const NewAuthorizationPage = () => {
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateOfRequest: '',
      status: undefined,
      submittedBy: undefined,
      selectClient: undefined,
      effectiveDate: '',
      authId: '',
      servicesCodes: '',
      services: '',
      totalUnits: '',
      additionalNotes: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setloading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Authorization created successfully',
        description: 'Your new authorization has been created.',
        variant: 'default',
      });
      router.push('/admin/more/authorization');
    } catch (error) {
      toast({
        title: 'Error creating authorization',
        description: 'There was an error creating the authorization. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setloading(false);
    }
  };

  return(
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6 grid grid-cols-2'
        >
         {/* First Section */}
          <div className='col-span-2 bg-gray-50  rounded-lg'>
            <h2 className='text-xl font-semibold mb-4'>Authorization</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <FormField
                control={form.control}
                name='dateOfRequest'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800'>
                      Date of Request Submission
                    </FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> 

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800'>
                      Status
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='APPROVED'>Approved</SelectItem>
                        <SelectItem value='APPROVED W/ CHANGES'>Approved w/ changes</SelectItem>
                        <SelectItem value='DENIED'>Denied</SelectItem>
                        <SelectItem value='PENDING'>Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name='submittedBy'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800'>
                      Submitted By
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select user' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='MFONISO IBOKETTE'>Mfoniso Ibokette</SelectItem>
                        <SelectItem value='OTHER USER'>Other User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> 
            <hr className="border-t border-gray-300 mt-8" />
          </div>

          {/* Client Section */}
          <div className='col-span-2 bg-gray-50 rounded-lg'>
            <h2 className='text-xl font-semibold mb-4'>Add Clients</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <FormField
                control={form.control}
                name='selectClient'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800'>Select Client</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select client' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='OTHER USER'>Other User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='effectiveDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800'>Effective Date</FormLabel>
                    <Input type='date' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='effectiveDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800'>Effective Date</FormLabel>
                    <Input type='date' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='authId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800'>Auth ID</FormLabel>
                    <Input type='text' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Button to add another client */}
            <Button variant="secondary" className="mt-6">
              + Add Another Client
            </Button>
            <hr className="border-t border-gray-300 mt-8" />
          </div>
          
          {/* Services Section */}  
          <div className='col-span-2 bg-gray-50 rounded-lg '>
            <h2 className='text-xl font-semibold mb-4'>Add Services</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='servicesCodes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800'>Select Services Codes</FormLabel>
                    <Input type='text' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='services'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800'>Select Services</FormLabel>
                    <Input type='text' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='totalUnits'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800'>Total Units</FormLabel>
                    <Input type='text' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Button to add another service */}
            <Button variant="secondary" className="mt-6">
              + Add Another Service
            </Button>
            <hr className="border-t border-gray-300 mt-8" />
          </div>

          {/* Select services Codes Section */}
          <div className='col-span-2 bg-gray-50 rounded-lg mt-4'>
            <FormField
              control={form.control}
              name='additionalNotes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-800'>Select Services Codes</FormLabel>
                  <Textarea className='mt-2 min-h-[100px]' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>    
          <div className='flex gap-5 col-span-3 bg-gray-50  rounded-lg'>
            <Button variant='secondary' disabled={loading} type='submit' className='col-span-1'>
              {loading ? (
                <>
                  Creating Authorization <Loader className='animate-spin' />{' '}
                </>
              ) : (
                <>
                  Submit
                </>
              )}
            </Button>
            <Link href='/admin/more/authorization' className='col-span-1'>
              <Button
                  variant='outlineSecondary'
                  onClick={() => {
                    router.push('/admin/more/authorization');
                  }}
                >
                  Cancel
              </Button>
            </Link>
          </div> 
        </form>
      </Form>
    </div>
  )
}

export default NewAuthorizationPage;