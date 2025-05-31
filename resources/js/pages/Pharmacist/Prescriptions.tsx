import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface Prescription {
    id: number;
    customer_name: string;
    prescription_name: string;
    upload_date: string;
    status: string;
    file_path: string;
}

export default function PharmacistPrescriptions({ prescriptions }: { prescriptions: Prescription[] }) {
    const [search, setSearch] = useState('');

    const filtered = prescriptions
        ? prescriptions.filter((p) => p.id.toString().includes(search) || p.customer_name.toLowerCase().includes(search.toLowerCase()))
        : [];

    const getBadgeStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-500 text-black';
            case 'loaded':
                return 'bg-blue-600 text-white';
            case 'dispensed':
                return 'bg-green-600 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <AppLayout>
            <div className="p-6 text-white">
                <Heading title="View Prescriptions" description="Pharmacist / View Prescriptions" />

                <div className="mb-4 max-w-md">
                    <Input placeholder="Search by ID or Customer Name..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="overflow-x-auto rounded-lg border border-white/20">
                    <Table>
                        <TableHeader className="bg-gray-800 text-white">
                            <TableRow>
                                <TableHead className="text-white">Prescription #</TableHead>
                                <TableHead className="text-white">Customer</TableHead>
                                <TableHead className="text-white">Prescription Name</TableHead>
                                <TableHead className="text-white">Upload Date</TableHead>
                                <TableHead className="text-white">Status</TableHead>
                                <TableHead className="text-white">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-muted-foreground text-center">
                                        No prescriptions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.id}</TableCell>
                                        <TableCell>{p.customer_name}</TableCell>
                                        <TableCell>{p.prescription_name}</TableCell>
                                        <TableCell>{p.upload_date}</TableCell>
                                        <TableCell>
                                            <Badge className={getBadgeStyle(p.status)}>{p.status}</Badge>
                                        </TableCell>
                                        <TableCell className="flex flex-wrap gap-2">
                                            <a href={`/storage/${p.file_path}`} target="_blank" rel="noopener noreferrer">
                                                <Button variant="outline" size="sm">
                                                    Download
                                                </Button>
                                            </a>
                                            <Link href={route('pharmacist.prescriptions.load', { id: p.id })}>
                                                <Button variant="default" size="sm" className="bg-white text-black" disabled={p.status !== 'pending'}>
                                                    Load Prescription
                                                </Button>
                                            </Link>
                                            <Link as="button" method="delete" href={route('pharmacist.prescriptions.destroy', p.id)}>
                                                <Button variant="destructive" size="sm">
                                                    Delete
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
