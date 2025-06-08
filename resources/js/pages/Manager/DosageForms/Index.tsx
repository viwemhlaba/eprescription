import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react'; // Icons for edit/delete
import { useEffect } from 'react';
import { toast } from 'sonner';

// Update the interface to match Laravel's paginator
interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface DosageForm {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface DosageFormIndexProps {
    dosageForms: Paginated<DosageForm>;
}

export default function DosageFormIndex({ dosageForms }: DosageFormIndexProps) {
    // Safely access flash and its success property
    const pageProps = usePage().props as { flash?: { success?: string } }; // Ensure 'flash' itself is optional
    const flashSuccessMessage = pageProps.flash?.success; // Use optional chaining

    useEffect(() => {
        if (flashSuccessMessage) {
            toast.success(flashSuccessMessage);
        }
    }, [flashSuccessMessage]);

    // Handle delete action
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this dosage form?')) {
            usePage().inertia.delete(route('manager.dosageForms.destroy', id), {
                onSuccess: () => {
                    toast.success('Dosage form deleted.');
                },
                onError: () => {
                    toast.error('Failed to delete dosage form.');
                },
            });
        }
    };

    // Pagination navigation handler
    const goToPage = (url: string | null) => {
        if (url) {
            window.location.href = url;
        }
    };

    return (
        <AppLayout>
            <Head title="Dosage Forms" />
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <Heading title="Manage Dosage Forms" description="View, add, edit, or delete dosage forms." />
                    <Link href={route('manager.dosageForms.create')}>
                        <Button>Add New Dosage Form</Button>
                    </Link>
                </div>

                {dosageForms.data.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Dosage Form List</CardTitle>
                            <CardDescription>A list of all recorded dosage forms.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dosageForms.data.map((form) => (
                                        <TableRow key={form.id}>
                                            <TableCell className="font-medium">{form.id}</TableCell>
                                            <TableCell>{form.name}</TableCell>
                                            <TableCell>{new Date(form.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="flex justify-end space-x-2 text-right">
                                                <Link href={route('manager.dosageForms.edit', form.id)}>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                </Link>
                                                <Button variant="destructive" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(form.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {/* Pagination Controls */}
                            <div className="mt-4 flex items-center justify-between">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!dosageForms.prev_page_url}
                                    onClick={() => goToPage(dosageForms.prev_page_url)}
                                >
                                    Previous
                                </Button>
                                <span>
                                    Page {dosageForms.current_page} of {dosageForms.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!dosageForms.next_page_url}
                                    onClick={() => goToPage(dosageForms.next_page_url)}
                                >
                                    Next
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="py-8 text-center">
                        <CardHeader>
                            <CardTitle>No Dosage Forms Found</CardTitle>
                            <CardDescription>No dosage forms have been added yet.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-gray-700">Click the button above to add your first dosage form.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
