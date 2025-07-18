import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface Prescription {
    id: number;
    customer_name?: string;
    prescription_name?: string;
    status: string;
    upload_date: string;
    repeats_total: number;
    repeats_used: number;
    next_repeat_date: string | null;
    file_path: string;
    delivery_method: string | null;
    patient_id_number?: string;
}

export default function DispensePrescription({ prescriptions }: { prescriptions: Prescription[] }) {
    const [filter, setFilter] = useState('');

    // Filter prescriptions that are ready for dispensing (approved status)
    const dispensablePrescriptions = prescriptions.filter(
        (p) =>
            p.status === 'approved' &&
            p.repeats_used < p.repeats_total &&
            (p.prescription_name?.toLowerCase().includes(filter.toLowerCase()) ||
                p.customer_name?.toLowerCase().includes(filter.toLowerCase()) ||
                p.patient_id_number?.toLowerCase().includes(filter.toLowerCase())),
    );

    const canDispense = (prescription: Prescription) => {
        return prescription.status === 'approved' && prescription.repeats_used < prescription.repeats_total;
    };

    return (
        <AppLayout>
            <Head title="Dispense Prescriptions" />

            <div className="p-4">
                <Heading title="Dispense Prescriptions" description="Review and dispense approved prescriptions to patients." />

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Available Prescriptions for Dispensing</CardTitle>
                        <CardDescription>Select prescriptions that are ready to be dispensed to patients.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Search Filter */}
                        <div className="mb-4">
                            <Input
                                placeholder="Search by prescription name, customer, or patient ID..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="max-w-md"
                            />
                        </div>

                        {dispensablePrescriptions.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-muted-foreground">No prescriptions available for dispensing.</p>
                                <p className="text-muted-foreground mt-2 text-sm">
                                    Prescriptions must be approved and have remaining repeats to be dispensed.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border">
                                <Table>
                                    <TableHeader className="bg-gray-50 dark:bg-gray-900">
                                        <TableRow>
                                            <TableHead>Patient</TableHead>
                                            <TableHead>Prescription</TableHead>
                                            <TableHead>Patient ID</TableHead>
                                            <TableHead>Repeats</TableHead>
                                            <TableHead>Upload Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dispensablePrescriptions.map((prescription) => (
                                            <TableRow key={prescription.id}>
                                                <TableCell className="font-medium">{prescription.customer_name || 'Unknown'}</TableCell>
                                                <TableCell>{prescription.prescription_name || 'N/A'}</TableCell>
                                                <TableCell>{prescription.patient_id_number || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <div>
                                                            {prescription.repeats_used} of {prescription.repeats_total} used
                                                        </div>
                                                        {prescription.repeats_used >= prescription.repeats_total && (
                                                            <div className="text-xs text-red-600">No repeats remaining</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{new Date(prescription.upload_date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {canDispense(prescription) ? (
                                                            <Button size="sm" asChild>
                                                                <Link href={route('pharmacist.prescriptions.dispense.show', prescription.id)}>
                                                                    Dispense
                                                                </Link>
                                                            </Button>
                                                        ) : (
                                                            <Button size="sm" variant="outline" disabled>
                                                                Cannot Dispense
                                                            </Button>
                                                        )}

                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={route('pharmacist.prescriptions.show', prescription.id)}>View</Link>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
