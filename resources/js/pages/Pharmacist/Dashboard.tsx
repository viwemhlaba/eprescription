import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

// Define the types for your incoming props
interface MetricsData {
    prescriptionsLoadedToday: number;
    prescriptionsDispensedToday: number;
    totalPrescriptionsPending: number;
}

interface Activity {
    id: number;
    activity: string;
    prescription_name: string;
    customer_name: string;
    date: string;
    time: string;
}

interface PharmacistDashboardProps {
    pharmacistName: string;
    metrics?: MetricsData;
    recentActivities?: Activity[]; // Make recentActivities optional here
}

// Update the component to accept props
const PharmacistDashboard = ({ pharmacistName, metrics, recentActivities }: PharmacistDashboardProps) => {
    // Provide a safe default for metrics if it's undefined
    const safeMetrics = metrics ?? {
        prescriptionsLoadedToday: 0,
        prescriptionsDispensedToday: 0,
        totalPrescriptionsPending: 0,
    };

    // Provide a safe default for recentActivities if it's undefined
    const safeRecentActivities = recentActivities ?? [];

    return (
        <AppLayout>
            <Head title="Pharmacist Dashboard" />
            <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Welcome, {pharmacistName}</CardTitle>
                    </CardHeader>
                </Card>

                {/* Key Metrics Section */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">Prescriptions Loaded Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{safeMetrics.prescriptionsLoadedToday}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">Prescriptions Dispensed Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{safeMetrics.prescriptionsDispensedToday}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">Total Prescriptions Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{safeMetrics.totalPrescriptionsPending}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <Button variant="default" className="bg-white text-black hover:bg-gray-200" asChild>
                            <Link href={route('pharmacist.prescriptions.index')}>View Prescriptions</Link>
                        </Button>

                        <Button variant="default" className="bg-white text-black hover:bg-gray-200" asChild>
                            <Link href={route('pharmacist.prescriptions.index', { status: 'dispensed' })}>Dispense Prescription</Link>
                        </Button>

                        <Button variant="default" className="bg-white text-black hover:bg-gray-200" asChild>
                            <Link href={route('pharmacist.prescriptions.index', { status: 'pending' })}>View Pending Prescriptions</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Activity Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Use safeRecentActivities here */}
                        {safeRecentActivities.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No recent activity.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Activity</TableHead>
                                        <TableHead>Prescription Name</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {safeRecentActivities.map((activity) => (
                                        <TableRow key={activity.id}>
                                            <TableCell>{activity.activity}</TableCell>
                                            <TableCell>
                                                <Link
                                                    href={route('pharmacist.prescriptions.show', activity.id)}
                                                    className="text-blue-400 hover:underline"
                                                >
                                                    {activity.prescription_name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{activity.customer_name}</TableCell>
                                            <TableCell>{activity.date}</TableCell>
                                            <TableCell>{activity.time}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default PharmacistDashboard;
