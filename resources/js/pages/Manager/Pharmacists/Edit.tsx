import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

// Define interface for the nested Pharmacist details
interface PharmacistDetails {
    id: number;
    user_id: number;
    id_number: string;
    cellphone_number: string;
    health_council_registration_number: string;
    // Add other fields from Pharmacist model if needed
}

// Define interface for the User record (which represents the Pharmacist in the list)
interface PharmacistUser {
    id: number;
    name: string;
    surname: string;
    email: string;
    // Add other fields from User model if needed, e.g., role, email_verified_at, password_changed_at
    pharmacist: PharmacistDetails; // This will be loaded by the controller
}

interface PharmacistEditProps {
    pharmacist: PharmacistUser; // Passes the User model with nested pharmacist details
    errors: Record<string, string>;
}

export default function PharmacistEdit({ pharmacist, errors }: PharmacistEditProps) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        // User Table Fields
        name: pharmacist.name,
        surname: pharmacist.surname,
        email: pharmacist.email,
        // Pharmacist Table Fields (nested)
        id_number: pharmacist.pharmacist.id_number,
        cellphone_number: pharmacist.pharmacist.cellphone_number,
        health_council_registration_number: pharmacist.pharmacist.health_council_registration_number,
        // Optional Password Change Fields
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (recentlySuccessful) {
            toast.success('Pharmacist details updated successfully!');
        }
    }, [recentlySuccessful]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('manager.pharmacists.update', pharmacist.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit ${pharmacist.name} ${pharmacist.surname}`} />
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
                <Heading
                    title={`Edit Pharmacist: ${pharmacist.name} ${pharmacist.surname}`}
                    description="Update the details for this pharmacist user."
                />

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Pharmacist Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* User Table Fields */}
                            <h4 className="mb-2 text-lg font-semibold">Basic User Information</h4>
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                    autoFocus
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="surname">Surname</Label>
                                <Input
                                    id="surname"
                                    type="text"
                                    value={data.surname}
                                    onChange={(e) => setData('surname', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.surname && <p className="text-sm text-red-500">{errors.surname}</p>}
                            </div>

                            <div>
                                <Label htmlFor="email">E-mail Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            {/* Pharmacist Table Fields */}
                            <h4 className="mt-6 mb-2 border-t pt-4 text-lg font-semibold">Professional Details</h4>
                            <div>
                                <Label htmlFor="id_number">ID Number</Label>
                                <Input
                                    id="id_number"
                                    type="text"
                                    value={data.id_number}
                                    onChange={(e) => setData('id_number', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.id_number && <p className="text-sm text-red-500">{errors.id_number}</p>}
                            </div>

                            <div>
                                <Label htmlFor="cellphone_number">Cellphone Number</Label>
                                <Input
                                    id="cellphone_number"
                                    type="text"
                                    value={data.cellphone_number}
                                    onChange={(e) => setData('cellphone_number', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.cellphone_number && <p className="text-sm text-red-500">{errors.cellphone_number}</p>}
                            </div>

                            <div>
                                <Label htmlFor="health_council_registration_number">Health Council Registration Number</Label>
                                <Input
                                    id="health_council_registration_number"
                                    type="text"
                                    value={data.health_council_registration_number}
                                    onChange={(e) => setData('health_council_registration_number', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.health_council_registration_number && (
                                    <p className="text-sm text-red-500">{errors.health_council_registration_number}</p>
                                )}
                            </div>

                            {/* Optional Password Change Fields */}
                            <div className="mt-6 border-t pt-4">
                                <h4 className="mb-3 text-lg font-semibold">Change Password (Optional)</h4>
                                <div>
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                    />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                    />
                                    {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating Pharmacist...' : 'Update Pharmacist'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
