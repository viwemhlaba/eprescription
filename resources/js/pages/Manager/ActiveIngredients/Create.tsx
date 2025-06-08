import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

// No props needed for this component, as it's for creating a new record

export default function ActiveIngredientCreate() {
    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        name: '',
    });

    useEffect(() => {
        if (recentlySuccessful) {
            toast.success('Active ingredient added successfully!');
            // No need to reset form explicitly as controller redirects on success
        }
    }, [recentlySuccessful]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('manager.activeIngredients.store')); // POST request to store route
    };

    return (
        <AppLayout>
            <Head title="Add Active Ingredient" />
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
                <Heading title="Add New Active Ingredient" description="Enter the name for a new active ingredient." />

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Active Ingredient Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Active Ingredient Name</Label>
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

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Adding...' : 'Add Active Ingredient'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
