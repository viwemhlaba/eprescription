import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Prescription {
    id: number;
    name: string;
    status: string;
    created_at: string;
    repeats_total: number;
    repeats_used: number;
    next_repeat_date: string | null;
    file_path: string;
}

export default function PrescriptionIndex({ prescriptions }: { prescriptions: Prescription[] }) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const { data, setData, put, processing, reset, errors } = useForm({
        name: '',
        prescription_file: null as File | null,
    });

    const repeatForm = useForm({});
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [historyPrescription, setHistoryPrescription] = useState<Prescription | null>(null);

    const requestRepeat = (id: number) => {
        repeatForm.post(route('customer.prescriptions.request-repeat', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Repeat requested successfully.');
            },
            onError: () => {
                toast.error('Could not request repeat.');
            },
        });
    };

    const isRepeatOverdue = (date: string | null) => {
        if (!date) return false;
        const today = new Date().toISOString().slice(0, 10);
        return date < today;
    };

    function getRepeatDateEstimate(index: number, nextDate: string | null) {
        if (!nextDate) return 'N/A';
        const next = new Date(nextDate);
        next.setDate(next.getDate() - 30 * (index + 1));
        return next.toLocaleDateString();
    }

    const openEditModal = (prescription: Prescription) => {
        setEditingPrescription(prescription);
        setData({
            name: prescription.name,
            prescription_file: null,
        });
        setEditModalOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingPrescription) return;

        put(route('customer.prescriptions.update', editingPrescription.id), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Prescription updated');
                setEditModalOpen(false);
                reset();
            },
            onError: (err) => {
                if (err.prescription_file || err.name) {
                    toast.error('Please fix the validation errors.');
                } else {
                    toast.error('Something went wrong.');
                }
                setEditModalOpen(false);
                reset();
            },
        });
    };

    // Filter prescriptions
    const filteredPrescriptions = prescriptions.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(filter.toLowerCase()) || p.status.toLowerCase().includes(filter.toLowerCase());

        const statusMatch = statusFilter ? p.status === statusFilter : true;

        const dateMatch = dateFilter ? new Date(p.created_at).toISOString().slice(0, 10) === dateFilter : true;

        return nameMatch && statusMatch && dateMatch;
    });

    return (
        <AppLayout>
            <Head title="My Prescriptions" />
            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <Heading title="My Prescriptions" description="View your uploaded prescriptions and track their status." />
                    <Button asChild>
                        <Link href={route('customer.prescriptions.create')}>Upload New</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <a
                            href={route('customer.prescriptions.export', {
                                status: statusFilter,
                                from_date: dateFilter,
                                to_date: dateFilter,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Export PDF
                        </a>
                    </Button>
                </div>

                {/* Filter Input */}
                <div className="mb-4 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
                    <Input type="text" placeholder="Search by name or status..." value={filter} onChange={(e) => setFilter(e.target.value)} />

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
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date Uploaded</TableHead>
                                    <TableHead>Repeats</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPrescriptions.map((p) => (
                                    <TableRow key={p.id} className={isRepeatOverdue(p.next_repeat_date) ? 'bg-red-50 dark:bg-red-900/30' : ''}>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell className="capitalize">{p.status}</TableCell>
                                        <TableCell>{new Date(p.created_at).toLocaleString()}</TableCell>

                                        <TableCell className="space-y-1 text-sm">
                                            {p.repeats_total > 0 ? (
                                                <>
                                                    <div>
                                                        {p.repeats_used} of {p.repeats_total} used
                                                    </div>

                                                    <div
                                                        className={
                                                            isRepeatOverdue(p.next_repeat_date)
                                                                ? 'font-semibold text-red-600'
                                                                : 'text-muted-foreground'
                                                        }
                                                    >
                                                        Next: {p.next_repeat_date ?? 'N/A'}
                                                    </div>

                                                    {isRepeatOverdue(p.next_repeat_date) && (
                                                        <div className="text-sm text-red-600">
                                                            ⚠️ Your repeat is overdue. Please request a repeat or contact the pharmacy.
                                                        </div>
                                                    )}

                                                    {p.repeats_used < p.repeats_total && (
                                                        <Button size="sm" variant="outline" onClick={() => requestRepeat(p.id)} className="mt-1">
                                                            Request Repeat
                                                        </Button>
                                                    )}

                                                    {p.status === 'repeat_pending' && (
                                                        <div className="text-xs font-medium text-yellow-600">Repeat request pending approval</div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground italic">No repeats</span>
                                            )}
                                        </TableCell>

                                        <TableCell className="flex items-center gap-2">
                                            <a
                                                href={`/storage/${p.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View
                                            </a>

                                            <button onClick={() => openEditModal(p)} className="text-sm text-yellow-600 hover:underline">
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setHistoryPrescription(p);
                                                    setHistoryModalOpen(true);
                                                }}
                                                className="text-sm text-sky-600 hover:underline"
                                            >
                                                History
                                            </button>

                                            <Link
                                                as="button"
                                                method="delete"
                                                href={route('customer.prescriptions.destroy', p.id)}
                                                className="text-sm text-red-600 hover:underline"
                                                preserveScroll
                                            >
                                                Delete
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Prescription</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Prescription Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="prescription_file">Replace File (optional)</Label>
                            <Input
                                id="prescription_file"
                                type="file"
                                accept=".pdf,image/*"
                                onChange={(e) => setData('prescription_file', e.target.files?.[0] || null)}
                            />
                            {errors.prescription_file && <p className="text-sm text-red-500">{errors.prescription_file}</p>}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* History Modal */}
            <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Repeat History</DialogTitle>
                    </DialogHeader>

                    {historyPrescription && (
                        <div className="space-y-4">
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center text-sm">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-semibold">Prescription Name:</span>
                                        <span>{historyPrescription.name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">Status:</span>
                                        <span>{historyPrescription.status}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">Repeats Used:</span>
                                        <span>
                                            {historyPrescription.repeats_used} / {historyPrescription.repeats_total}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">Next Repeat Date:</span>
                                        <span>{historyPrescription.next_repeat_date ?? 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <p className="font-medium">Past Repeats:</p>
                                <ul className="space-y-2">
                                    {Array.from({ length: historyPrescription.repeats_used }).map((_, index) => (
                                        <li key={index} className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                                            <span className="font-semibold">Repeat #{index + 1}:</span>
                                            <span>Estimated date: {getRepeatDateEstimate(index, historyPrescription.next_repeat_date)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
