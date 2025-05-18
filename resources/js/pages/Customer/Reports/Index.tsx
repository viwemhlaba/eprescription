import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Prescription {
    id: number;
    name: string;
    status: string;
    created_at: string;
}

interface Filters {
    from_date?: string;
    to_date?: string;
}

interface ReportsIndexProps {
    prescriptions: Prescription[];
    filters: Filters;
}

export default function ReportsIndex({ prescriptions, filters }: ReportsIndexProps) {
    const [from, setFrom] = useState(filters.from_date || '');
    const [to, setTo] = useState(filters.to_date || '');

    const applyFilters = () => {
        router.get(route('customer.reports.index'), { from_date: from, to_date: to }, { preserveScroll: true });
    };

    return (
        <AppLayout>
            <Head title="Reports" />
            <div className="p-4">
                <Heading title="Reports" description="Generate reports of your dispensed prescriptions." />

                <div className="mb-6 flex items-end gap-4">
                    <div>
                        <label className="block text-sm font-medium">From</label>
                        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">To</label>
                        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                    </div>
                    <Button onClick={applyFilters}>Filter</Button>

                    <a href={route('customer.reports.export', { from_date: from, to_date: to })} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">Export PDF</Button>
                    </a>
                </div>

                {prescriptions.length === 0 ? (
                    <p className="text-muted-foreground">No dispensed prescriptions found for this range.</p>
                ) : (
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prescriptions.map((p: Prescription) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell className="capitalize">{p.status}</TableCell>
                                        <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
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
