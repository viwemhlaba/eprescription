import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
// Add these imports for Dialog components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

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

type FormDataType = {
    patient_id_number: string;
    doctor_id: string;
    items: PrescriptionItem[];
    notes: string;
};

interface Props {
    prescriptionId?: number;
    initialData?: { // Make initialData optional
        customer_name: string | null;
        prescription_name: string | null;
        delivery_method: string | null;
        upload_date: string | null;
        pdf_url: string | null;
        patient_id_number?: string;
        doctor_id?: number;
    };
    doctors: { id: number; name: string }[];
    medications?: (Medication & { active_ingredients: number[] })[]; // Make medications optional
    customerAllergyIds: number[];
}

export default function PrescriptionCreate({ prescriptionId, initialData, doctors, medications, customerAllergyIds, existingPrescriptionItems }: Props) {
    // Provide a default empty object if initialData is undefined
    const safeInitialData = {
        customer_name: initialData?.customer_name ?? '',
        prescription_name: initialData?.prescription_name ?? '',
        delivery_method: initialData?.delivery_method ?? '',
        upload_date: initialData?.upload_date ?? '',
        pdf_url: initialData?.pdf_url ?? '',
        patient_id_number: initialData?.patient_id_number ?? '',
        doctor_id: initialData?.doctor_id ? initialData.doctor_id.toString() : '',
    };

    const { data, setData, post, processing, errors, reset } = useForm<FormDataType>({
        patient_id_number: safeInitialData.patient_id_number,
        doctor_id: safeInitialData.doctor_id,
        // Initialize items with existing items if available, otherwise an empty array or a single blank item
        items: existingPrescriptionItems && existingPrescriptionItems.length > 0
            ? existingPrescriptionItems
            : [{ medication_id: null, quantity: 1, instructions: '' }],
        notes: '',
    });

    // Ensure medications is an array before calling reduce or find
    const safeMedications = medications ?? [];

    const totalPrescriptionCost = (data.items ?? []).reduce((acc: number, item: PrescriptionItem) => {
        const med = safeMedications.find((m) => m.id === item.medication_id);
        if (!med) return acc;
        return acc + item.quantity * med.current_sale_price;
    }, 0);

    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const {
        data: doctorData,
        setData: setDoctorData,
        post: postDoctor,
        processing: doctorProcessing,
        errors: doctorErrors,
        reset: resetDoctor,
    } = useForm({
        name: '',
        surname: '',
        email: '',
        phone: '',
        practice_number: '',
    });

    function openDoctorModal() {
        setIsDoctorModalOpen(true);
    }

    function closeDoctorModal() {
        setIsDoctorModalOpen(false);
        resetDoctor();
    }

    function submitDoctor(e: React.FormEvent) {
        e.preventDefault();
        postDoctor(route('pharmacist.doctors.store'), {
            onSuccess: () => {
                closeDoctorModal();
                window.location.reload();
            },
        });
    }

    useEffect(() => {
        if ((data.items ?? []).length === 0) {
            setData('items', [{ medication_id: null, quantity: 1, instructions: '' }]);
        }
    }, []);

    function updateItem(index: number, field: keyof PrescriptionItem, value: string | number | null) {
        const newItems = [...(data.items ?? [])];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    }

    function addItem() {
        setData('items', [...(data.items ?? []), { medication_id: null, quantity: 1, instructions: '' }]);
    }

    function removeItem(index: number) {
        const newItems = (data.items ?? []).filter((_, i) => i !== index);
        setData('items', newItems);
    }

    function calculateTotalPrice(item: PrescriptionItem) {
        if (!item.medication_id) return 0;
        const med = safeMedications.find((m) => m.id === item.medication_id);
        if (!med) return 0;
        return item.quantity * med.current_sale_price;
    }

    function checkItemAllergy(item: PrescriptionItem) {
        if (!item.medication_id) return false;
        const med = safeMedications.find((m) => m.id === item.medication_id);
        if (!med) return false;
        return med.active_ingredients.some((ingredientId) => customerAllergyIds.includes(ingredientId));
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prescriptionId) return;
        post(route('pharmacist.prescriptions.load', prescriptionId), {
            onSuccess: () => reset(),
        });
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
                        <div className="grid grid-cols-1 md:grid-cols-2 flex">
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
                                <Button type="button" onClick={openDoctorModal} size="sm" variant="outline">
                                    + Add Doctor
                                </Button>
                            </div>
                            {errors.doctor_id && <div className="mt-1 text-sm text-red-500">{errors.doctor_id}</div>}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="mb-4 text-lg font-semibold">Prescription Items</h3>

                        {(data.items ?? []).map((item: PrescriptionItem, index: number) => (
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
                                                {safeMedications.find((m) => m.id === item.medication_id)?.name} — R
                                                {safeMedications.find((m) => m.id === item.medication_id)?.current_sale_price.toFixed(2)}
                                            </div>
                                        )}

                                        <SelectContent>
                                            {safeMedications.map((med) => (
                                                <SelectItem key={med.id} value={med.id.toString()}>
                                                    {med.name}{' '}
                                                    {typeof med.current_sale_price === 'number' ? `(R${med.current_sale_price.toFixed(2)})` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {checkItemAllergy(item) && (
                                    <div className="col-span-12 mt-1 font-semibold text-red-600">
                                        ⚠️ Warning: This medication contains ingredients you are allergic to!
                                    </div>
                                )}

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

                    <div className="mt-6">
                        <Label htmlFor="notes">Prescription Notes</Label>
                        <textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Add any general notes or pharmacist observations here..."
                            className="focus:border-primary focus:ring-primary/20 mt-1 block w-full rounded-md border border-gray-300 bg-black p-2 text-white shadow-sm focus:ring"
                            rows={4}
                        />
                        {errors.notes && <div className="mt-1 text-sm text-red-500">{errors.notes}</div>}
                    </div>

                    <div className="mt-6 text-right text-lg font-semibold">Total Prescription Cost: R{totalPrescriptionCost.toFixed(2)}</div>

                    <div className="mt-8 flex justify-end">
                        <Button type="submit" disabled={processing}>
                            Save Prescription Details
                        </Button>
                    </div>
                </form>
            </div>

            {isDoctorModalOpen && (
                <Dialog open={isDoctorModalOpen} onOpenChange={setIsDoctorModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Doctor</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={submitDoctor} className="space-y-4">
                            <div>
                                <Label htmlFor="name">First Name</Label>
                                <Input
                                    id="name"
                                    value={doctorData.name}
                                    onChange={(e) => setDoctorData('name', e.target.value)}
                                    required
                                />
                                {doctorErrors.name && <p className="text-red-500 text-sm">{doctorErrors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="surname">Surname</Label>
                                <Input
                                    id="surname"
                                    value={doctorData.surname}
                                    onChange={(e) => setDoctorData('surname', e.target.value)}
                                    required
                                />
                                {doctorErrors.surname && <p className="text-red-500 text-sm">{doctorErrors.surname}</p>}
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={doctorData.email}
                                    onChange={(e) => setDoctorData('email', e.target.value)}
                                    required
                                />
                                {doctorErrors.email && <p className="text-red-500 text-sm">{doctorErrors.email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={doctorData.phone}
                                    onChange={(e) => setDoctorData('phone', e.target.value)}
                                    required
                                />
                                {doctorErrors.phone && <p className="text-red-500 text-sm">{doctorErrors.phone}</p>}
                            </div>

                            <div>
                                <Label htmlFor="practice_number">Practice Number</Label>
                                <Input
                                    id="practice_number"
                                    value={doctorData.practice_number}
                                    onChange={(e) => setDoctorData('practice_number', e.target.value)}
                                    required
                                />
                                {doctorErrors.practice_number && <p className="text-red-500 text-sm">{doctorErrors.practice_number}</p>}
                            </div>

                            <div className="flex justify-end space-x-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={doctorProcessing}>
                                    Add Doctor
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    );
}
