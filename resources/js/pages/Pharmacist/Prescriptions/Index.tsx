import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Download, Edit, Eye, Loader, MoreHorizontal, Package, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UploadedPrescription {
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
    is_manual: false;
}

interface ManualPrescription {
    id: number;
    customer_name?: string;
    prescription_name?: string;
    status: string;
    created_date: string;
    repeats_total: number;
    repeats_used: number;
    next_repeat_date: string | null;
    file_path: string | null;
    delivery_method: string | null;
    doctor_name?: string;
    is_manual: true;
    patient_id_number?: string;
}

const getStatusBadge = (status: string) => {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        approved: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        dispensed: 'bg-green-100 text-green-800 hover:bg-green-200',
        rejected: 'bg-red-100 text-red-800 hover:bg-red-200',
    };

    return (
        <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

export default function PrescriptionIndex({
    uploadedPrescriptions,
    manualPrescriptions,
}: {
    uploadedPrescriptions: UploadedPrescription[];
    manualPrescriptions: ManualPrescription[];
}) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingPrescription, setDeletingPrescription] = useState<UploadedPrescription | ManualPrescription | null>(null);
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const { delete: destroy, processing } = useForm();
    interface FlashMessages {
        success?: string;
        error?: string;
    }

    const { flash } = usePage().props as { flash?: FlashMessages };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const confirmDelete = (prescription: UploadedPrescription | ManualPrescription) => {
        setDeletingPrescription(prescription);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!deletingPrescription) return;

        const deleteRoute = deletingPrescription.is_manual
            ? route('pharmacist.prescriptions.manual.destroy', deletingPrescription.id)
            : route('pharmacist.prescriptions.destroy', deletingPrescription.id);

        destroy(deleteRoute, {
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

    // Filter uploaded prescriptions
    const filteredUploadedPrescriptions = uploadedPrescriptions.filter((p) => {
        const nameMatch =
            (p.prescription_name?.toLowerCase().includes(filter.toLowerCase()) ?? false) ||
            p.status.toLowerCase().includes(filter.toLowerCase()) ||
            (p.customer_name?.toLowerCase().includes(filter.toLowerCase()) ?? false);

        const statusMatch = statusFilter ? p.status === statusFilter : true;
        const dateMatch = dateFilter ? new Date(p.upload_date).toISOString().slice(0, 10) === dateFilter : true;

        return nameMatch && statusMatch && dateMatch;
    });

    // Filter manual prescriptions
    const filteredManualPrescriptions = manualPrescriptions.filter((p) => {
        const nameMatch =
            (p.prescription_name?.toLowerCase().includes(filter.toLowerCase()) ?? false) ||
            p.status.toLowerCase().includes(filter.toLowerCase()) ||
            (p.customer_name?.toLowerCase().includes(filter.toLowerCase()) ?? false) ||
            (p.doctor_name?.toLowerCase().includes(filter.toLowerCase()) ?? false);

        const statusMatch = statusFilter ? p.status === statusFilter : true;
        const dateMatch = dateFilter ? new Date(p.created_date).toISOString().slice(0, 10) === dateFilter : true;

        return nameMatch && statusMatch && dateMatch;
    });

    return (
        <AppLayout>
            <Head title="Prescriptions" />
            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <Heading title="Prescriptions" description="View uploaded and manually created prescriptions." />
                    <div className="flex gap-2">
                        <Link href={route('pharmacist.customers.create')}>
                            <Button variant="outline">Create Customer</Button>
                        </Link>
                        <Link href={route('pharmacist.prescriptions.createManual')}>
                            <Button>Create Manual Prescription</Button>
                        </Link>
                    </div>
                </div>

                {/* Filter Input */}
                <div className="mb-4 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
                    <Input
                        type="text"
                        placeholder="Search by prescription, customer, doctor or status..."
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

                {/* Uploaded Prescriptions Table */}
                <div className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold">Uploaded Prescriptions</h2>
                    {filteredUploadedPrescriptions.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No matching uploaded prescriptions found.</p>
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
                                    {filteredUploadedPrescriptions.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.customer_name || 'N/A'}</TableCell>
                                            <TableCell>{p.prescription_name || 'N/A'}</TableCell>
                                            <TableCell>{getStatusBadge(p.status)}</TableCell>
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

                                                        <div>Next: {p.next_repeat_date ?? 'N/A'}</div>
                                                    </>
                                                ) : (
                                                    <span className="text-muted-foreground italic">No repeats</span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={route('pharmacist.prescriptions.load', p.id)}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Loader className="h-4 w-4" />
                                                                Load Prescription
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem asChild>
                                                            <a
                                                                href={`/storage/${p.file_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                                Download
                                                            </a>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={route('pharmacist.prescriptions.show', p.id)}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        {p.status === 'approved' && p.repeats_used < p.repeats_total && (
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={route('pharmacist.prescriptions.dispense.show', p.id)}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <Package className="h-4 w-4" />
                                                                    Dispense
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            onClick={() => confirmDelete(p)}
                                                            className="flex items-center gap-2 text-red-600"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {/* Manual Prescriptions Table */}
                <div className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold">Manual Prescriptions</h2>
                    {filteredManualPrescriptions.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No matching manual prescriptions found.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border">
                            <Table className="w-full">
                                <TableHeader className="bg-gray-50 dark:bg-gray-900">
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Prescription</TableHead>
                                        <TableHead>Doctor</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date Created</TableHead>
                                        <TableHead>Delivery Method</TableHead>
                                        <TableHead>Repeats</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredManualPrescriptions.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.customer_name || 'N/A'}</TableCell>
                                            <TableCell>{p.prescription_name || 'N/A'}</TableCell>
                                            <TableCell>{p.doctor_name || 'N/A'}</TableCell>
                                            <TableCell>{getStatusBadge(p.status)}</TableCell>
                                            <TableCell>{new Date(p.created_date).toLocaleString()}</TableCell>
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

                                                        <div>Next: {p.next_repeat_date ?? 'N/A'}</div>
                                                    </>
                                                ) : (
                                                    <span className="text-muted-foreground italic">No repeats</span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={route('pharmacist.prescriptions.manual.edit', p.id)}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        {p.file_path ? (
                                                            <DropdownMenuItem asChild>
                                                                <a
                                                                    href={`/storage/${p.file_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                    Download PDF
                                                                </a>
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem asChild>
                                                                <a
                                                                    href={route('pharmacist.prescriptions.manual.generatePdf', p.id)}
                                                                    className="flex items-center gap-2 text-green-600"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    download
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                    Generate PDF
                                                                </a>
                                                            </DropdownMenuItem>
                                                        )}

                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={route('pharmacist.prescriptions.show', p.id)}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        {p.status === 'approved' && p.repeats_used < p.repeats_total && (
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={route('pharmacist.prescriptions.dispense.show', p.id)}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <Package className="h-4 w-4" />
                                                                    Dispense
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            onClick={() => confirmDelete(p)}
                                                            className="flex items-center gap-2 text-red-600"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

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
