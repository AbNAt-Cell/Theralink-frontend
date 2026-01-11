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
import { getClientById, updateClient } from '@/hooks/admin/client';
import { getPayers, Payer } from '@/hooks/admin/insurance';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const editClientFormSchema = z.object({
    prefix: z.string().optional(),
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    suffix: z.string().optional(),
    nickName: z.string().optional(),
    recordNumber: z.string().optional(),
    gender: z.string().optional(),
    dateOfBirth: z.string().optional(),
    ssn: z.string().optional(),
    race: z.string().optional(),
    startDate: z.string().optional(),
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

type FormValues = z.infer<typeof editClientFormSchema>;

interface PageProps {
    params: { id: string };
}

const EditClientPage = ({ params }: PageProps) => {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();
    const [payers, setPayers] = useState<Payer[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(editClientFormSchema),
        defaultValues: {
            prefix: '',
            firstName: '',
            middleName: '',
            lastName: '',
            suffix: '',
            nickName: '',
            recordNumber: '',
            gender: '',
            dateOfBirth: '',
            ssn: '',
            race: '',
            startDate: '',
            email: '',
            phone: '',
            workPhone: '',
            address: { street: '', city: '', state: '', zipCode: '' },
            physicalAddress: { street: '', line2: '', city: '', state: '', zipCode: '' },
            comments: '',
            isPrivatePay: false,
            insurance: { insuranceType: '', policyNumber: '', startDate: '', endDate: '' },
            assignedSite: '',
        },
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [clientData, payerData] = await Promise.all([
                    getClientById(params.id),
                    getPayers()
                ]);
                setPayers(payerData);

                // Populate form with existing data
                form.reset({
                    prefix: clientData.prefix || '',
                    firstName: clientData.firstName || '',
                    middleName: clientData.middleName || '',
                    lastName: clientData.lastName || '',
                    suffix: clientData.suffix || '',
                    nickName: clientData.nickname || '',
                    recordNumber: clientData.recordNumber || '',
                    gender: clientData.gender || '',
                    dateOfBirth: clientData.dateOfBirth?.split('T')[0] || '',
                    ssn: clientData.ssn || '',
                    race: clientData.race || '',
                    startDate: clientData.startDate?.split('T')[0] || '',
                    email: clientData.email || '',
                    phone: clientData.phone || '',
                    workPhone: clientData.workPhone || '',
                    address: {
                        street: clientData.address?.street || '',
                        city: clientData.address?.city || '',
                        state: clientData.address?.state || '',
                        zipCode: clientData.address?.zipCode || '',
                    },
                    physicalAddress: {
                        street: clientData.physicalAddress?.street || '',
                        line2: clientData.physicalAddress?.line2 || '',
                        city: clientData.physicalAddress?.city || '',
                        state: clientData.physicalAddress?.state || '',
                        zipCode: clientData.physicalAddress?.zipCode || '',
                    },
                    comments: clientData.comments || '',
                    isPrivatePay: clientData.isPrivatePay || false,
                    insurance: {
                        insuranceType: clientData.insurance?.insuranceType || '',
                        policyNumber: clientData.insurance?.policyNumber || '',
                        startDate: clientData.insurance?.startDate?.split('T')[0] || '',
                        endDate: clientData.insurance?.endDate?.split('T')[0] || '',
                    },
                    assignedSite: clientData.assignedSite || '',
                });
            } catch (error) {
                console.error('Error loading client data:', error);
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to load client data' });
            } finally {
                setInitialLoading(false);
            }
        };
        loadData();
    }, [params.id, form, toast]);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            await updateClient(params.id, data);
            toast({ title: 'Success', description: 'Client updated successfully' });
            router.push(`/admin/clients/${params.id}`);
        } catch (err) {
            const error = err as Error;
            console.error('Error updating client:', error);
            toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to update client' });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="animate-spin h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-black text-white p-4 rounded-t-md">
                <h1 className="text-xl font-semibold">Edit Client</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-md border">

                    {/* Name Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField control={form.control} name="prefix" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prefix</FormLabel>
                                <FormControl><Input placeholder="Mr./Mrs." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="middleName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Middle Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField control={form.control} name="gender" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="MALE">Male</SelectItem>
                                        <SelectItem value="FEMALE">Female</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="ssn" render={({ field }) => (
                            <FormItem>
                                <FormLabel>SSN</FormLabel>
                                <FormControl><Input placeholder="XXX-XX-XXXX" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* Contact Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="workPhone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Work Phone</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* Address Section */}
                    <div className="space-y-2">
                        <h3 className="font-semibold">Mailing Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <FormField control={form.control} name="address.street" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Street</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="address.city" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="address.state" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="address.zipCode" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                </FormItem>
                            )} />
                        </div>
                    </div>

                    {/* Insurance Section */}
                    <div className="space-y-2">
                        <h3 className="font-semibold">Insurance</h3>
                        <div className="flex items-center space-x-2 mb-4">
                            <FormField control={form.control} name="isPrivatePay" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <Label>Private Pay (No Insurance)</Label>
                                </FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <FormField control={form.control} name="insurance.insuranceType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Insurance Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select Payer" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {payers.map((payer) => (
                                                <SelectItem key={payer.id} value={payer.name}>{payer.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="insurance.policyNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Policy Number</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="insurance.startDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="insurance.endDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                </FormItem>
                            )} />
                        </div>
                    </div>

                    {/* Comments */}
                    <FormField control={form.control} name="comments" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comments</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                        </FormItem>
                    )} />

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white" disabled={loading}>
                            {loading ? <Loader className="animate-spin mr-2" /> : null}
                            Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default EditClientPage;
