import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Download, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReportData {
    id: number;
    title: string;
    generated_at: string;
    file_size: string;
    download_count: number;
    parameters: {
        start_date: string;
        end_date: string;
        group_by: string;
    };
    file_exists: boolean;
    is_expired: boolean;
}

interface Props {
    recentReports: ReportData[];
}

export default function PharmacistReports({ recentReports }: Props) {
    const { delete: deleteReport, processing } = useForm();

    const handleDeleteReport = (reportId: number) => {
        if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            deleteReport(route('pharmacist.reports.delete', reportId), {
                onSuccess: () => {
                    toast.success('Report deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete report');
                },
            });
        }
    };
    return (
        <AppLayout>
            <Head title="Reports" />

            <div className="p-4">
                <Heading title="Reports" description="Generate various reports related to your pharmacy activities" />

                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dispensed Medications</CardTitle>
                            <CardDescription>
                                Generate a detailed PDF report of all medications you have dispensed within a specific date range
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href={route('pharmacist.reports.dispensed')}>Generate Dispensed Report</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Placeholder for future reports */}
                    <Card className="opacity-50">
                        <CardHeader>
                            <CardTitle>Prescription Summary</CardTitle>
                            <CardDescription>Summary of all prescriptions processed (Coming Soon)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button disabled className="w-full">
                                Coming Soon
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="opacity-50">
                        <CardHeader>
                            <CardTitle>Monthly Statistics</CardTitle>
                            <CardDescription>Monthly dispensing statistics and performance metrics (Coming Soon)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button disabled className="w-full">
                                Coming Soon
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Reports Section */}
                {recentReports.length > 0 && (
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Recent Reports
                            </CardTitle>
                            <CardDescription>
                                Download or delete your previously generated reports. Reports are automatically deleted after 30 days.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Report</TableHead>
                                            <TableHead>Date Range</TableHead>
                                            <TableHead>Generated</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead>Downloads</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentReports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">{report.title}</span>
                                                        <span className="text-muted-foreground text-sm">Grouped by {report.parameters.group_by}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {report.parameters.start_date} to {report.parameters.end_date}
                                                </TableCell>
                                                <TableCell>{report.generated_at}</TableCell>
                                                <TableCell>{report.file_size}</TableCell>
                                                <TableCell>{report.download_count}</TableCell>
                                                <TableCell>
                                                    {!report.file_exists ? (
                                                        <Badge variant="destructive">File Missing</Badge>
                                                    ) : report.is_expired ? (
                                                        <Badge variant="secondary">Expired</Badge>
                                                    ) : (
                                                        <Badge variant="default">Available</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {report.file_exists && !report.is_expired && (
                                                            <Button size="sm" variant="outline" asChild>
                                                                <Link href={route('pharmacist.reports.download', report.id)}>
                                                                    <Download className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDeleteReport(report.id)}
                                                            disabled={processing}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {recentReports.length === 0 && (
                    <Card className="mt-8">
                        <CardContent className="py-8 text-center">
                            <FileText className="text-muted-foreground mx-auto h-12 w-12" />
                            <h3 className="mt-4 text-lg font-semibold">No Reports Generated Yet</h3>
                            <p className="text-muted-foreground mt-2">Generate your first dispensed medication report to see it listed here.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
