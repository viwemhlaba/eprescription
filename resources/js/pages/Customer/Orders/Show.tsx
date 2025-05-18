import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

type Prescription = {
    name: string;
    status: string;
    file_path: string;
};

type OrderItem = {
    id: number;
    prescription: Prescription;
};

type Order = {
    id: number;
    order_date: string;
    status: string;
    total_amount_due: number | string;
    items: OrderItem[];
};

export default function OrderShow({ order }: { order: Order }) {
    return (
        <AppLayout>
            <Head title={`Order #${order.id}`} />
            <div className="space-y-6 p-4">
                <Heading title={`Order #${order.id}`} description="Details of your order." />

                <div className="space-y-2">
                    <p>
                        <strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Status:</strong> {order.status}
                    </p>
                    <p>
                        <strong>Total Amount:</strong> R{Number(order.total_amount_due).toFixed(2)}
                    </p>
                </div>

                <div>
                    <h3 className="mt-4 mb-2 text-lg font-semibold">Prescriptions:</h3>
                    {order.items.length === 0 ? (
                        <p>No prescriptions in this order.</p>
                    ) : (
                        order.items.map((item: OrderItem) => (
                            <Card key={item.id} className="mb-3">
                                <CardContent className="p-4">
                                    <p>
                                        <strong>Name:</strong> {item.prescription.name}
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {item.prescription.status}
                                    </p>
                                    <a
                                        href={`/storage/${item.prescription.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                                    >
                                        View Prescription File
                                    </a>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
