import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

// Define interfaces
interface Doctor {
    id: number;
    name: string;
}

interface Medication {
    id: number;
    name: string;
    current_sale_price: number;
    active_ingredients: number[];
}

interface PrescriptionItem {
    medication_id: number | null;
    quantity: number;
    instructions: string;
}

interface Props {
    doctors: Doctor[];
    medications: Medication[];
}

export default function CreateWithPDF({ doctors, medications }: Props) {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfError, setPdfError] = useState<string>('');

    const { data, setData, post, processing, errors } = useForm({
        prescription_date: new Date().toISOString().split('T')[0], // Default to today
        patient_id_number: '',
        doctor_id: '',
        pdf_file: null as File | null,
        items: [{ medication_id: null, quantity: 1, instructions: '' }] as PrescriptionItem[],
        repeats: 0,
        notes: '',
    });

    // Handle PDF file upload
    const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setPdfError('');

        if (!file) return;

        // Validate file type
        if (file.type !== 'application/pdf') {
            setPdfError('Please upload a PDF file only.');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setPdfError('File size must be less than 5MB.');
            return;
        }

        setPdfFile(file);
        setData('pdf_file', file);
    };

    // Add medication item
    const addItem = () => {
        setData('items', [...data.items, { medication_id: null, quantity: 1, instructions: '' }]);
    };

    // Remove medication item
    const removeItem = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    // Update medication item
    const updateItem = (index: number, field: keyof PrescriptionItem, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    // Calculate total cost
    const totalCost = data.items.reduce((total, item) => {
        if (!item.medication_id) return total;
        const medication = medications.find((m) => m.id === item.medication_id);
        return total + (medication ? medication.current_sale_price * item.quantity : 0);
    }, 0);

    // Form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate at least one medication
        const validItems = data.items.filter((item) => item.medication_id && item.quantity > 0);
        if (validItems.length === 0) {
            toast.error('Please add at least one medication.');
            return;
        }

        // Submit with FormData for file upload
        post(route('pharmacist.prescriptions.createWithPdf'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Prescription created successfully!');
            },
            onError: () => {
                toast.error('Failed to create prescription. Please try again.');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Prescription with PDF" />

            <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-3">
                    <Link href={route('pharmacist.prescriptions.index')}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Heading title="Create Prescription from PDF" description="Upload a prescription PDF and enter medication details." />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* PDF Upload Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Prescription PDF</CardTitle>
                            <CardDescription>Upload the prescription PDF file (PDF only, max 5MB)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex w-full items-center justify-center">
                                    <label
                                        htmlFor="pdf-upload"
                                        className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> prescription PDF
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">PDF only (MAX. 5MB)</p>
                                        </div>
                                        <input id="pdf-upload" type="file" className="hidden" accept=".pdf" onChange={handlePdfUpload} required />
                                    </label>
                                </div>

                                {pdfFile && (
                                    <div className="rounded-md border border-green-200 bg-green-50 p-3">
                                        <p className="text-sm text-green-700">
                                            ✓ {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    </div>
                                )}

                                {pdfError && <p className="text-sm text-red-600">{pdfError}</p>}
                                {errors.pdf_file && <p className="text-sm text-red-600">{errors.pdf_file}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Prescription Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Prescription Details</CardTitle>
                            <CardDescription>Enter the prescription information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="prescription_date">Prescription Date</Label>
                                    <Input
                                        id="prescription_date"
                                        type="date"
                                        value={data.prescription_date}
                                        onChange={(e) => setData('prescription_date', e.target.value)}
                                        required
                                    />
                                    {errors.prescription_date && <p className="text-sm text-red-600">{errors.prescription_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="patient_id_number">Patient ID Number</Label>
                                    <Input
                                        id="patient_id_number"
                                        type="text"
                                        value={data.patient_id_number}
                                        onChange={(e) => setData('patient_id_number', e.target.value)}
                                        placeholder="Enter patient ID number"
                                        required
                                    />
                                    {errors.patient_id_number && <p className="text-sm text-red-600">{errors.patient_id_number}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="doctor_id">Prescribing Doctor</Label>
                                    <Select value={data.doctor_id} onValueChange={(value) => setData('doctor_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a doctor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {doctors.map((doctor) => (
                                                <SelectItem key={doctor.id} value={doctor.id.toString()}>
                                                    {doctor.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.doctor_id && <p className="text-sm text-red-600">{errors.doctor_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="repeats">Number of Repeats</Label>
                                    <Input
                                        id="repeats"
                                        type="number"
                                        min="0"
                                        max="5"
                                        value={data.repeats}
                                        onChange={(e) => setData('repeats', parseInt(e.target.value) || 0)}
                                    />
                                    {errors.repeats && <p className="text-sm text-red-600">{errors.repeats}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medications</CardTitle>
                            <CardDescription>Add medications prescribed</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-4 rounded-lg border p-4">
                                    <div className="col-span-12 sm:col-span-5">
                                        <Label>Medication</Label>
                                        <Select
                                            value={item.medication_id ? item.medication_id.toString() : ''}
                                            onValueChange={(value) => updateItem(index, 'medication_id', parseInt(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select medication" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {medications.map((med) => (
                                                    <SelectItem key={med.id} value={med.id.toString()}>
                                                        {med.name} (R{med.current_sale_price.toFixed(2)})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-12 sm:col-span-2">
                                        <Label>Quantity</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                        />
                                    </div>

                                    <div className="col-span-12 sm:col-span-4">
                                        <Label>Instructions</Label>
                                        <Input
                                            value={item.instructions}
                                            onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                                            placeholder="Take twice daily after meals"
                                        />
                                    </div>

                                    <div className="col-span-12 flex items-end sm:col-span-1">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeItem(index)}
                                            disabled={data.items.length === 1}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <Button type="button" onClick={addItem} variant="outline">
                                + Add Medication
                            </Button>

                            <div className="text-right text-lg font-semibold">Total Cost: R{totalCost.toFixed(2)}</div>
                        </CardContent>
                    </Card>

                    {/* Additional Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Add any additional notes or observations..."
                                rows={4}
                            />
                            {errors.notes && <p className="text-sm text-red-600">{errors.notes}</p>}
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4">
                        <Button asChild variant="outline">
                            <Link href={route('pharmacist.prescriptions.index')}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing || !pdfFile}>
                            {processing ? 'Creating...' : 'Create Prescription'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
