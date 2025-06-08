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
import { route } from 'ziggy-js';

// Define interfaces for the data structure passed from Laravel
interface Pharmacist {
    id: number;
    name: string;
    email: string;
}

interface PharmacyDetails {
    id: number; // ID is now required for an existing pharmacy
    name: string;
    health_council_registration_number: string;
    physical_address: string;
    contact_number: string;
    email: string;
    website_url: string;
    responsible_pharmacist_id: number | null;
}

interface PharmacyEditProps {
    pharmacy: PharmacyDetails; // Now expects an existing pharmacy object
    pharmacists: Pharmacist[];
    errors: Record<string, string>;
}

export default function PharmacyEdit({ pharmacy, pharmacists, errors }: PharmacyEditProps) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        // Pre-fill form data with existing pharmacy details
        name: pharmacy.name,
        health_council_registration_number: pharmacy.health_council_registration_number,
        physical_address: pharmacy.physical_address,
        contact_number: pharmacy.contact_number,
        email: pharmacy.email,
        website_url: pharmacy.website_url,
        responsible_pharmacist_id: pharmacy.responsible_pharmacist_id,
    });

    useEffect(() => {
        if (recentlySuccessful) {
            toast.success('Pharmacy details updated successfully!');
            // Inertia will redirect to the index page upon successful update
        }
    }, [recentlySuccessful]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use 'put' method for updating an existing resource
        // Pass the pharmacy ID to the route helper
        put(route('manager.pharmacies.update', pharmacy.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit ${pharmacy.name}`} /> {/* Dynamic title */}
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
                <Heading title={`Edit Pharmacy: ${pharmacy.name}`} description="Update the details for this pharmacy." />

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Pharmacy Information</CardTitle>
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
                                    {processing ? 'Updating Pharmacy...' : 'Update Pharmacy Details'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
