import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

interface ProfilePageProps {
    auth: {
        user: {
            name: string;
            email: string;
            // add other user fields if needed
        };
    };
    customer: {
        id_number: string;
        cellphone_number: string;
        allergies: string;
        state: string;
        city: string;
        street: string;
        house_number: string;
        postal_code: string;
        // add other customer fields if needed
    };
    [key: string]: unknown; // Add index signature to satisfy PageProps constraint
}

export default function ProfileShow() {
    const { auth, customer } = usePage<ProfilePageProps>().props;
    const user = auth?.user || {};

    const { data } = useForm({
        id_number: customer.id_number || '',
        cellphone_number: customer.cellphone_number || '',
        allergies: customer.allergies || '',
        state: customer.state || '',
        city: customer.city || '',
        street: customer.street || '',
        house_number: customer.house_number || '',
        postal_code: customer.postal_code || '',
    });

    return (
        <AppLayout>
            <Head title="Profile Summary" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="My Profile" description="Your personal information and contact details." />
                    <div className="flex items-center gap-2">
                        {/* <Button asChild>
                            <Link href={route('customer.prescriptions.index')}>Go Back</Link>
                        </Button> */}
                        <Button asChild>
                            <Link href={route('customer.profile.edit')}>Edit Profile</Link>
                        </Button>
                    </div>
                </div>

                <div className="max-w-2xl space-y-6 py-6">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>Name</Label>
                            <Input value={user.name} disabled />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input value={user.email} disabled />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label htmlFor="id_number">ID Number</Label>
                            <Input id="id_number" value={data.id_number} disabled />
                        </div>
                        <div>
                            <Label htmlFor="cellphone_number">Cellphone Number</Label>
                            <Input id="cellphone_number" value={data.cellphone_number} disabled />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="allergies">Allergies</Label>
                        <Select defaultValue={data.allergies} disabled>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an allergy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="None">None</SelectItem>
                                <SelectItem value="Peanuts">Peanuts</SelectItem>
                                <SelectItem value="Shellfish">Shellfish</SelectItem>
                                <SelectItem value="Dairy">Dairy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <p>Address Information</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="street">Street</Label>
                                <Input id="street" value={data.street} disabled />
                            </div>
                            <div>
                                <Label htmlFor="street">House number</Label>
                                <Input id="house_number" value={data.house_number} disabled />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="street">City</Label>
                                <Input id="city" value={data.city} disabled />
                            </div>
                            <div>
                                <Label htmlFor="street">State</Label>
                                <Input id="state" value={data.state} disabled />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="postal_code">Postal Code</Label>
                            <Input id="postal_code" value={data.postal_code} disabled />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
