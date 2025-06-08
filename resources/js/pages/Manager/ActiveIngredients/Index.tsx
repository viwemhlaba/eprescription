import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Assuming you have shadcn/ui table
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

interface ActiveIngredient {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface ActiveIngredientIndexProps {
    activeIngredients: Paginated<ActiveIngredient>;
}

export default function ActiveIngredientIndex({ activeIngredients }: ActiveIngredientIndexProps) {
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
        if (confirm('Are you sure you want to delete this active ingredient?')) {
            // Using Inertia's delete method for DELETE requests
            usePage().inertia.delete(route('manager.activeIngredients.destroy', id), {
                onSuccess: () => {
                    toast.success('Active ingredient deleted.');
                },
                onError: () => {
                    toast.error('Failed to delete active ingredient.');
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
            <Head title="Active Ingredients" />
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <Heading title="Manage Active Ingredients" description="View, add, edit, or delete active ingredients." />
                    <Link href={route('manager.activeIngredients.create')}>
                        <Button>Add New Active Ingredient</Button>
                    </Link>
                </div>

                {activeIngredients.data.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Ingredient List</CardTitle>
                            <CardDescription>A list of all recorded active ingredients.</CardDescription>
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
                                    {activeIngredients.data.map((ingredient) => (
                                        <TableRow key={ingredient.id}>
                                            <TableCell className="font-medium">{ingredient.id}</TableCell>
                                            <TableCell>{ingredient.name}</TableCell>
                                            <TableCell>{new Date(ingredient.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="flex justify-end space-x-2 text-right">
                                                <Link href={route('manager.activeIngredients.edit', ingredient.id)}>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleDelete(ingredient.id)}
                                                >
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
                                    disabled={!activeIngredients.prev_page_url}
                                    onClick={() => goToPage(activeIngredients.prev_page_url)}
                                >
                                    Previous
                                </Button>
                                <span>
                                    Page {activeIngredients.current_page} of {activeIngredients.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!activeIngredients.next_page_url}
                                    onClick={() => goToPage(activeIngredients.next_page_url)}
                                >
                                    Next
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="py-8 text-center">
                        <CardHeader>
                            <CardTitle>No Active Ingredients Found</CardTitle>
                            <CardDescription>No active ingredients have been added yet.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-gray-700">Click the button above to add your first active ingredient.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
