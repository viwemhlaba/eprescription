import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function CreateCustomer() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        surname: '',
        email: '',
        id_number: '',
        cellphone_number: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('pharmacist.customers.store'), {
            onSuccess: () => {
                toast.success('Customer account created successfully! Customer has been notified via email.');
            },
            onError: (errors) => {
                console.error('Error creating customer:', errors);
                toast.error('Failed to create customer account. Please check for errors.');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Customer Account" />

            <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <Heading title="Create Customer Account" description="Create a new customer account for walk-in patients" />

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                        <CardDescription>
                            Enter the customer's details to create their account. They will receive login credentials via email.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">First Name</Label>
                                    <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="surname">Last Name</Label>
                                    <Input
                                        id="surname"
                                        type="text"
                                        value={data.surname}
                                        onChange={(e) => setData('surname', e.target.value)}
                                        required
                                    />
                                    {errors.surname && <p className="text-sm text-red-500">{errors.surname}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="id_number">ID Number</Label>
                                <Input
                                    id="id_number"
                                    type="text"
                                    value={data.id_number}
                                    onChange={(e) => setData('id_number', e.target.value)}
                                    required
                                />
                                {errors.id_number && <p className="text-sm text-red-500">{errors.id_number}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cellphone_number">Cellphone Number</Label>
                                <Input
                                    id="cellphone_number"
                                    type="text"
                                    value={data.cellphone_number}
                                    onChange={(e) => setData('cellphone_number', e.target.value)}
                                    required
                                />
                                {errors.cellphone_number && <p className="text-sm text-red-500">{errors.cellphone_number}</p>}
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating Account...' : 'Create Customer Account'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
