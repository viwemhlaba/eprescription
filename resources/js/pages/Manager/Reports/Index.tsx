import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Package, TrendingUp, Users } from 'lucide-react';

export default function ReportsIndex() {
    return (
        <AppLayout>
            <Head title="Reports" />
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <Heading title="Reports" description="Access pharmacy statistics and generate various reports for management insights." />

                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Stock Reports */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Stock Reports
                            </CardTitle>
                            <CardDescription>
                                Generate detailed medication stock reports grouped by dosage form, schedule, or supplier. Perfect for stock take
                                activities.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href={route('manager.reports.stock')}>Generate Stock Report</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Prescription Analytics - Coming Soon */}
                    <Card className="opacity-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Prescription Analytics
                            </CardTitle>
                            <CardDescription>
                                Comprehensive analysis of prescription trends, doctor activity, and medication usage patterns.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button disabled className="w-full">
                                Coming Soon
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Sales Reports - Coming Soon */}
                    <Card className="opacity-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Sales Reports
                            </CardTitle>
                            <CardDescription>
                                Revenue analysis, top-selling medications, and financial performance tracking over time.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button disabled className="w-full">
                                Coming Soon
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Customer Reports - Coming Soon */}
                    <Card className="opacity-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Customer Reports
                            </CardTitle>
                            <CardDescription>Customer activity, repeat prescriptions, and patient demographic insights.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button disabled className="w-full">
                                Coming Soon
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Low Stock Alerts - Coming Soon */}
                    <Card className="opacity-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Inventory Alerts
                            </CardTitle>
                            <CardDescription>Automated reports for low stock, expired medications, and reorder recommendations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button disabled className="w-full">
                                Coming Soon
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Pharmacist Performance - Coming Soon */}
                    <Card className="opacity-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Pharmacist Performance
                            </CardTitle>
                            <CardDescription>Dispensing statistics, productivity metrics, and performance analytics by pharmacist.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button disabled className="w-full">
                                Coming Soon
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
