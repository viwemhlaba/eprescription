import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

// NEW: Define the type for an Active Ingredient
interface ActiveIngredient {
    id: number;
    name: string;
    // Add other fields from your active_ingredients table if needed
}

export default function ProfileCreate() {
    type AuthUser = {
        name: string;
        email: string;
        surname?: string;
        id_number?: string;
        cellphone_number?: string;
    };

    type PageProps = {
        auth: {
            user: AuthUser;
        };
        activeIngredients: ActiveIngredient[]; // <--- NEW PROP: Array of active ingredients
        // If you are pre-filling existing profile data from backend, define it here
        // profileData?: {
        //     id_number: string;
        //     cellphone_number: string;
        //     allergies: number[]; // Change to array of IDs if multiple allergies are selected
        //     state: string;
        //     city: string;
        //     street: string;
        //     house_number: string;
        //     postal_code: string;
        // };
    };

    const { auth, activeIngredients } = usePage<PageProps>().props; // <--- Destructure activeIngredients
    const user = auth?.user || { name: '', email: '', surname: '' };

    const { data, setData, post, processing, errors } = useForm({
        id_number: '',
        cellphone_number: '',
        allergies: '', // For simplicity, if storing as a single string name.
        // If multiple allergies are allowed and stored as IDs, this needs to be:
        // allergies: [] as number[],
        state: '',
        city: '',
        street: '',
        house_number: '',
        postal_code: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('customer.profile.store'), {
            onSuccess: () => {
                console.log('Profile created successfully!');
                // You might redirect or show a success message here
            },
            onError: (formErrors) => {
                console.error('Profile creation failed:', formErrors);
            },
        });
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

    // The 'None' option can be added manually or managed on the backend
    // Use id: null for 'None' to avoid invalid foreign key (0 is not a valid id in DB)
    const allergyOptions = [{ id: null, name: 'None' }, ...activeIngredients];

    return (
        <AppLayout>
            <div className="flex justify-center py-6 sm:py-10 lg:py-12">
                <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-8">
                    <Heading
                        title="Complete Your Profile"
                        description="Please provide your personal and address details to get started with your pharmacy services."
                    />

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Details that help us identify you.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={user.name} disabled className="bg-gray-100 dark:bg-gray-800" />
                                </div>
                                {user.surname && (
                                    <div>
                                        <Label htmlFor="surname">Surname</Label>
                                        <Input id="surname" value={user.surname} disabled className="bg-gray-100 dark:bg-gray-800" />
                                    </div>
                                )}
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={user.email} disabled className="bg-gray-100 dark:bg-gray-800" />
                                </div>
                                <div>
                                    <Label htmlFor="cellphone_number">Cellphone Number</Label>
                                    <Input
                                        id="cellphone_number"
                                        type="tel"
                                        value={data.cellphone_number}
                                        onChange={(e) => setData('cellphone_number', e.target.value)}
                                        required
                                    />
                                    {errors.cellphone_number && <p className="mt-1 text-sm text-red-500">{errors.cellphone_number}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="id_number">ID Number</Label>
                                <Input id="id_number" value={data.id_number} onChange={(e) => setData('id_number', e.target.value)} required />
                                {errors.id_number && <p className="mt-1 text-sm text-red-500">{errors.id_number}</p>}
                            </div>

                            <div>
                                <Label htmlFor="allergies">Allergies (Select if applicable)</Label>
                                {/* Update Select to use allergyOptions */}
                                <Select onValueChange={(value) => setData('allergies', value)} value={data.allergies}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an allergy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allergyOptions.map((allergy) => (
                                            <SelectItem key={allergy.id} value={allergy.name}>
                                                {allergy.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.allergies && <p className="mt-1 text-sm text-red-500">{errors.allergies}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Residential Address</CardTitle>
                            <CardDescription>This will be used for delivery and record-keeping.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="state">Province</Label>
                                    <Select onValueChange={(value) => setData('state', value)} value={data.state} required>
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
                                    {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} required />
                                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="street">Street Name</Label>
                                    <Input id="street" value={data.street} onChange={(e) => setData('street', e.target.value)} required />
                                    {errors.street && <p className="mt-1 text-sm text-red-500">{errors.street}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="house_number">House/Unit Number</Label>
                                    <Input
                                        id="house_number"
                                        value={data.house_number}
                                        onChange={(e) => setData('house_number', e.target.value)}
                                        required
                                    />
                                    {errors.house_number && <p className="mt-1 text-sm text-red-500">{errors.house_number}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="postal_code">Postal Code</Label>
                                <Input id="postal_code" value={data.postal_code} onChange={(e) => setData('postal_code', e.target.value)} required />
                                {errors.postal_code && <p className="mt-1 text-sm text-red-500">{errors.postal_code}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={processing} onClick={handleSubmit}>
                            {processing ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
