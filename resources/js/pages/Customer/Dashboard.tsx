import Heading from '@/components/heading'; // Assuming you have a Heading component
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

// Define types for props if you plan to pass any user data initially
interface CustomerDashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            surname: string;
            email: string;
            // Add any other user properties you need to display
        };
    };
    // You might pass counts of pending prescriptions, available repeats etc. here
    pendingPrescriptionsCount?: number;
    availableRepeatsCount?: number;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ auth, pendingPrescriptionsCount = 0, availableRepeatsCount = 0 }) => {
    const { user } = auth;

    return (
        <AppLayout>
            <Head title="Customer Dashboard" />

            <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <Heading title={`Welcome Back, ${user.name}!`} description="Your personalized portal to manage prescriptions and orders." />

                {/* Overview Card (Optional) */}
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Your Pharmacy at a Glance</CardTitle>
                        <CardDescription>Quick insights into your prescription status.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-md border p-4 shadow-sm">
                            <h3 className="text-2xl font-bold">{pendingPrescriptionsCount}</h3> {/* This will now get the correct value */}
                            <p className="text-sm text-gray-500">Pending Prescriptions</p>
                        </div>
                        <div className="rounded-md border p-4 shadow-sm">
                            <h3 className="text-2xl font-bold">{availableRepeatsCount}</h3> {/* This will now get the correct value */}
                            <p className="text-sm text-gray-500">Available Repeats</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Navigation */}
                <Card>
                    <CardHeader>
                        <CardTitle>What would you like to do today?</CardTitle>
                        <CardDescription>Access key functionalities quickly.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {/* Load a New Prescription */}
                        <Card className="flex flex-col items-center justify-center p-6 text-center transition-colors">
                            <CardTitle className="mb-2 text-lg">Upload Prescription</CardTitle>
                            <CardDescription className="mb-4">Submit a new prescription for dispensing.</CardDescription>
                            <Button asChild className="w-full">
                                <Link href={route('customer.prescriptions.create')}>Upload Now</Link>
                            </Button>
                        </Card>

                        {/* Manage Prescriptions & Repeats */}
                        <Card className="flex flex-col items-center justify-center p-6 text-center transition-colors">
                            <CardTitle className="mb-2 text-lg">My Prescriptions</CardTitle>
                            <CardDescription className="mb-4">View status, details, and manage repeats.</CardDescription>
                            <Button asChild className="w-full">
                                <Link href={route('customer.prescriptions.index')}>View All</Link>
                            </Button>
                        </Card>

                        {/* Generate Reports */}
                        <Card className="flex flex-col items-center justify-center p-6 text-center transition-colors">
                            <CardTitle className="mb-2 text-lg">Generate Reports</CardTitle>
                            <CardDescription className="mb-4">Create PDF reports of your history.</CardDescription>
                            <Button asChild className="w-full">
                                <Link href={route('customer.reports.index')}>Create Report</Link>
                            </Button>
                        </Card>

                        {/* Manage Profile (Optional, but good for completeness) */}
                        <Card className="flex flex-col items-center justify-center p-6 text-center transition-colors">
                            <CardTitle className="mb-2 text-lg">My Profile</CardTitle>
                            <CardDescription className="mb-4">Update your personal details and allergies.</CardDescription>
                            <Button asChild className="w-full" variant="outline">
                                <Link href={route('customer.profile.edit')}>Edit Profile</Link>
                            </Button>
                        </Card>
                    </CardContent>
                </Card>

                {/* You can add more sections here, e.g., "Notifications", "Recent Activity" */}
            </div>
        </AppLayout>
    );
};

export default CustomerDashboard;
