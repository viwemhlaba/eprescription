import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout'; // Assuming you use AppLayout for your main structure
import { Head, Link } from '@inertiajs/react';

// Define the type for the pharmacist data coming from props
interface PharmacistData {
    name: string;
    surname: string;
    idNumber: string;
    cellphoneNumber: string;
    emailAddress: string;
    healthCouncilRegistrationNumber: string;
    registrationDate: string;
}

// Define the props interface for the component
interface EditProfileProps {
    pharmacist: PharmacistData;
}

const EditProfile = ({ pharmacist }: EditProfileProps) => {
    // You'll typically use Inertia's useForm hook here to manage form state and submission
    // For now, we'll just display the data read-only.

    return (
        <AppLayout>
            <Head title="Edit Pharmacist Profile" />
            <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>This is the Edit Profile page. You will build your form here.</p>
                        <p>
                            Currently showing: {pharmacist.name} {pharmacist.surname}
                        </p>
                        {/* Example of how you might use input fields later */}
                        {/*
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="editName">Name</Label>
                                <Input id="editName" value={pharmacist.name} onChange={(e) => {}} />
                            </div>
                            // ... other input fields
                        </div>
                        */}
                    </CardContent>
                </Card>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" asChild>
                        <Link href={route('pharmacist.profile')}>Cancel</Link>
                    </Button>
                    {/* You'd have a submit button here once you implement the form */}
                    {/* <Button type="submit">Save Changes</Button> */}
                </div>
            </div>
        </AppLayout>
    );
};

export default EditProfile;
