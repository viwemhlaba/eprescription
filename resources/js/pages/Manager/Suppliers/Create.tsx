import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

export default function SupplierCreate() {
    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        name: '',
        contact_person: '',
        email: '',
    });

    useEffect(() => {
        if (recentlySuccessful) {
            toast.success('Supplier added successfully!');
        }
    }, [recentlySuccessful]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('manager.suppliers.store'));
    };

    return (
        <AppLayout>
            <Head title="Add Supplier" />
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
                <Heading title="Add New Supplier" description="Enter the details for a new medication supplier." />
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Supplier Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Supplier Name</Label>
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
                                <Label htmlFor="contact_person">Contact Person</Label>
                                <Input
                                    id="contact_person"
                                    type="text"
                                    value={data.contact_person}
                                    onChange={(e) => setData('contact_person', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.contact_person && <p className="text-sm text-red-500">{errors.contact_person}</p>}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
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
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Supplier'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
