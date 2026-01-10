'use client';

import React from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { Button } from '@/components/ui/button';
import { ArrowRight, Eraser, X } from 'lucide-react';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldErrors } from "react-hook-form";
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
import { createStaff } from '@/hooks/admin/staff';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
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
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
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
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
      accessLevel: "STAFF",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user?.clinicId) {
      toast.error("Clinic information not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createStaff(data, user.clinicId);
      toast.success("Staff member added successfully!");
      router.push('/admin/staff');
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to add staff member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form Errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add Staff</h1>
        <div className="flex gap-4">
          <Button variant="outlineSecondary" onClick={() => form.reset()} disabled={isSubmitting}>
            <Eraser className="mr-2 h-4 w-4" />
            Reset Form
          </Button>
          <Button variant="outlineDanger" onClick={() => router.push('/admin/staff')} disabled={isSubmitting}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>

      <div className='mt-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-800 font-semibold'>First Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} disabled={isSubmitting} />
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
                        <Input placeholder="Enter last name" {...field} disabled={isSubmitting} />
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
                        <Input type="email" placeholder="Enter email address" {...field} disabled={isSubmitting} />
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
                      <FormLabel className='text-gray-800 font-semibold'>Phone Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} disabled={isSubmitting} />
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
                      <FormLabel className='text-gray-800 font-semibold'>Username*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} disabled={isSubmitting} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
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
                      <FormLabel className='text-gray-800 font-semibold'>Race*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select race" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AFRICAN">African</SelectItem>
                          <SelectItem value="WHITE">White</SelectItem>
                          <SelectItem value="ASIAN">Asian</SelectItem>
                          <SelectItem value="HISPANIC">Hispanic</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
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
                        <Input placeholder="Enter position" {...field} disabled={isSubmitting} />
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
                      <FormLabel className='text-gray-800 font-semibold'>Effective Date*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isSubmitting} />
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
                        <Input type="date" {...field} disabled={isSubmitting} />
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
                      <FormLabel className='text-gray-800 font-semibold'>Access Level*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="STAFF">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2 flex gap-4 pt-4 border-t">
                <Button type="submit" disabled={isSubmitting} className="w-40 font-bold">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      Add Staff
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outlineDanger"
                  onClick={() => router.push('/admin/staff')}
                  disabled={isSubmitting}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewStaffPage;
