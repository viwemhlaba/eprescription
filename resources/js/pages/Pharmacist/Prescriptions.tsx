import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function PharmacistPrescriptions({ prescriptions = [] }: { prescriptions?: any[] }) {
    return (
        <AppLayout>
            <Head title="Prescriptions" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <Heading
                        title="Prescriptions"
                        description="View all prescriptions submitted by customers for review and dispensing."
                    />
                </div>

                {prescriptions.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No prescriptions found.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <Table className="w-full">
                            <TableHeader className="bg-gray-50 dark:bg-gray-900">
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Delivery Method</TableHead>
                                    <TableHead>Uploaded</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prescriptions.map((prescription) => (
                                    <TableRow key={prescription.id}>
                                        <TableCell>{prescription.customer?.user?.name}</TableCell>
                                        <TableCell>{prescription.name}</TableCell>
                                        <TableCell className="capitalize">{prescription.status}</TableCell>
                                        <TableCell className="capitalize">
                                            {prescription.delivery_method === 'pickup' && 'Pick up'}
                                            {prescription.delivery_method === 'dispense' && 'Dispense'}
                                            {!prescription.delivery_method && 'Not specified'}
                                        </TableCell>
                                        <TableCell>{new Date(prescription.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <a
                                                href={`/storage/${prescription.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View
                                            </a>
                                            <Button size="sm" variant="secondary" asChild>
                                                <Link href={route('pharmacist.prescriptions.show', prescription.id)}>Details</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
