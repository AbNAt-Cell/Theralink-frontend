'use client';

import React from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { Button } from '@/components/ui/button';
import { ArrowRight, Eraser, X } from 'lucide-react';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
// import { createClient } from '@/lib/auth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const newClientFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(1, "Phone number is required"),
  username: z.string().min(1, "Username is required"),
  gender: z.string().min(1, "Gender is required"),
  race: z.string().min(1, "Race is required"),
  position: z.string().min(1, "Position is required"),
  positionEffectiveDate: z.string().min(1, "Position effective date is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  accessLevel: z.string().min(1, "Access level is required"),
});

const formSchema = newClientFormSchema;

type FormValues = z.infer<typeof formSchema>;

const NewStaffPage = () => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
      gender: "",
      race: "",
      position: "",
      positionEffectiveDate: "",
      dateOfBirth: "",
      accessLevel: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    // Handle form submission
    // await createClient(data);
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add Staff</h1>
        <div className="flex gap-4">
          <Button variant="outlineSecondary" onClick={() => form.reset()}>
            <Eraser />
            Reset Form
          </Button>
          <Button variant="outlineDanger" onClick={() => { router.push('/admin/staff') }}>
            <X />
            Cancel
          </Button>

        </div>
      </div>
      <div className='mt-4 '>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 grid grid-cols-2 gap-4 mt-4">
            {/* Demographics Section */}
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>First Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>Last Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>Gender*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="race"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>Race</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select race" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AFRICAN">African</SelectItem>
                          <SelectItem value="WHITE">White</SelectItem>
                          <SelectItem value="ASIAN">Asian</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>Position*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter position" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="positionEffectiveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>Position Effective Date*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>Date of Birth*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>Access Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Access Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="superAdmin">Super Admin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>


            <div className="flex gap-5 col-span-3 bg-gray-50 p-4 rounded-lg">
              <Button type="submit" className="col-span-1">
                Add Staff
                <ArrowRight />
              </Button>
              <Link href="/admin/staff" className="col-span-1">
                <Button variant="outlineDanger">
                  <X />
                  Cancel
                </Button>
              </Link>

            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}

export default NewStaffPage