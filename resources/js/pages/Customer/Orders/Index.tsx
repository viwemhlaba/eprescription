// resources/js/Pages/Customer/Orders/Index.tsx
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

type Order = {
    id: number;
    order_date: string;
    status: string;
    total_amount_due: number;
};

export default function OrdersIndex({ orders }: { orders: Order[] }) {
    return (
        <AppLayout>
            <Head title="My Orders" />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <Heading title="My Orders" description="Track your prescription dispensing requests." />
                    <Button asChild>
                        <Link href={route('customer.orders.create')}>New Order</Link>
                    </Button>
                </div>

                {orders.length === 0 ? (
                    <p className="text-muted-foreground text-sm">You haven’t placed any orders yet.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                                        <TableCell className="capitalize">{order.status}</TableCell>
                                        <TableCell>R{Number(order.total_amount_due).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Link href={route('customer.orders.show', order.id)} className="text-sm text-blue-600 hover:underline">
                                                View
                                            </Link>
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
