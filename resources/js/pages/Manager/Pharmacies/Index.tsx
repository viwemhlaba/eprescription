import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';
import { toast } from 'sonner'; // Assuming you have sonner/ui for toasts

// Define interfaces (unchanged from previous)
interface ResponsiblePharmacist {
    id: number;
    name: string;
    email: string;
}

interface Pharmacy {
    id: number;
    name: string;
    health_council_registration_number: string;
    physical_address: string;
    contact_number: string;
    email: string;
    website_url: string;
    responsible_pharmacist_id: number | null;
    responsible_pharmacist?: ResponsiblePharmacist;
}

interface PharmacyIndexProps {
    pharmacies: Pharmacy[];
}

export default function PharmacyIndex({ pharmacies }: PharmacyIndexProps) {
    // Safely access flash and its success property
    const pageProps = usePage().props as { flash?: { success?: string } }; // Ensure 'flash' itself is optional
    const flashSuccessMessage = pageProps.flash?.success; // Use optional chaining

    React.useEffect(() => {
        if (flashSuccessMessage) {
            toast.success(flashSuccessMessage);
        }
    }, [flashSuccessMessage]);

    return (
        <AppLayout>
            <Head title="Managed Pharmacies" />
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <Heading title="Your Managed Pharmacies" description="View and manage the pharmacies assigned to you." />
                    <Link href={route('manager.pharmacies.create')}>
                        <Button>Add New Pharmacy</Button>
                    </Link>
                </div>

                {pharmacies.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {pharmacies.map((pharmacy) => (
                            <Card key={pharmacy.id}>
                                <CardHeader>
                                    <CardTitle>{pharmacy.name}</CardTitle>
                                    <CardDescription>Reg. No: {pharmacy.health_council_registration_number}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-muted-foreground text-sm">
                                        <strong className="text-gray-800">Address:</strong> {pharmacy.physical_address || 'N/A'}
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        <strong className="text-gray-800">Contact:</strong> {pharmacy.contact_number || 'N/A'}
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        <strong className="text-gray-800">Email:</strong> {pharmacy.email || 'N/A'}
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        <strong className="text-gray-800">Website:</strong> {pharmacy.website_url || 'N/A'}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <strong className="text-sm text-gray-800">Responsible Pharmacist:</strong>
                                        {pharmacy.responsible_pharmacist ? (
                                            <Badge variant="secondary">{pharmacy.responsible_pharmacist.name}</Badge>
                                        ) : (
                                            <Badge variant="outline">Not Assigned</Badge>
                                        )}
                                    </div>
                                    {/* NEW: Add the Edit button here */}
                                    <div className="mt-4 flex justify-end">
                                        <Link href={route('manager.pharmacies.edit', pharmacy.id)}>
                                            <Button variant="outline" size="sm">
                                                Edit Details
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="py-8 text-center">
                        <CardHeader>
                            <CardTitle>No Pharmacies Managed Yet</CardTitle>
                            <CardDescription>It looks like you haven't added any pharmacies to manage.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-gray-700">Click the button above to add your first pharmacy.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
