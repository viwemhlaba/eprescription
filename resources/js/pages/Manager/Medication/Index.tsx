import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

interface Medication {
    id: number;
    name: string;
    schedule: number;
    supplier?: { name: string };
    reorder_level: number;
    quantity_on_hand: number;
    created_at: string;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface MedicationIndexProps {
    medications: Paginated<Medication>;
}

export default function MedicationIndex({ medications }: MedicationIndexProps) {
    return (
        <AppLayout>
            <Head title="Medications" />
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <Heading title="Manage Medications" description="View, add, edit, or delete medications." />
                    <Link href={route('manager.medications.create')}>
                        <Button>Add New Medication</Button>
                    </Link>
                </div>
                {medications.data.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Medication List</CardTitle>
                            <CardDescription>A list of all recorded medications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Schedule</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Reorder Level</TableHead>
                                        <TableHead>Quantity On Hand</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {medications.data.map((med) => (
                                        <TableRow key={med.id}>
                                            <TableCell className="font-medium">{med.id}</TableCell>
                                            <TableCell>{med.name}</TableCell>
                                            <TableCell>{med.schedule}</TableCell>
                                            <TableCell>{med.supplier?.name}</TableCell>
                                            <TableCell>{med.reorder_level}</TableCell>
                                            <TableCell>{med.quantity_on_hand}</TableCell>
                                            <TableCell className="flex justify-end space-x-2 text-right">
                                                <Link href={route('manager.medications.edit', med.id)}>
                                                    <Button variant="outline" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-muted-foreground py-8 text-center">No medications found.</div>
                )}
            </div>
        </AppLayout>
    );
}
