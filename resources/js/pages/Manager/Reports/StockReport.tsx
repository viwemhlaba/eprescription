import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, Download, FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface RecentReport {
    id: number;
    title: string;
    generated_at: string;
    file_size: string;
    download_count: number;
    parameters: {
        group_by: string;
        stock_filter: string;
        include_zero_stock: boolean;
        sort_by: string;
        sort_direction: string;
    };
    file_exists: boolean;
    is_expired: boolean;
}

interface StockReportProps extends PageProps {
    recentReports: RecentReport[];
}

export default function StockReport({ recentReports }: StockReportProps) {
    const [formData, setFormData] = useState({
        group_by: 'dosage_form',
        stock_filter: 'all',
        include_zero_stock: false,
        sort_by: 'name',
        sort_direction: 'asc',
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleGenerateReport = async () => {
        setIsGenerating(true);

        try {
            // Build the URL with query parameters
            const queryParams = new URLSearchParams({
                group_by: formData.group_by,
                stock_filter: formData.stock_filter,
                include_zero_stock: formData.include_zero_stock.toString(),
                sort_by: formData.sort_by,
                sort_direction: formData.sort_direction,
            });

            const url = route('manager.reports.stock.generate') + '?' + queryParams.toString();

            // First, make a request to check if data exists
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                // Handle error responses
                const errorData = await response.json();

                if (response.status === 404) {
                    // No data found
                    toast.error(errorData.message, {
                        description: errorData.details,
                        duration: 5000,
                    });
                } else if (response.status === 422) {
                    // Validation errors
                    toast.error(errorData.message, {
                        description: 'Please check your input parameters and try again.',
                        duration: 5000,
                    });
                } else {
                    // Other errors
                    toast.error('Failed to generate report', {
                        description: 'An unexpected error occurred. Please try again.',
                        duration: 5000,
                    });
                }
                return;
            }

            // If we get here, the response was successful and contains PDF data
            const blob = await response.blob();

            // Create download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `stock-report-${formData.group_by}-${formData.stock_filter}-${new Date().toISOString().split('T')[0]}.pdf`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the blob URL
            window.URL.revokeObjectURL(downloadUrl);

            toast.success('Stock report generated and downloaded successfully!', {
                description: 'The PDF file has been saved to your downloads folder.',
                duration: 3000,
            });

            // Refresh the page after a short delay to show the new report in the list
            setTimeout(() => {
                router.reload({ only: ['recentReports'] });
            }, 2000);
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Failed to generate report', {
                description: 'An unexpected error occurred. Please try again.',
                duration: 5000,
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadReport = (reportId: number) => {
        window.open(route('manager.reports.stock.download', reportId), '_blank');
    };

    const getFilterDisplayName = (filter: string) => {
        const filters: { [key: string]: string } = {
            all: 'All Medications',
            low_stock: 'Low Stock Only',
            out_of_stock: 'Out of Stock Only',
        };
        return filters[filter] || filter;
    };

    const getGroupByDisplayName = (groupBy: string) => {
        const groups: { [key: string]: string } = {
            dosage_form: 'Dosage Form',
            schedule: 'Schedule',
            supplier: 'Supplier',
        };
        return groups[groupBy] || groupBy;
    };

    return (
        <AppLayout>
            <Head title="Stock Reports" />
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <Heading title="Stock Reports" description="Generate detailed medication stock reports for inventory management and stock take." />

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Report Generation Form */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Generate New Report
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="group_by">Group medications by</Label>
                                    <Select value={formData.group_by} onValueChange={(value) => handleInputChange('group_by', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select grouping method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dosage_form">Dosage Form</SelectItem>
                                            <SelectItem value="schedule">Schedule</SelectItem>
                                            <SelectItem value="supplier">Supplier</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock_filter">Stock filter</Label>
                                    <Select value={formData.stock_filter} onValueChange={(value) => handleInputChange('stock_filter', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select stock filter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Medications</SelectItem>
                                            <SelectItem value="low_stock">Low Stock Only</SelectItem>
                                            <SelectItem value="out_of_stock">Out of Stock Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_by">Sort by</Label>
                                    <Select value={formData.sort_by} onValueChange={(value) => handleInputChange('sort_by', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sort field" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="name">Medication Name</SelectItem>
                                            <SelectItem value="quantity_on_hand">Quantity on Hand</SelectItem>
                                            <SelectItem value="reorder_level">Reorder Level</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_direction">Sort direction</Label>
                                    <Select value={formData.sort_direction} onValueChange={(value) => handleInputChange('sort_direction', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sort direction" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="asc">Ascending (A-Z, Low-High)</SelectItem>
                                            <SelectItem value="desc">Descending (Z-A, High-Low)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="include_zero_stock"
                                        checked={formData.include_zero_stock}
                                        onCheckedChange={(checked) => handleInputChange('include_zero_stock', checked)}
                                    />
                                    <Label htmlFor="include_zero_stock" className="text-sm">
                                        Include zero stock items
                                    </Label>
                                </div>

                                <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
                                    {isGenerating ? 'Generating...' : 'Generate PDF Report'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Reports List */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Recent Reports
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentReports.length === 0 ? (
                                    <div className="py-8 text-center text-gray-500">
                                        <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                        <p>No reports generated yet.</p>
                                        <p className="text-sm">Generate your first stock report using the form on the left.</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Report</TableHead>
                                                <TableHead>Parameters</TableHead>
                                                <TableHead>Generated</TableHead>
                                                <TableHead>Downloads</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentReports.map((report) => (
                                                <TableRow key={report.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{report.title}</p>
                                                            <p className="text-sm text-gray-500">{report.file_size}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <Badge variant="outline" className="text-xs">
                                                                {getGroupByDisplayName(report.parameters.group_by)}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                {getFilterDisplayName(report.parameters.stock_filter)}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4" />
                                                            {report.generated_at}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm">{report.download_count}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDownloadReport(report.id)}
                                                            disabled={!report.file_exists || report.is_expired}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            Download
                                                        </Button>
                                                        {!report.file_exists && <p className="mt-1 text-xs text-red-500">File not found</p>}
                                                        {report.is_expired && <p className="mt-1 text-xs text-yellow-500">Expired</p>}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
