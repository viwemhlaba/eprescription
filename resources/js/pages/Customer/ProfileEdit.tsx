import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

type ProfileEditPageProps = {
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
};

export default function ProfileEdit() {
    const { auth, customer } = usePage<ProfileEditPageProps>().props;
    const user = auth?.user || {};

    const { data, setData, put, processing, errors } = useForm({
        id_number: customer.id_number || '',
        cellphone_number: customer.cellphone_number || '',
        allergies: customer.allergies || '',
        state: customer.state || '',
        city: customer.city || '',
        street: customer.street || '',
        house_number: customer.house_number || '',
        postal_code: customer.postal_code || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('customer.profile.update'));
    };

    const provinces = [
        'Eastern Cape',
        'Free State',
        'Gauteng',
        'KwaZulu-Natal',
        'Limpopo',
        'Mpumalanga',
        'Northern Cape',
        'North West',
        'Western Cape',
    ];

    const allergies = ['None', 'Peanuts', 'Shellfish', 'Dust', 'Pollen'];

    return (
        <AppLayout>
            <Heading title="Edit Profile" description="Update your information." />

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Name</Label>
                        <Input value={user.name} disabled />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input value={user.email} disabled />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="id_number">ID Number</Label>
                        <Input id="id_number" value={data.id_number} onChange={(e) => setData('id_number', e.target.value)} />
                        {errors.id_number && <p className="text-sm text-red-500">{errors.id_number}</p>}
                    </div>
                    <div>
                        <Label htmlFor="cellphone_number">Cellphone Number</Label>
                        <Input id="cellphone_number" value={data.cellphone_number} onChange={(e) => setData('cellphone_number', e.target.value)} />
                    </div>
                </div>

                <div>
                    <Label htmlFor="allergies">Allergies</Label>
                    <Select onValueChange={(value) => setData('allergies', value)} defaultValue={data.allergies}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an allergy" />
                        </SelectTrigger>
                        <SelectContent>
                            {allergies.map((allergy) => (
                                <SelectItem key={allergy} value={allergy}>
                                    {allergy}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="state">Province</Label>
                        <Select onValueChange={(value) => setData('state', value)} defaultValue={data.state}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your province" />
                            </SelectTrigger>
                            <SelectContent>
                                {provinces.map((province) => (
                                    <SelectItem key={province} value={province}>
                                        {province}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="street">Street</Label>
                        <Input id="street" value={data.street} onChange={(e) => setData('street', e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="house_number">House Number</Label>
                        <Input id="house_number" value={data.house_number} onChange={(e) => setData('house_number', e.target.value)} />
                    </div>
                </div>

                <div>
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input id="postal_code" value={data.postal_code} onChange={(e) => setData('postal_code', e.target.value)} />
                </div>

                <Button type="submit" disabled={processing}>
                    Update Profile
                </Button>
            </form>
        </AppLayout>
    );
}
