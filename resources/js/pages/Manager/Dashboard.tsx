import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manager Dashboard',
        href: '/manager/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manager Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Medications</CardTitle>
                            <CardDescription>In Inventory</CardDescription>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">352</CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Prescriptions</CardTitle>
                            <CardDescription>Currently Active</CardDescription>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">87</CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders Pending</CardTitle>
                            <CardDescription>Awaiting Shipment</CardDescription>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">12</CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Pharmacists</CardTitle>
                            <CardDescription>Total Staff</CardDescription>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">8</CardContent>
                    </Card>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button>Manage Medication Stock</Button>
                    <Button variant="outline">Order Medication Stock</Button>
                    <Button variant="outline">Manage Pharmacist Users</Button>
                    <Button variant="outline">Generate Stock Take Report</Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Alerts & Notifications</CardTitle>
                        <CardDescription>Important notices requiring attention</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                <TableRow>
                                    <TableCell className="text-red-500">Low Stock</TableCell>
                                    <TableCell>Adcodol 1ml below reorder level</TableCell>
                                    <TableCell>High</TableCell>
                                    <TableCell>Today</TableCell>
                                    <TableCell>
                                        <Button size="sm">Reorder</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-yellow-500">Expiring</TableCell>
                                    <TableCell>Prescription #PR-125 expiring soon</TableCell>
                                    <TableCell>Medium</TableCell>
                                    <TableCell>Tomorrow</TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="secondary">
                                            Review
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-orange-500">Pending</TableCell>
                                    <TableCell>Order #OR-789 awaiting approval</TableCell>
                                    <TableCell>Medium</TableCell>
                                    <TableCell>Yesterday</TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="secondary">
                                            Approve
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-red-500">Low Stock</TableCell>
                                    <TableCell>Paracetamol 500mg below reorder level</TableCell>
                                    <TableCell>High</TableCell>
                                    <TableCell>Today</TableCell>
                                    <TableCell>
                                        <Button size="sm">Reorder</Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Orders</CardTitle>
                                <CardDescription>Latest medication orders from suppliers</CardDescription>
                            </div>
                            <Button size="sm" variant="outline">
                                View All
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order No</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>ORD-5524</TableCell>
                                        <TableCell>PharmSupply Inc.</TableCell>
                                        <TableCell>25 April 2023</TableCell>
                                        <TableCell>
                                            <span className="text-yellow-600">Pending</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>ORD-5521</TableCell>
                                        <TableCell>MedExpress Ltd</TableCell>
                                        <TableCell>23 April 2023</TableCell>
                                        <TableCell>
                                            <span className="text-purple-600">Shipped</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>ORD-5518</TableCell>
                                        <TableCell>PharmaSolutions</TableCell>
                                        <TableCell>22 April 2023</TableCell>
                                        <TableCell>
                                            <span className="text-green-600">Delivered</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Stock Levels at Reorder Point</CardTitle>
                                <CardDescription>Medications that need to be restocked soon</CardDescription>
                            </div>
                            <Button size="sm" variant="outline">
                                View All
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Medication</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Reorder Level</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Adcodol 1ml</TableCell>
                                        <TableCell>12</TableCell>
                                        <TableCell>20</TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-red-600">Critical</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Paracetamol 500mg</TableCell>
                                        <TableCell>25</TableCell>
                                        <TableCell>30</TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-yellow-600">Low</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Amoxicillin 250mg</TableCell>
                                        <TableCell>18</TableCell>
                                        <TableCell>25</TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-yellow-600">Low</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Pharmacy Performance</CardTitle>
                        <CardDescription>Monthly sales and prescription fulfilment rates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col justify-between gap-4 sm:flex-row">
                            <div>
                                <p className="text-lg font-semibold">Monthly Sales</p>
                                <p className="text-3xl font-bold">R 125,850</p>
                                <p className="text-sm text-green-600">Up 8% from last month</p>
                            </div>
                            <div>
                                <p className="text-lg font-semibold">Prescription Fulfilment Rate</p>
                                <p className="text-3xl font-bold">96.7%</p>
                                <p className="text-sm">Target: 95%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
