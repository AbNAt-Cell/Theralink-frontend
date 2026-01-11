'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getPayers, addClientPolicy, Payer } from '@/hooks/admin/insurance';
import AdminClientProfile from '@/components/AdminClientProfile';

const policySchema = z.object({
    payerName: z.string().min(1, 'Insurance type is required'),
    policyNumber: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isPrimary: z.boolean().default(false),
    insuredIsDifferent: z.boolean().default(false),
    hasCopay: z.boolean().default(false),
});

type PolicyFormValues = z.infer<typeof policySchema>;

interface PageProps {
    params: {
        id: string; // Client ID
    };
}

const AddInsurancePage = ({ params }: PageProps) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const [payers, setPayers] = useState<Payer[]>([]);

    useEffect(() => {
        const loadPayers = async () => {
            const data = await getPayers();
            setPayers(data);
        };
        loadPayers();
    }, []);

    const form = useForm<PolicyFormValues>({
        resolver: zodResolver(policySchema),
        defaultValues: {
            payerName: '',
            policyNumber: '',
            startDate: '',
            endDate: '',
            isPrimary: true, // Defaulting to primary as per usual flow
            insuredIsDifferent: false,
            hasCopay: false,
        },
    });

    const onSubmit = async (data: PolicyFormValues) => {
        setLoading(true);
        try {
            const selectedPayer = payers.find(p => p.name === data.payerName);

            await addClientPolicy({
                client_id: params.id,
                payer_id: selectedPayer?.id, // Ensure we have the ID if matched
                policy_number: data.policyNumber,
                start_date: data.startDate,
                end_date: data.endDate,
                is_primary: data.isPrimary,
                insured_is_different: data.insuredIsDifferent,
                has_copay: data.hasCopay
                // If payer isn't in DB (Other), we might need to handle it differently 
                // but for now relying on Select from existing payers.
                // Or we could have logic to create a new payer if "Other" logic was fully spec'd.
            });

            toast({
                title: 'Success',
                description: 'Insurance policy added successfully',
            });
            router.push(`/admin/clients/${params.id}`);

        } catch (err) {
            const error = err as Error;
            console.error('Error adding policy: ', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to add policy.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='space-y-6'>
            <AdminClientProfile />

            <div className='bg-white rounded-md shadow-sm border p-6 max-w-2xl'>
                <h2 className='text-xl font-semibold mb-6'>Add Insurance</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <FormField
                                control={form.control}
                                name='payerName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Insurance Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Insurance Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {payers.map((payer) => (
                                                    <SelectItem key={payer.id} value={payer.name}>{payer.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='policyNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Policy#</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='startDate'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="date" {...field} />
                                                {/* Calendar Icon is native in type='date' in many browsers, 
                            but for custom look we might overlay or use a library. 
                            Keeping simple native for now to match functionality. */}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='endDate'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='space-y-3'>
                            <FormField
                                control={form.control}
                                name='isPrimary'
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className='bg-blue-900 data-[state=checked]:bg-blue-900 border-blue-900'
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Primary
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='insuredIsDifferent'
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Insured is different from client
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='hasCopay'
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Has Co-Pay
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex gap-4 pt-4'>
                            <Button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white w-32" disabled={loading}>
                                Add Insurance
                            </Button>
                            <Button type="button" variant="outline" className="w-32" onClick={() => router.back()}>
                                Cancel
                            </Button>
                        </div>

                    </form>
                </Form>
            </div>
        </div>
    );
};

export default AddInsurancePage;
