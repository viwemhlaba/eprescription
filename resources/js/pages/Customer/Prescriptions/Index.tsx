import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PrescriptionIndex({ prescriptions }: { prescriptions: any[] }) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingPrescription, setEditingPrescription] = useState<any | null>(null);

    const { data, setData, put, processing, reset, errors } = useForm({
        name: '',
        prescription_file: null as File | null,
    });

    const openEditModal = (prescription: any) => {
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
                if (err.prescription_file) {
                    toast.error('Please fix the validation errors.');
                    setEditModalOpen(false);
                    reset();
                }else if(err.name){
                    toast.error('Please fix the validation errors. name is required.');
                    setEditModalOpen(false);
                    reset();
                } else {
                    toast.error('Something went wrong.');
                    setEditModalOpen(false);
                    reset();
                }
            },
        });
    };

    return (
        <AppLayout>
            <Head title="My Prescriptions" />
            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <Heading title="My Prescriptions" description="View your uploaded prescriptions and track their status." />
                    <Button asChild>
                        <Link href={route('customer.prescriptions.create')}>Upload New</Link>
                    </Button>
                </div>

                {prescriptions.length === 0 ? (
                    <p className="text-muted-foreground text-sm">You haven’t uploaded any prescriptions yet.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date Uploaded</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prescriptions.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell className="capitalize">{p.status}</TableCell>
                                        <TableCell>{new Date(p.created_at).toLocaleString()}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <a
                                                href={`/storage/${p.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View
                                            </a>

                                            <button
                                                onClick={() => openEditModal(p)}
                                                className="text-sm text-yellow-600 hover:underline"
                                            >
                                                Edit
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
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="prescription_file">Replace File (optional)</Label>
                            <Input
                                id="prescription_file"
                                type="file"
                                accept=".pdf,image/*"
                                onChange={(e) => setData('prescription_file', e.target.files?.[0] || null)}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
