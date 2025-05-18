import Heading from '@/components/heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Prescription {
    id: number;
    name: string;
    repeats_used: number;
    repeats_total: number;
    next_repeat_date: string | null;
    status: string;
}

export default function RepeatIndex({ prescriptions }: { prescriptions: Prescription[] }) {
    const isOverdue = (date: string | null) => {
        if (!date) return false;
        const today = new Date();
        const nextDate = new Date(date);
        return nextDate < today;
    };

    return (
        <AppLayout>
            <Head title="My Repeats" />

            <div className="p-4">
                <Heading title="My Repeat Prescriptions" description="Track how many repeats you've used and when your next one is due." />

                {prescriptions.length === 0 ? (
                    <p className="text-muted-foreground mt-4">No repeat prescriptions found.</p>
                ) : (
                    <div className="mt-6 overflow-x-auto rounded-lg border">
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Repeats Used / Total</TableHead>
                                    <TableHead>Next Repeat Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prescriptions.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell>
                                            {p.repeats_used} / {p.repeats_total}
                                        </TableCell>
                                        <TableCell className={isOverdue(p.next_repeat_date) ? 'font-medium text-red-600' : ''}>
                                            {p.next_repeat_date ?? 'N/A'}
                                            {isOverdue(p.next_repeat_date) && <span className="ml-2 text-xs">Overdue</span>}
                                        </TableCell>
                                        <TableCell className="capitalize">{p.status}</TableCell>
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
