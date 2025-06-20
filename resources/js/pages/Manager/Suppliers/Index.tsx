import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

interface Supplier {
    id: number;
    name: string;
    contact_person: string;
    email: string;
}

interface SuppliersIndexProps {
    suppliers: Supplier[];
}

export default function SuppliersIndex({ suppliers }: SuppliersIndexProps) {
    return (
        <AppLayout>
            <Head title="Suppliers" />
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <Heading title="Suppliers" description="Manage pharmaceutical suppliers." />
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Supplier List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex justify-end">
                            <Link href={route('manager.suppliers.create')}>
                                <Button>Add Supplier</Button>
                            </Link>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Contact Person</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {suppliers.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell>{supplier.name}</TableCell>
                                        <TableCell>{supplier.contact_person}</TableCell>
                                        <TableCell>{supplier.email}</TableCell>
                                        <TableCell>
                                            <Link href={route('manager.suppliers.edit', supplier.id)}>
                                                <Button size="sm" variant="outline" className="mr-2">
                                                    <Pencil size={16} />
                                                </Button>
                                            </Link>
                                            <Button size="sm" variant="destructive">
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
