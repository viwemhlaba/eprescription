import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

// Define interfaces for the data structure passed from Laravel
interface Pharmacist {
    id: number;
    name: string;
    email: string;
}

interface PharmacyCreateProps {
    pharmacists: Pharmacist[];
    errors: Record<string, string>; // Inertia's prop for validation errors
}

export default function PharmacyCreate({ pharmacists, errors }: PharmacyCreateProps) {
    // Initialize useForm with empty strings/null for new record
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        name: '',
        health_council_registration_number: '',
        physical_address: '',
        contact_number: '',
        email: '',
        website_url: '',
        responsible_pharmacist_id: null as number | null,
    });

    // Show a success toast when the form is successfully submitted
    useEffect(() => {
        if (recentlySuccessful) {
            toast.success('Pharmacy added successfully!');
            // After successful creation, the controller redirects to the index page,
            // so no need to explicitly reset the form here.
        }
    }, [recentlySuccessful]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Send a POST request to the manager.pharmacies.store route
        post(route('manager.pharmacies.store'));
    };

    return (
        <AppLayout>
            <Head title="Add New Pharmacy" />
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
                <Heading title="Add New Pharmacy" description="Enter the details for a new pharmacy." />

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>New Pharmacy Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Pharmacy Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="health_council_registration_number">Health Council Registration Number</Label>
                                <Input
                                    id="health_council_registration_number"
                                    type="text"
                                    value={data.health_council_registration_number}
                                    onChange={(e) => setData('health_council_registration_number', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.health_council_registration_number && (
                                    <p className="text-sm text-red-500">{errors.health_council_registration_number}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="physical_address">Physical Address</Label>
                                <Input
                                    id="physical_address"
                                    type="text"
                                    value={data.physical_address}
                                    onChange={(e) => setData('physical_address', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.physical_address && <p className="text-sm text-red-500">{errors.physical_address}</p>}
                            </div>

                            <div>
                                <Label htmlFor="contact_number">Contact Number</Label>
                                <Input
                                    id="contact_number"
                                    type="text"
                                    value={data.contact_number}
                                    onChange={(e) => setData('contact_number', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.contact_number && <p className="text-sm text-red-500">{errors.contact_number}</p>}
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="website_url">Website URL</Label>
                                <Input
                                    id="website_url"
                                    type="text"
                                    value={data.website_url}
                                    onChange={(e) => setData('website_url', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.website_url && <p className="text-sm text-red-500">{errors.website_url}</p>}
                            </div>

                            <div>
                                <Label htmlFor="responsible_pharmacist_id">Responsible Pharmacist</Label>
                                <Select
                                    value={data.responsible_pharmacist_id === null ? 'none-option' : data.responsible_pharmacist_id.toString()}
                                    onValueChange={(value) => setData('responsible_pharmacist_id', value === 'none-option' ? null : parseInt(value))}
                                >
                                    <SelectTrigger className="mt-1 block w-full">
                                        <SelectValue placeholder="Select a responsible pharmacist" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none-option">None</SelectItem> {/* Use a non-empty unique value */}
                                        {pharmacists.map((pharmacist) => (
                                            <SelectItem key={pharmacist.id} value={pharmacist.id.toString()}>
                                                {pharmacist.name} ({pharmacist.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.responsible_pharmacist_id && <p className="text-sm text-red-500">{errors.responsible_pharmacist_id}</p>}
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Adding Pharmacy...' : 'Add Pharmacy'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
