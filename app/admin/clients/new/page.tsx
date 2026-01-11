'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cleanData } from '@/lib/utils';
import { createNewClient } from '@/hooks/admin/client';
import { getPayers, Payer } from '@/hooks/admin/insurance';
import { useUser } from '@/context/UserContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const newClientFormSchema = z.object({
  prefix: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  suffix: z.string().optional(),
  nickName: z.string().optional(),
  recordNumber: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  ssn: z.string().optional(), // Relaxed SSN validation for now
  race: z.string().optional(), // Changed to string to allow more flexibility or use Select
  clientStartDate: z.string().min(1, 'Client start date is required'),

  sexualOrientation: z.string().optional(),
  maritalStatus: z.string().optional(),
  genderIdentity: z.string().optional(),
  pregnancyStatus: z.string().optional(),
  genderPronouns: z.string().optional(),
  timezone: z.string().optional(),

  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  workPhone: z.string().optional(),

  address: z.object({
    street: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }),

  physicalAddress: z.object({
    street: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }),

  comments: z.string().optional(),

  isPrivatePay: z.boolean().default(false),

  insurance: z.object({
    insuranceType: z.string().optional(),
    policyNumber: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),

  assignedSite: z.string().optional(),
});

type FormValues = z.infer<typeof newClientFormSchema>;

const NewClientPage = () => {
  const [loading, setloading] = useState(false);
  const [goToProfile, setGoToProfile] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [payers, setPayers] = useState<Payer[]>([]);

  useEffect(() => {
    const loadPayers = async () => {
      const data = await getPayers();
      setPayers(data);
    };
    loadPayers();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(newClientFormSchema),
    defaultValues: {
      prefix: '',
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      nickName: '',
      recordNumber: '',
      gender: undefined,
      dateOfBirth: '',
      ssn: '',
      race: '',
      clientStartDate: new Date().toISOString().split('T')[0],
      sexualOrientation: '',
      maritalStatus: '',
      genderIdentity: '',
      pregnancyStatus: '',
      genderPronouns: '',
      timezone: '',
      email: '',
      phone: '',
      workPhone: '',
      address: {
        street: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
      },
      physicalAddress: {
        street: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
      },
      comments: '',
      isPrivatePay: false,
      insurance: {
        insuranceType: '',
        policyNumber: '',
        startDate: '',
        endDate: '',
      },
      assignedSite: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user?.clinicId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Clinic information not found. Please log in again.',
      });
      return;
    }

    setloading(true);
    try {
      const cleanedData = cleanData(data);
      // Map form fields to expected backend structure where names might slightly differ
      const payload = {
        ...cleanedData,
        startDate: data.clientStartDate, // Renamed in schema to avoid conflict
      };

      const response = await createNewClient(payload, user.clinicId);
      toast({
        title: 'Success',
        description: 'Client created successfully',
      });

      if (goToProfile) {
        router.push(`/admin/clients/${response.id}`);
      } else {
        router.push('/admin/clients');
      }

    } catch (err) {
      const error = err as Error;
      console.log('Error: ', error);
      toast({
        variant: 'destructive',
        title: 'Error:',
        description: error.message || 'Failed to create Client. Please try again.',
      });
    } finally {
      setloading(false);
    }
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="bg-black text-white px-4 py-2 rounded-t-md">
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );

  return (
    <div className=' pb-20'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>New Client</h1>
        {/* Buttons hidden as per some designs, but kept here if needed, or moved to bottom */}
      </div>

      <div className='mt-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>

            {/* Demographics Section */}
            <div className='bg-white rounded-md shadow-sm border'>
              <SectionHeader title="Demographics" />
              <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
                <FormField control={form.control} name='prefix' render={({ field }) => (
                  <FormItem><FormLabel>Prefix</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='firstName' render={({ field }) => (
                  <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name='middleName' render={({ field }) => (
                  <FormItem><FormLabel>Middle Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='lastName' render={({ field }) => (
                  <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name='suffix' render={({ field }) => (
                  <FormItem><FormLabel>Suffix</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='nickName' render={({ field }) => (
                  <FormItem><FormLabel>Nick Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='recordNumber' render={({ field }) => (
                  <FormItem><FormLabel>Record #</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='gender' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name='dateOfBirth' render={({ field }) => (
                  <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name='ssn' render={({ field }) => (
                  <FormItem><FormLabel>SSN</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='race' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Race</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Race" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="African">African</SelectItem>
                        <SelectItem value="Asian">Asian</SelectItem>
                        <SelectItem value="Hispanic">Hispanic</SelectItem>
                        <SelectItem value="White">White</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name='clientStartDate' render={({ field }) => (
                  <FormItem><FormLabel>Client Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name='sexualOrientation' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexual Orientations</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Heterosexual">Heterosexual</SelectItem>
                        <SelectItem value="Homosexual">Homosexual</SelectItem>
                        <SelectItem value="Bisexual">Bisexual</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name='maritalStatus' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name='genderIdentity' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender Identity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name='pregnancyStatus' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pregnancy Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Pregnant">Pregnant</SelectItem>
                        <SelectItem value="Not Pregnant">Not Pregnant</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name='genderPronouns' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender Pronouns</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="He/Him">He/Him</SelectItem>
                        <SelectItem value="She/Her">She/Her</SelectItem>
                        <SelectItem value="They/Them">They/Them</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name='timezone' render={({ field }) => (
                  <FormItem>
                    <FormLabel>TimeZone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">EST</SelectItem>
                        <SelectItem value="CST">CST</SelectItem>
                        <SelectItem value="PST">PST</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Address Section */}
            <div className='bg-white rounded-md shadow-sm border'>
              <SectionHeader title="Address" />
              <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
                <FormField control={form.control} name='address.street' render={({ field }) => (
                  <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='address.line2' render={({ field }) => (
                  <FormItem><FormLabel>Address Line 2</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='address.city' render={({ field }) => (
                  <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='address.state' render={({ field }) => (
                  <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='address.zipCode' render={({ field }) => (
                  <FormItem><FormLabel>Zip</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <div className='hidden md:block'></div> {/* Spacer */}
                <FormField control={form.control} name='workPhone' render={({ field }) => (
                  <FormItem><FormLabel>Work Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='email' render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name='phone' render={({ field }) => (
                  <FormItem><FormLabel>Mobile</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />

                {/* Physical Address */}
                <FormField control={form.control} name='physicalAddress.street' render={({ field }) => (
                  <FormItem><FormLabel>Physical Address Line 1</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='physicalAddress.line2' render={({ field }) => (
                  <FormItem><FormLabel>Physical Address Line 2</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='physicalAddress.city' render={({ field }) => (
                  <FormItem><FormLabel>Physical City</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='physicalAddress.state' render={({ field }) => (
                  <FormItem><FormLabel>Physical State</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name='physicalAddress.zipCode' render={({ field }) => (
                  <FormItem><FormLabel>Physical Zip</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
              </div>

              <div className='px-6 pb-6'>
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                <FormField control={form.control} name='comments' render={({ field }) => (
                  <FormItem><FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl></FormItem>
                )} />
              </div>
            </div>

            {/* Insurance Section */}
            <div className='col-span-2 bg-gray-50 p-4 rounded-lg'>
              <h2 className='text-xl font-semibold mb-4'>
                Insurance Information
              </h2>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name="isPrivatePay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-start space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>Private/Self Pay? (i.e. client is not covered by any policy or plan of insurance)</Label>
                    </FormItem>
                  )}
                />

                {!form.watch('isPrivatePay') && (
                  <div className='col-span-2 grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='insurance.insuranceType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-gray-800 font-semibold'>
                            Insurance Type*
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Payer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {payers.map((payer) => (
                                <SelectItem key={payer.id} value={payer.name}>{payer.name}</SelectItem>
                              ))}
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
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
                    <FormField control={form.control} name='insurance.startDate' render={({ field }) => (
                      <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name='insurance.endDate' render={({ field }) => (
                      <FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                )}
              </div>
            </div>

            {/* Settings & Actions */}
            <div className='bg-white rounded-md shadow-sm border'>
              <SectionHeader title="Settings & Actions" />
              <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-end'>
                <FormField control={form.control} name='assignedSite' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Site</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Assign Site" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {/* Todo: Fetch sites dynamically */}
                        <SelectItem value="Site A">Site A</SelectItem>
                        <SelectItem value="Site B">Site B</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <div className="flex items-center gap-2 mb-2">
                  <Label>Go to client profile after adding</Label>
                  <Switch checked={goToProfile} onCheckedChange={setGoToProfile} />
                </div>
              </div>
            </div>

            <div className='flex gap-4'>
              <Button type='submit' className="bg-primary hover:bg-primary/90 min-w-[100px]" disabled={loading}>
                {loading ? <Loader className='animate-spin h-4 w-4' /> : 'Submit'}
              </Button>
              <Button type='button' variant='outline' onClick={() => router.push('/admin/clients')}>
                Cancel
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewClientPage;
