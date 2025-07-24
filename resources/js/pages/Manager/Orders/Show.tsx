import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
                        <Badge variant={order.status.toLowerCase() === 'received' ? 'default' : 'secondary'}>{order.status}</Badge>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Order Information */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Medication</TableHead>
                                                <TableHead>Schedule</TableHead>
                                                <TableHead>Quantity</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.medication.name}</TableCell>
                                                    <TableCell>{item.medication.schedule}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-right font-semibold">
                                                    Total Items:
                                                </TableCell>
                                                <TableCell className="font-semibold">{getTotalItems()}</TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Supplier Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <User className="mr-2 h-5 w-5" />
                                        Supplier
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
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
                                </CardContent>
                            </Card>

                            {/* Order Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Package className="mr-2 h-5 w-5" />
                                        Order Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-muted-foreground text-sm">Order Number</p>
                                        <p className="text-sm font-medium">{order.order_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm">Status</p>
                                        <Badge variant={order.status.toLowerCase() === 'received' ? 'default' : 'secondary'}>{order.status}</Badge>
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
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            {order.status === 'pending' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Link href={route('manager.orders.receive', order.id)} method="patch" as="button">
                                            <Button className="w-full">
                                                <Package className="mr-2 h-4 w-4" />
                                                Mark as Received
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
