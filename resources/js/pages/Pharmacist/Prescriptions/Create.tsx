import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface Medication {
    id: number;
    name: string;
    current_sale_price: number;
}

interface PrescriptionItem {
    medication_id: number | null;
    quantity: number;
    instructions: string;
}

interface Props {
    prescriptionId?: number;
    initialData: {
        customer_name: string | null;
        prescription_name: string | null;
        delivery_method: string | null;
        upload_date: string | null;
        pdf_url: string | null;
        patient_id_number?: string;
        doctor_id?: number;
    };
    doctors: { id: number; name: string }[];
    medications: Medication[];
}

export default function PrescriptionCreate({ prescriptionId, initialData, doctors, medications }: Props) {
    const safeInitialData = {
        customer_name: initialData.customer_name ?? '',
        prescription_name: initialData.prescription_name ?? '',
        delivery_method: initialData.delivery_method ?? '',
        upload_date: initialData.upload_date ?? '',
        pdf_url: initialData.pdf_url ?? '',
        patient_id_number: initialData.patient_id_number ?? '',
        doctor_id: initialData.doctor_id ? initialData.doctor_id.toString() : '',
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id_number: safeInitialData.patient_id_number,
        doctor_id: safeInitialData.doctor_id,
        items: [] as PrescriptionItem[],
    });

    const totalPrescriptionCost = data.items.reduce((acc, item) => {
        const med = medications.find((m) => m.id === item.medication_id);
        if (!med) return acc;
        return acc + item.quantity * med.current_sale_price;
    }, 0);

    // Initialize items with one empty row for user convenience
    useEffect(() => {
        if (data.items.length === 0) {
            setData('items', [{ medication_id: null, quantity: 1, instructions: '' }]);
        }
    }, []);

    // Update a single prescription item
    function updateItem(index: number, field: keyof PrescriptionItem, value: any) {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    }

    // Add new empty prescription item row
    function addItem() {
        setData('items', [...data.items, { medication_id: null, quantity: 1, instructions: '' }]);
    }

    // Remove item at index
    function removeItem(index: number) {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    }

    // Calculate total price for an item
    function calculateTotalPrice(item: PrescriptionItem) {
        if (!item.medication_id) return 0;
        const med = medications.find((m) => m.id === item.medication_id);
        if (!med) return 0;
        return item.quantity * med.current_sale_price;
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prescriptionId) {
            post(route('pharmacist.prescriptions.load', prescriptionId), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('pharmacist.prescriptions.create'), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AppLayout>
            <Head title={prescriptionId ? 'Load Prescription' : 'Create Prescription'} />

            <div className="mx-auto max-w-4xl p-4">
                <Heading
                    title={prescriptionId ? 'Load Prescription' : 'Create Prescription'}
                    description="Review prescription details and complete additional information."
                />

                <form onSubmit={submit} className="mt-6 space-y-6">
                    {/* PDF Link */}
                    <div>
                        <Label className="mb-1 block">Prescription PDF</Label>
                        {safeInitialData.pdf_url ? (
                            <a href={safeInitialData.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                                View Uploaded PDF
                            </a>
                        ) : (
                            <span>No PDF uploaded</span>
                        )}
                    </div>

                    {/* Read-only Preloaded Inputs */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label>Customer Name</Label>
                            <Input value={safeInitialData.customer_name} disabled />
                        </div>

                        <div>
                            <Label>Prescription Name</Label>
                            <Input value={safeInitialData.prescription_name} disabled />
                        </div>

                        <div>
                            <Label>Delivery Method</Label>
                            <Input value={safeInitialData.delivery_method} disabled />
                        </div>

                        <div>
                            <Label>Date of Upload</Label>
                            <Input value={safeInitialData.upload_date ? new Date(safeInitialData.upload_date).toLocaleDateString() : ''} disabled />
                        </div>
                    </div>

                    {/* Editable Inputs */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="patient_id">Patient ID Number</Label>
                            <Input
                                id="patient_id_number"
                                value={data.patient_id_number}
                                onChange={(e) => setData('patient_id_number', e.target.value)}
                            />
                            {errors.patient_id_number && <div className="mt-1 text-sm text-red-500">{errors.patient_id_number}</div>}
                        </div>

                        <div>
                            <Label>Prescribing Doctor</Label>
                            <Select value={data.doctor_id} onValueChange={(value) => setData('doctor_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a doctor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map((doc) => (
                                        <SelectItem key={doc.id} value={doc.id.toString()}>
                                            {doc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.doctor_id && <div className="mt-1 text-sm text-red-500">{errors.doctor_id}</div>}
                        </div>
                    </div>

                    {/* Prescription Items Section */}
                    <div className="mt-8">
                        <h3 className="mb-4 text-lg font-semibold">Prescription Items</h3>

                        {data.items.map((item, index) => (
                            <div key={index} className="mb-4 grid grid-cols-12 items-center gap-4">
                                <div className="col-span-4">
                                    <Label>Medication</Label>
                                    <Select
                                        value={item.medication_id ? item.medication_id.toString() : ''}
                                        onValueChange={(value) => updateItem(index, 'medication_id', parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select medication" />
                                        </SelectTrigger>

                                        {item.medication_id && (
                                            <div className="text-muted-foreground mt-1 text-sm">
                                                {medications.find((m) => m.id === item.medication_id)?.name} — R
                                                {medications.find((m) => m.id === item.medication_id)?.current_sale_price.toFixed(2)}
                                            </div>
                                        )}

                                        <SelectContent>
                                            {medications.map((med) => (
                                                <SelectItem key={med.id} value={med.id.toString()}>
                                                    {med.name}{' '}
                                                    {typeof med.current_sale_price === 'number' ? `(R${med.current_sale_price.toFixed(2)})` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-2">
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                                    />
                                </div>

                                <div className="col-span-4">
                                    <Label>Instructions</Label>
                                    <Input
                                        value={item.instructions}
                                        onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                                        placeholder="e.g. Take twice daily after meals"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <Label>Total Price</Label>
                                    <div className="pt-2 font-semibold">R{calculateTotalPrice(item).toFixed(2)}</div>
                                </div>

                                <div className="col-span-1 flex items-end">
                                    <Button type="button" variant="destructive" onClick={() => removeItem(index)} className="h-8 px-2">
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button type="button" onClick={addItem}>
                            + Add Medication Item
                        </Button>
                    </div>

                    {/* Total Prescription Cost Summary */}
                    <div className="mt-6 text-right text-lg font-semibold">Total Prescription Cost: R{totalPrescriptionCost.toFixed(2)}</div>

                    <div className="mt-8 flex justify-end">
                        <Button type="submit" disabled={processing}>
                            Save Prescription Details
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
