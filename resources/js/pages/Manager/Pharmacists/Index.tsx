import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Define interface for the nested Pharmacist details (from the new pharmacists table)
interface PharmacistDetails {
    id: number; // ID of the pharmacist record
    user_id: number;
    id_number: string;
    cellphone_number: string;
    health_council_registration_number: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

// Define interface for the User record (which represents the Pharmacist in the list)
interface PharmacistUser {
    id: number; // ID of the user record
    name: string;
    surname: string;
    email: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    role: string;
    // The related pharmacist details will be nested here
    pharmacist: PharmacistDetails; // This assumes it's always present for a 'pharmacist' user
}

interface PharmacistIndexProps {
    pharmacists: PharmacistUser[]; // Array of User records, each with nested PharmacistDetails
}

export default function PharmacistIndex({ pharmacists }: PharmacistIndexProps) {
    // Safely access flash and its success property
    const pageProps = usePage().props as { flash?: { success?: string } }; // Ensure 'flash' itself is optional
    const flashSuccessMessage = pageProps.flash?.success; // Use optional chaining

    useEffect(() => {
        if (flashSuccessMessage) {
            toast.success(flashSuccessMessage);
        }
    }, [flashSuccessMessage]);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this pharmacist? This action cannot be undone.')) {
            usePage().inertia.delete(route('manager.pharmacists.destroy', id), {
                onSuccess: () => {
                    toast.success('Pharmacist deleted.');
                },
                onError: (errors) => {
                    toast.error('Failed to delete pharmacist: ' + Object.values(errors).join(', '));
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Manage Pharmacists" />
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <Heading title="Manage Pharmacists" description="View, add, edit, or delete pharmacist users." />
                    <Link href={route('manager.pharmacists.create')}>
                        <Button>Add New Pharmacist</Button>
                    </Link>
                </div>

                {pharmacists.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Pharmacist List</CardTitle>
                            <CardDescription>All registered pharmacist users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Surname</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>ID Number</TableHead>
                                        <TableHead>Cellphone</TableHead>
                                        <TableHead>Reg. No.</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pharmacists.map((pharmacist) => (
                                        <TableRow key={pharmacist.id}>
                                            <TableCell className="font-medium">{pharmacist.id}</TableCell>
                                            <TableCell>{pharmacist.name}</TableCell>
                                            <TableCell>{pharmacist.surname}</TableCell>
                                            <TableCell>{pharmacist.email}</TableCell>
                                            <TableCell>{pharmacist.pharmacist?.id_number || 'N/A'}</TableCell>
                                            <TableCell>{pharmacist.pharmacist?.cellphone_number || 'N/A'}</TableCell>
                                            <TableCell>{pharmacist.pharmacist?.health_council_registration_number || 'N/A'}</TableCell>
                                            <TableCell className="flex justify-end space-x-2 text-right">
                                                <Link href={route('manager.pharmacists.edit', pharmacist.id)}>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleDelete(pharmacist.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="py-8 text-center">
                        <CardHeader>
                            <CardTitle>No Pharmacists Found</CardTitle>
                            <CardDescription>No pharmacist users have been added yet.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-gray-700">Click the button above to add your first pharmacist.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
