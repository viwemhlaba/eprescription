import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Package, ShoppingCart } from 'lucide-react';

interface Medication {
    id: number;
    name: string;
    quantity_on_hand: number;
    reorder_level: number;
    schedule: string;
    supplier?: {
        id: number;
        name: string;
    };
    pending_order_items?: {
        stock_order: {
            order_number: string;
            created_at: string;
        };
        quantity: number;
    }[];
}

interface LowStockPageProps extends PageProps {
    critical_medications: Medication[];
    low_stock_medications: Medication[];
    out_of_stock_medications: Medication[];
    medications_with_orders: Medication[];
}

export default function LowStockOverview({
    critical_medications,
    low_stock_medications,
    out_of_stock_medications,
    medications_with_orders,
}: LowStockPageProps) {
    const getStockStatus = (medication: Medication) => {
        if (medication.quantity_on_hand === 0) {
            return {
                status: 'Out of Stock',
                variant: 'destructive' as const,
                urgency: 'critical',
            };
        } else if (medication.quantity_on_hand <= medication.reorder_level) {
            return {
                status: 'Critical',
                variant: 'destructive' as const,
                urgency: 'critical',
            };
        } else if (medication.quantity_on_hand <= medication.reorder_level + 10) {
            return {
                status: 'Low Stock',
                variant: 'secondary' as const,
                urgency: 'warning',
            };
        }
        return {
            status: 'Normal',
            variant: 'default' as const,
            urgency: 'normal',
        };
    };

    const handleOrderAll = () => {
        // Navigate to order page with all low stock medications
        window.location.href = route('manager.orders.create');
    };

    return (
        <AppLayout>
            <Head title="Low Stock Overview" />
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Stock Level Overview</h1>
                    <p className="mt-2 text-white">Monitor and manage medication stock levels across your pharmacy</p>
                </div>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
                            <AlertTriangle className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{critical_medications.length}</div>
                            <p className="text-muted-foreground text-xs">At or below reorder level</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                            <Package className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{low_stock_medications.length}</div>
                            <p className="text-muted-foreground text-xs">Within 10 units of reorder level</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                            <ShoppingCart className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{out_of_stock_medications.length}</div>
                            <p className="text-muted-foreground text-xs">Completely depleted</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="mb-6 flex space-x-4">
                    <Link href={route('manager.orders.create')}>
                        <Button size="lg">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Order Stock
                        </Button>
                    </Link>
                    <Link href={route('manager.medications.stock.index')}>
                        <Button variant="outline" size="lg">
                            <Package className="mr-2 h-4 w-4" />
                            Manage Stock
                        </Button>
                    </Link>
                </div>

                {/* Critical Stock Medications */}
                {critical_medications.length > 0 && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Critical Stock - Immediate Action Required</CardTitle>
                            <CardDescription>These medications are at or below their reorder level and need immediate attention</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Medication</TableHead>
                                        <TableHead>Schedule</TableHead>
                                        <TableHead>Current Stock</TableHead>
                                        <TableHead>Reorder Level</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {critical_medications.map((medication) => {
                                        const stockInfo = getStockStatus(medication);
                                        return (
                                            <TableRow key={medication.id}>
                                                <TableCell className="font-medium">{medication.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{medication.schedule}</Badge>
                                                </TableCell>
                                                <TableCell className="font-semibold">{medication.quantity_on_hand}</TableCell>
                                                <TableCell>{medication.reorder_level}</TableCell>
                                                <TableCell>{medication.supplier?.name || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Badge variant={stockInfo.variant}>{stockInfo.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={route('manager.orders.create', { medication: medication.id })}>
                                                        <Button size="sm" variant="destructive">
                                                            Order Now
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Low Stock Medications */}
                {low_stock_medications.length > 0 && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Low Stock - Monitor Closely</CardTitle>
                            <CardDescription>These medications are getting low but not yet critical</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Medication</TableHead>
                                        <TableHead>Schedule</TableHead>
                                        <TableHead>Current Stock</TableHead>
                                        <TableHead>Reorder Level</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {low_stock_medications.map((medication) => {
                                        const stockInfo = getStockStatus(medication);
                                        return (
                                            <TableRow key={medication.id}>
                                                <TableCell className="font-medium">{medication.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{medication.schedule}</Badge>
                                                </TableCell>
                                                <TableCell className="font-semibold">{medication.quantity_on_hand}</TableCell>
                                                <TableCell>{medication.reorder_level}</TableCell>
                                                <TableCell>{medication.supplier?.name || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Badge variant={stockInfo.variant}>{stockInfo.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={route('manager.orders.create', { medication: medication.id })}>
                                                        <Button size="sm" variant="outline">
                                                            Add to Order
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Out of Stock Medications */}
                {out_of_stock_medications.length > 0 && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Out of Stock - Urgent Reorder</CardTitle>
                            <CardDescription>These medications are completely out of stock</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Medication</TableHead>
                                        <TableHead>Schedule</TableHead>
                                        <TableHead>Reorder Level</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {out_of_stock_medications.map((medication) => (
                                        <TableRow key={medication.id}>
                                            <TableCell className="font-medium">{medication.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{medication.schedule}</Badge>
                                            </TableCell>
                                            <TableCell>{medication.reorder_level}</TableCell>
                                            <TableCell>{medication.supplier?.name || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge variant="destructive">Out of Stock</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Link href={route('manager.orders.create', { medication: medication.id })}>
                                                    <Button size="sm" variant="destructive">
                                                        Urgent Order
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Medications with Pending Orders */}
                {medications_with_orders.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-blue-600" />
                                Medications with Pending Orders
                            </CardTitle>
                            <CardDescription>
                                Medications that have been ordered but not yet received ({medications_with_orders.length} items)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Medication</TableHead>
                                        <TableHead>Schedule</TableHead>
                                        <TableHead>Current Stock</TableHead>
                                        <TableHead>Reorder Level</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Order Details</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {medications_with_orders.map((medication) => (
                                        <TableRow key={medication.id}>
                                            <TableCell className="font-medium">{medication.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{medication.schedule}</Badge>
                                            </TableCell>
                                            <TableCell>{medication.quantity_on_hand}</TableCell>
                                            <TableCell>{medication.reorder_level}</TableCell>
                                            <TableCell>{medication.supplier?.name || 'N/A'}</TableCell>
                                            <TableCell>
                                                {medication.pending_order_items && medication.pending_order_items.length > 0 && (
                                                    <div className="text-sm">
                                                        <div className="font-medium">
                                                            Order: {medication.pending_order_items[0].stock_order.order_number}
                                                        </div>
                                                        <div className="text-muted-foreground">Qty: {medication.pending_order_items[0].quantity}</div>
                                                        <div className="text-muted-foreground">
                                                            {new Date(medication.pending_order_items[0].stock_order.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">Order Placed</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* No Issues Message */}
                {critical_medications.length === 0 && low_stock_medications.length === 0 && out_of_stock_medications.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                            <h3 className="mb-2 text-lg font-semibold">All Stock Levels Good</h3>
                            <p className="text-muted-foreground">
                                All medications are currently above their reorder levels. No immediate action required.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
