import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

export default function PharmacistCreate() {
    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        // User Table Fields
        name: '',
        surname: '',
        email: '',
        // Pharmacist Table Fields
        id_number: '',
        cellphone_number: '',
        health_council_registration_number: '',
    });

    useEffect(() => {
        if (recentlySuccessful) {
            toast.success('Pharmacist account created and login details sent!');
        }
    }, [recentlySuccessful]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('manager.pharmacists.store'));
    };

    return (
        <AppLayout>
            <Head title="Add New Pharmacist" />
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
                <Heading title="Add New Pharmacist" description="Enter the details for the new pharmacist user." />

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Pharmacist Details</CardTitle>
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

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating Pharmacist...' : 'Create Pharmacist Account'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
