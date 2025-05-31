'use client';

import React, { useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eraser, Loader, X } from 'lucide-react';
import { useToast } from '@/hooks/Partials/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cleanData } from '@/lib/utils';
import { createClient } from '@/hooks/admin/client';

const newClientFormSchema = z.object({
  prefix: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  suffix: z.string().optional(),
  nickName: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  ssn: z
    .string()
    .min(9, 'SSN must be 9 digits')
    .max(9, 'SSN must be 9 digits')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  race: z.enum(['AFRICAN', 'WHITE', 'ASIAN', 'HISPANIC', 'OTHER']).optional(),
  startDate: z.string().min(1, 'Client start date is required'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code is required'),
  }),
  comments: z.string().optional(),
  insurance: z.object({
    insuranceType: z.string().min(1, 'Insurance type is required'),
    policyNumber: z.string().min(1, 'Policy number is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
  }),
});

const formSchema = newClientFormSchema;

type FormValues = z.infer<typeof formSchema>;

const NewClientPage = () => {
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prefix: '',
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      nickName: '',
      gender: undefined,
      dateOfBirth: '',
      ssn: '',
      race: undefined,
      startDate: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      comments: '',
      insurance: {
        insuranceType: '',
        policyNumber: '',
        startDate: '',
        endDate: '',
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    setloading(true);
    try {
      const cleanedData = cleanData(data);
      const response = await createClient(cleanedData);
      toast({
        title: 'Success',
        description: response.message,
      });
      router.push(`/admin/clients/${response.patient.id}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('Error: ', error);
      toast({
        variant: 'destructive',
        title: 'Error:',
        description:
          error.response?.data?.error ||
          'Failed to create Client. Please try again.',
      });
    } finally {
      setloading(false);
    }
  };

  return (
    <div className=''>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>New Client</h1>
        <div className='flex gap-4'>
          <Button variant='outlineSecondary' onClick={() => form.reset()}>
            <Eraser />
            Reset Form
          </Button>
          <Button
            variant='outlineDanger'
            onClick={() => {
              router.push('/admin/clients');
            }}
          >
            <X />
            Cancel
          </Button>
        </div>
      </div>
      <div className='mt-4 '>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 grid grid-cols-2 gap-4 mt-4'
          >
            {/* Demographics Section */}
            <div className='col-span-2 bg-gray-50 p-4 rounded-lg'>
              <h2 className='text-xl font-semibold mb-4'>Demographics</h2>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='prefix'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Prefix
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter Prefix' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        First Name*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter first name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='middleName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Middle Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter middle name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Last Name*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter last name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='suffix'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Suffix
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter suffix' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='nickName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Nickname
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter nickname' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Enter email address'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Enter Phone Number'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Gender*
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select gender' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='MALE'>Male</SelectItem>
                          <SelectItem value='FEMALE'>Female</SelectItem>
                          <SelectItem value='OTHER'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='dateOfBirth'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Date of Birth*
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
                  name='ssn'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        SSN
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter SSN' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='race'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Race
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select race' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='AFRICAN'>African</SelectItem>
                          <SelectItem value='WHITE'>White</SelectItem>
                          <SelectItem value='ASIAN'>Asian</SelectItem>
                          <SelectItem value='HISPANIC'>Hispanic</SelectItem>
                          <SelectItem value='OTHER'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='startDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Client Start Date*
                      </FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Section */}
            <div className='col-span-3 bg-gray-50 p-4 rounded-lg'>
              <h2 className='text-xl font-semibold mb-4'>Address</h2>
              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='address.street'
                  render={({ field }) => (
                    <FormItem className='col-span-1'>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Street*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter address line 1' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='address.city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        City*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter city' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='address.state'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        State*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter state' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='address.zipCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        ZIP Code*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter ZIP code' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Physical Address Section */}
            {/* <div className="col-span-3 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Physical Address</h2>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="address.physicalAddress.line1"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel className='text-gray-800 font-semibold'>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.physicalAddress.line2"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel className='text-gray-800 font-semibold'>Address Line 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.physicalAddress.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.physicalAddress.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.physicalAddress.zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ZIP code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div> */}

            {/* Insurance Section */}
            <div className='col-span-2 bg-gray-50 p-4 rounded-lg'>
              <h2 className='text-xl font-semibold mb-4'>
                Insurance Information
              </h2>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='insurance.insuranceType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Insurance Type*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter insurance type' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='insurance.policyNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Policy Number*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter policy number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='insurance.startDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        Start Date*
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
                  name='insurance.endDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>
                        End Date
                      </FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Comments Section */}
            <div className='col-span-2 bg-gray-50 p-4 rounded-lg'>
              <h2 className='text-xl font-semibold mb-4'>
                Additional Comments
              </h2>
              <FormField
                control={form.control}
                name='comments'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Enter any additional comments'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex gap-5 col-span-3 bg-gray-50 p-4 rounded-lg'>
              <Button disabled={loading} type='submit' className='col-span-1'>
                {loading ? (
                  <>
                    Creating Client <Loader className='animate-spin' />{' '}
                  </>
                ) : (
                  <>
                    Create Client <ArrowRight />
                  </>
                )}
              </Button>
              <Link href='/admin/clients' className='col-span-1'>
                <Button variant='outlineDanger'>
                  <X />
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewClientPage;
