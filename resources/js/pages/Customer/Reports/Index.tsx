import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ReportsIndex({ prescriptions, filters }: any) {
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

                <div className="flex items-end gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium">From</label>
                        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">To</label>
                        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                    </div>
                    <Button onClick={applyFilters}>Filter</Button>

                    <a
                        href={route('customer.reports.export', { from_date: from, to_date: to })}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="outline">Export PDF</Button>
                    </a>
                </div>

                {prescriptions.length === 0 ? (
                    <p className="text-muted-foreground">No dispensed prescriptions found for this range.</p>
                ) : (
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prescriptions.map((p: any) => (
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
