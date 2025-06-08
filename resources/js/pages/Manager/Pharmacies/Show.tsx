import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

// Define interfaces for the data structure passed from Laravel
interface ResponsiblePharmacist {
    id: number;
    name: string;
    email: string;
    // Add 'surname' here if you decide to store it on the User model
}

interface PharmacyDetails {
    id: number;
    name: string;
    health_council_registration_number: string;
    physical_address: string;
    contact_number: string;
    email: string;
    website_url: string;
    responsible_pharmacist_id: number | null;
    responsible_pharmacist?: ResponsiblePharmacist; // Optional, loaded via eager loading
}

interface PharmacyShowProps {
    pharmacy: PharmacyDetails | null; // Can be null if no pharmacy record exists yet
}

export default function PharmacyShow({ pharmacy }: PharmacyShowProps) {
    return (
        <AppLayout>
            <Head title="Pharmacy Details" />
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <Heading title="Pharmacy Details Overview" description="View the core information about your pharmacy." />
                    {/* Always show edit button for consistency, even if no data */}
                    <Link href={route('manager.pharmacy.edit')}>
                        <Button>Edit Pharmacy Details</Button>
                    </Link>
                </div>

                {pharmacy ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{pharmacy.name}</CardTitle>
                            <CardDescription>Health Council Reg. No: {pharmacy.health_council_registration_number}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-700">Physical Address:</h4>
                                <p className="text-lg">{pharmacy.physical_address || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700">Contact Number:</h4>
                                <p className="text-lg">{pharmacy.contact_number || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700">Email:</h4>
                                <p className="text-lg">{pharmacy.email || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700">Website URL:</h4>
                                <p className="text-lg">{pharmacy.website_url || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700">Responsible Pharmacist:</h4>
                                {pharmacy.responsible_pharmacist ? (
                                    <p className="text-lg">
                                        {pharmacy.responsible_pharmacist.name} ({pharmacy.responsible_pharmacist.email})
                                    </p>
                                ) : (
                                    <p className="text-lg text-gray-500">Not assigned</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>No Pharmacy Details Found</CardTitle>
                            <CardDescription>It looks like pharmacy details have not been set up yet.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-gray-700">
                                Use the "Edit Pharmacy Details" button above or below to add your pharmacy's information.
                            </p>
                            {/* Optionally, you can keep a second button here for more prominence */}
                            {/* <Link href={route('manager.pharmacy.edit')}>
                                <Button>Add Pharmacy Details Now</Button>
                            </Link> */}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
