import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Package, ShoppingCart, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manager Dashboard',
        href: '/manager/dashboard',
    },
];

interface Stats {
    total_medications: number;
    total_pharmacists: number;
    critical_stock_count: number;
    out_of_stock_count: number;
    pending_orders: number;
    pending_prescriptions: number;
}

interface Medication {
    id: number;
    name: string;
    quantity_on_hand: number;
    reorder_level: number;
    supplier?: {
        name: string;
    };
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    created_at: string;
    supplier?: {
        name: string;
    };
}

interface Alert {
    type: string;
    description: string;
    priority: string;
    date: string;
    medication_id?: number;
    action_type?: string;
}

interface DashboardProps extends PageProps {
    stats: Stats;
    low_stock_medications: Medication[];
    recent_orders: Order[];
    alerts: Alert[];
}

export default function Dashboard({ stats, low_stock_medications, recent_orders, alerts }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manager Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Medications</CardTitle>
                            <Package className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_medications}</div>
                            <p className="text-muted-foreground text-xs">In Inventory</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
                            <ShoppingCart className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_prescriptions}</div>
                            <p className="text-muted-foreground text-xs">Awaiting Processing</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.critical_stock_count}</div>
                            <p className="text-muted-foreground text-xs">Need Reordering</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pharmacists</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_pharmacists}</div>
                            <p className="text-muted-foreground text-xs">Total Staff</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link href={route('manager.medications.stock.index')}>
                        <Button>Manage Medication Stock</Button>
                    </Link>
                    <Link href={route('manager.orders.create')}>
                        <Button variant="outline">Order Medication Stock</Button>
                    </Link>
                    <Link href={route('manager.low-stock.index')}>
                        <Button variant="outline">View Low Stock</Button>
                    </Link>
                    <Link href={route('manager.pharmacies.index')}>
                        <Button variant="outline">Manage Pharmacist Users</Button>
                    </Link>
                    <Button variant="outline">Generate Stock Take Report</Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Alerts & Notifications</CardTitle>
                        <CardDescription>Important notices requiring attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {alerts.length > 0 ? (
                            <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alerts.map((alert, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                className={
                                                    alert.type === 'Low Stock'
                                                        ? 'text-red-500'
                                                        : alert.type === 'Pending Orders'
                                                          ? 'text-yellow-500'
                                                          : 'text-blue-500'
                                                }
                                            >
                                                {alert.type}
                                            </TableCell>
                                            <TableCell>{alert.description}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                        alert.priority === 'High'
                                                            ? 'bg-red-100 text-red-800'
                                                            : alert.priority === 'Medium'
                                                              ? 'bg-yellow-100 text-yellow-800'
                                                              : 'bg-blue-100 text-blue-800'
                                                    }`}
                                                >
                                                    {alert.priority}
                                                </span>
                                            </TableCell>
                                            <TableCell>{alert.date}</TableCell>
                                            <TableCell>
                                                {alert.action_type === 'reorder' && (
                                                    <Link
                                                        href={route(
                                                            'manager.orders.create',
                                                            alert.medication_id ? { medication: alert.medication_id } : {},
                                                        )}
                                                    >
                                                        <Button size="sm">Reorder</Button>
                                                    </Link>
                                                )}
                                                {alert.action_type === 'view_orders' && (
                                                    <Link href={route('manager.orders.index')}>
                                                        <Button size="sm" variant="secondary">
                                                            View Orders
                                                        </Button>
                                                    </Link>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-muted-foreground py-4 text-center">No alerts at this time</p>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Low Stock Medications</CardTitle>
                            <CardDescription>Medications that need to be reordered soon</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {low_stock_medications.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Medication</TableHead>
                                                <TableHead>Current Stock</TableHead>
                                                <TableHead>Reorder Level</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Supplier</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {low_stock_medications.map((medication) => {
                                                const isCritical = medication.quantity_on_hand <= medication.reorder_level;
                                                const isOutOfStock = medication.quantity_on_hand === 0;

                                                return (
                                                    <TableRow key={medication.id}>
                                                        <TableCell className="font-medium">{medication.name}</TableCell>
                                                        <TableCell className="font-semibold">{medication.quantity_on_hand}</TableCell>
                                                        <TableCell>{medication.reorder_level}</TableCell>
                                                        <TableCell>
                                                            {isOutOfStock ? (
                                                                <Badge variant="destructive">Out of Stock</Badge>
                                                            ) : isCritical ? (
                                                                <Badge variant="destructive">Critical</Badge>
                                                            ) : (
                                                                <Badge variant="secondary">Low Stock</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{medication.supplier?.name || 'N/A'}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <p className="text-muted-foreground py-4 text-center">All medications are adequately stocked</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest stock orders placed</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recent_orders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Order Number</TableHead>
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recent_orders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">
                                                        <Link href={route('manager.orders.show', order.id)} className="hover:underline">
                                                            {order.order_number}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{order.supplier?.name || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                order.status === 'Pending'
                                                                    ? 'secondary'
                                                                    : order.status === 'Received'
                                                                      ? 'default'
                                                                      : 'outline'
                                                            }
                                                        >
                                                            {order.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <p className="text-muted-foreground py-4 text-center">No recent orders</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
