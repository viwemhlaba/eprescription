import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

// Define the type for the authenticated user data from Inertia's default props
interface AuthUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: string;
    // Add any other fields directly on the User model that you want to display
    surname?: string | null;
    id_number?: string | null;
    phone_number?: string | null;
    registration_number?: string | null;
    registration_date?: string | null;
}

interface PharmacistProfileProps {
    auth: {
        user: AuthUser; // This prop is always provided by Inertia by default for authenticated users
    };
}

const PharmacistProfile = ({ auth }: PharmacistProfileProps) => {
    // Directly use the user object from auth.user
    const pharmacist = auth.user; // Rename for consistency with template, but it's auth.user

    // You might still want a safe default for optional properties on the user object
    const safePharmacist = {
        name: pharmacist.name ?? 'N/A',
        surname: pharmacist.surname ?? 'N/A',
        idNumber: pharmacist.id_number ?? 'N/A', // Using id_number from backend
        cellphoneNumber: pharmacist.phone_number ?? 'N/A', // Using phone_number from backend
        emailAddress: pharmacist.email ?? 'N/A',
        healthCouncilRegistrationNumber: pharmacist.registration_number ?? 'N/A',
        registrationDate: pharmacist.registration_date ?? 'N/A',
    };

    return (
        <AppLayout>
            <Head title="Pharmacist Profile" />
            <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <div id="name" className="text-xl font-medium">
                                    {safePharmacist.name}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="surname">Surname</Label>
                                <div id="surname" className="text-xl font-medium">
                                    {safePharmacist.surname}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="idNumber">ID Number</Label>
                                <div id="idNumber" className="text-xl font-medium">
                                    {safePharmacist.idNumber}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cellphoneNumber">Cellphone Number</Label>
                                <div id="cellphoneNumber" className="text-xl font-medium">
                                    {safePharmacist.cellphoneNumber}
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="emailAddress">Email Address</Label>
                                <div id="emailAddress" className="text-xl font-medium">
                                    {safePharmacist.emailAddress}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Professional Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="healthCouncilRegistrationNumber">Health Council Registration Number</Label>
                                <div id="healthCouncilRegistrationNumber" className="text-xl font-medium">
                                    {safePharmacist.healthCouncilRegistrationNumber}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="registrationDate">Registration Date</Label>
                                <div id="registrationDate" className="text-xl font-medium">
                                    {safePharmacist.registrationDate}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button variant="outline" asChild>
                                <Link href={route('pharmacist.profile.edit')}>Edit Profile</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default PharmacistProfile;
