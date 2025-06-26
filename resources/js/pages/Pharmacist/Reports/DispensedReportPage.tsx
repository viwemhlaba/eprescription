import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ReportFormData {
    start_date: string;
    end_date: string;
    group_by: string;
    [key: string]: any;
}

export default function DispensedReportPage() {
    const [isGenerating, setIsGenerating] = useState(false);

    const { data, setData, errors, processing } = useForm<ReportFormData>({
        start_date: '',
        end_date: '',
        group_by: 'patient',
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!data.start_date || !data.end_date) {
            toast.error('Please select both start and end dates');
            return;
        }

        if (new Date(data.start_date) > new Date(data.end_date)) {
            toast.error('Start date cannot be after end date');
            return;
        }

        setIsGenerating(true);

        try {
            // Build the URL with query parameters
            const queryParams = new URLSearchParams({
                start_date: data.start_date,
                end_date: data.end_date,
                group_by: data.group_by,
            });

            const url = route('pharmacist.reports.dispensed-pdf') + '?' + queryParams.toString();

            // Create a temporary link and click it to trigger download
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('PDF report is being generated and will download shortly');
        } catch (error) {
            toast.error('Failed to generate PDF report. Please try again.');
            console.error('PDF generation error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Dispensed Medication Report" />

            <div className="p-4">
                <Heading
                    title="Dispensed Medication Report"
                    description="Generate PDF reports of medications you have dispensed within a specified date range"
                />

                <Card className="mt-6 max-w-2xl">
                    <CardHeader>
                        <CardTitle>Report Parameters</CardTitle>
                        <CardDescription>Select the date range and grouping method for your dispensed medication report</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Date Range Section */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        max={new Date().toISOString().split('T')[0]} // Can't select future dates
                                        required
                                    />
                                    {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        max={new Date().toISOString().split('T')[0]} // Can't select future dates
                                        required
                                    />
                                    {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                                </div>
                            </div>

                            {/* Grouping Section */}
                            <div className="space-y-2">
                                <Label htmlFor="group_by">Group Report By</Label>
                                <Select value={data.group_by} onValueChange={(value) => setData('group_by', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select grouping method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="patient">Patient</SelectItem>
                                        <SelectItem value="medication">Medication</SelectItem>
                                        <SelectItem value="schedule">Schedule</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.group_by && <p className="text-sm text-red-500">{errors.group_by}</p>}
                                <p className="text-muted-foreground text-sm">
                                    {data.group_by === 'patient' && 'Group medications by patient name'}
                                    {data.group_by === 'medication' && 'Group dispensed items by medication name'}
                                    {data.group_by === 'schedule' && 'Group medications by their schedule classification'}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                                <Button type="submit" disabled={isGenerating || processing} className="w-full sm:w-auto">
                                    {isGenerating ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" />
                                            Generating PDF...
                                        </>
                                    ) : (
                                        'Generate PDF Report'
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setData({
                                            start_date: '',
                                            end_date: '',
                                            group_by: 'patient',
                                        });
                                    }}
                                    className="w-full sm:w-auto"
                                >
                                    Reset Form
                                </Button>
                            </div>

                            {/* Helper Text */}
                            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Report Information</h3>
                                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                            <ul className="list-inside list-disc space-y-1">
                                                <li>This report includes only medications that you have personally dispensed</li>
                                                <li>
                                                    The report will include: dispensed date, medication name, quantity, patient details, doctor name,
                                                    and schedule
                                                </li>
                                                <li>PDF will be generated and downloaded automatically</li>
                                                <li>If no data is found for the selected date range, you will be notified</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
