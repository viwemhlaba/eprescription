import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Package, User } from 'lucide-react';

interface StockOrderItem {
    id: number;
    quantity: number;
    medication: {
        id: number;
        name: string;
        schedule: string;
    };
}

interface StockOrder {
    id: number;
    order_number: string;
    status: string;
    created_at: string;
    received_at: string | null;
    supplier: {
        id: number;
        name: string;
        email: string;
        phone: string;
    };
    items: StockOrderItem[];
}

export default function Show({ order }: PageProps<{ order: StockOrder }>) {
    const getTotalItems = () => {
        return order.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'received':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AppLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Link href={route('manager.orders.index')}>
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Orders
                                </Button>
                            </Link>
                            <Heading title={`Order ${order.order_number}`} description="View order details and status" />
                        </div>
                        <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                        </div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Order Information */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Order Items */}
                            <div className="bg-card rounded-lg border">
                                <div className="p-6">
                                    <h3 className="mb-4 text-lg font-semibold">Order Items</h3>
                                    <div className="overflow-x-auto">
                                        <table className="divide-border min-w-full divide-y">
                                            <thead>
                                                <tr className="border-b">
                                                    <th scope="col" className="text-muted-foreground px-6 py-3 text-left text-sm font-medium">
                                                        Medication
                                                    </th>
                                                    <th scope="col" className="text-muted-foreground px-6 py-3 text-left text-sm font-medium">
                                                        Schedule
                                                    </th>
                                                    <th scope="col" className="text-muted-foreground px-6 py-3 text-left text-sm font-medium">
                                                        Quantity
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-border divide-y">
                                                {order.items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-6 py-4 text-sm font-medium">{item.medication.name}</td>
                                                        <td className="text-muted-foreground px-6 py-4 text-sm">{item.medication.schedule}</td>
                                                        <td className="text-muted-foreground px-6 py-4 text-sm">{item.quantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-muted/25 border-t">
                                                    <td colSpan={2} className="px-6 py-3 text-right text-sm font-semibold">
                                                        Total Items:
                                                    </td>
                                                    <td className="px-6 py-3 text-sm font-semibold">{getTotalItems()}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Supplier Information */}
                            <div className="bg-card rounded-lg border">
                                <div className="p-6">
                                    <h3 className="mb-4 flex items-center text-lg font-semibold">
                                        <User className="mr-2 h-5 w-5" />
                                        Supplier
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium">{order.supplier.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm">Email</p>
                                            <p className="text-sm">{order.supplier.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm">Phone</p>
                                            <p className="text-sm">{order.supplier.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="bg-card rounded-lg border">
                                <div className="p-6">
                                    <h3 className="mb-4 flex items-center text-lg font-semibold">
                                        <Package className="mr-2 h-5 w-5" />
                                        Order Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-muted-foreground text-sm">Order Number</p>
                                            <p className="text-sm font-medium">{order.order_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm">Status</p>
                                            <p className="text-sm">{order.status}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm">Created At</p>
                                            <p className="flex items-center text-sm">
                                                <Calendar className="mr-1 h-4 w-4" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {order.received_at && (
                                            <div>
                                                <p className="text-muted-foreground text-sm">Received At</p>
                                                <p className="flex items-center text-sm">
                                                    <Calendar className="mr-1 h-4 w-4" />
                                                    {new Date(order.received_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {order.status === 'pending' && (
                                <div className="bg-card rounded-lg border">
                                    <div className="p-6">
                                        <h3 className="mb-4 text-lg font-semibold">Actions</h3>
                                        <Link href={route('manager.orders.receive', order.id)} method="patch" as="button">
                                            <Button className="w-full">
                                                <Package className="mr-2 h-4 w-4" />
                                                Mark as Received
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
