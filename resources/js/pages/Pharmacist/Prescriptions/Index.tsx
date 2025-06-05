import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

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
}

export default function PrescriptionIndex({ prescriptions }: { prescriptions: Prescription[] }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingPrescription, setDeletingPrescription] = useState<Prescription | null>(null);
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const { delete: destroy, processing } = useForm();
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const confirmDelete = (prescription: Prescription) => {
        setDeletingPrescription(prescription);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!deletingPrescription) return;

        destroy(route('pharmacist.prescriptions.destroy', deletingPrescription.id), {
            onSuccess: () => {
                toast.success('Prescription deleted.');
                setDeleteModalOpen(false);
                setDeletingPrescription(null);
            },
            onError: () => {
                toast.error('Failed to delete prescription.');
                setDeleteModalOpen(false);
            },
        });
    };

    // Filter prescriptions
    const filteredPrescriptions = prescriptions.filter((p) => {
        const nameMatch =
            (p.prescription_name?.toLowerCase().includes(filter.toLowerCase()) ?? false) ||
            p.status.toLowerCase().includes(filter.toLowerCase()) ||
            (p.customer_name?.toLowerCase().includes(filter.toLowerCase()) ?? false);

        const statusMatch = statusFilter ? p.status === statusFilter : true;

        const dateMatch = dateFilter ? new Date(p.upload_date).toISOString().slice(0, 10) === dateFilter : true;

        return nameMatch && statusMatch && dateMatch;
    });

    return (
        <AppLayout>
            <Head title="Prescriptions" />
            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <Heading title="Prescriptions" description="View uploaded prescriptions and track status." />
                </div>

                {/* Filter Input */}
                <div className="mb-4 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
                    <Input
                        type="text"
                        placeholder="Search by prescription, customer or status..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />

                    <select
                        className="rounded-md border px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="dispensed">Dispensed</option>
                    </select>

                    <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
                </div>

                {filteredPrescriptions.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No matching prescriptions found.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <Table className="w-full">
                            <TableHeader className="bg-gray-50 dark:bg-gray-900">
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Prescription</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date Uploaded</TableHead>
                                    <TableHead>Delivery Method</TableHead>
                                    <TableHead>Repeats</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPrescriptions.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.customer_name || 'N/A'}</TableCell>
                                        <TableCell>{p.prescription_name || 'N/A'}</TableCell>
                                        <TableCell className="capitalize">{p.status}</TableCell>
                                        <TableCell>{new Date(p.upload_date).toLocaleString()}</TableCell>
                                        <TableCell className="capitalize">
                                            {p.delivery_method === 'pickup' && 'Pick up'}
                                            {p.delivery_method === 'dispense' && 'Dispense'}
                                            {!p.delivery_method && 'Not specified'}
                                        </TableCell>

                                        <TableCell className="space-y-1 text-sm">
                                            {p.repeats_total > 0 ? (
                                                <>
                                                    <div>
                                                        {p.repeats_used} of {p.repeats_total} used
                                                    </div>

                                                    <div>
                                                        Next: {p.next_repeat_date ?? 'N/A'}
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground italic">No repeats</span>
                                            )}
                                        </TableCell>

                                        <TableCell className="flex items-center gap-2">
                                            <Link
                                                href={route('pharmacist.prescriptions.load', p.id)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {p.status === 'approved' ? 'Update' : 'Load'}
                                            </Link>

                                            <a
                                                href={`/storage/${p.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Download
                                            </a>

                                            <Link
                                                href={route('pharmacist.prescriptions.show', p.id)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View
                                            </Link>

                                            <button
                                                onClick={() => confirmDelete(p)}
                                                className="text-sm text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </TableCell>


                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Delete</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete the prescription "{deletingPrescription?.prescription_name}"?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} disabled={processing}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
