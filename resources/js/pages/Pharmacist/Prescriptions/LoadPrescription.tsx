import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
// Removed: import { useToast } from '@/components/ui/use-toast';
import CustomerAllergyModal from '@/components/CustomerAllergyModal';
import Heading from '@/components/heading';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Define the type for a Doctor
interface Doctor {
    id: number;
    name: string;
    email: string;
    surname?: string;
    phone?: string;
    practice_number?: string;
}

// Define the type for a Medication (from your existing code)
interface Medication {
    id: number;
    name: string;
    current_sale_price: number;
    active_ingredients: number[];
}

// Define the type for a PrescriptionItem (from your existing code)
interface PrescriptionItem {
    medication_id: number | null;
    quantity: number;
    instructions: string;
    price?: number;
}

// Define the structure of the Prescription object passed from the backend (from your existing code)
interface Prescription {
    id: number;
    user_id: number | null;
    file_path: string | null;
    status: 'pending' | 'approved' | 'dispensed' | 'rejected';
    reason_for_rejection: string | null;
    doctor_id: number | null;
    created_at: string;
    updated_at: string;
    delivery_method: string;
    name: string;
    patient_id_number: string | null;
    repeats_total: number; // Ensure this is present in your backend's Prescription model/resource
    repeats_used: number;
    next_repeat_date: string | null;
    is_manual?: boolean;
    user: {
        id: number;
        name: string;
        surname: string;
        email: string;
        id_number?: string;
        phone_number?: string;
    } | null;
    items: PrescriptionItem[];
}

// New type for CustomerAllergy objects passed from backend
interface CustomerAllergy {
    id: number;
    active_ingredient_id: number;
    active_ingredient_name: string;
}

// Customer interface for manual prescription selection
interface Customer {
    id: number;
    name: string;
    surname: string;
    email: string;
    id_number: string | null;
    full_name: string;
}

// Define the props for the LoadPrescription page component
interface LoadPrescriptionProps {
    prescription: Prescription;
    doctors: Doctor[];
    medications: Medication[];
    customerAllergies: CustomerAllergy[];
    existingPrescriptionItems: PrescriptionItem[];
    customers?: Customer[]; // Optional for manual prescriptions
}

const LoadPrescription: React.FC<LoadPrescriptionProps> = ({
    prescription,
    doctors,
    medications,
    customerAllergies,
    existingPrescriptionItems,
    customers,
}) => {
    // Removed: const { toast } = useToast();
    const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

    // Form state for the main prescription update
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        customer_id: prescription.user_id?.toString() || '', // For manual prescriptions
        patient_id_number: prescription.patient_id_number || '',
        doctor_id: prescription.doctor_id?.toString() || '',
        items: existingPrescriptionItems.length > 0 ? existingPrescriptionItems : [{ medication_id: null, quantity: 1, instructions: '' }],
        status: prescription.status,
        reason_for_rejection: prescription.reason_for_rejection || '',
        notes: '',
        // --- ADDED THIS LINE FOR REPEATS_TOTAL ---
        repeats_total: prescription.repeats_total ?? 0, // Initialize with existing repeats or 0
    });

    // Form state for adding a new doctor
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

    // Handle Doctor Modal open/close
    const openDoctorModal = () => setIsDoctorModalOpen(true);
    const closeDoctorModal = () => {
        setIsDoctorModalOpen(false);
        resetDoctor();
    };

    // Submit for adding a new doctor
    const submitDoctor = (e: React.FormEvent) => {
        e.preventDefault();
        postDoctor(route('pharmacist.doctors.store'), {
            onSuccess: () => {
                closeDoctorModal();
                // We'll rely on the page reload or manual refresh for updated doctor list
                window.location.reload();
                // Removed: toast({ title: "Doctor Added", description: "New doctor has been successfully added." });
            },
            onError: (err) => {
                console.error('Failed to add doctor:', err);
                // If you want to show an error message without toast, you'd implement a different UI feedback here
            },
        });
    };

    // Initialize items if none exist
    useEffect(() => {
        if ((data.items ?? []).length === 0) {
            setData('items', [{ medication_id: null, quantity: 1, instructions: '' }]);
        }
    }, [data.items, setData]);

    // Helper functions for managing prescription items
    const updateItem = (index: number, field: keyof PrescriptionItem, value: string | number | null) => {
        const newItems = [...(data.items ?? [])];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const addItem = () => {
        setData('items', [...(data.items ?? []), { medication_id: null, quantity: 1, instructions: '' }]);
    };

    const removeItem = (index: number) => {
        const newItems = (data.items ?? []).filter((_, i) => i !== index);
        setData('items', newItems);
    };

    // Calculate total price for a single item
    const calculateTotalPrice = (item: PrescriptionItem) => {
        if (!item.medication_id) return 0;
        const med = medications.find((m) => m.id === item.medication_id);
        if (!med) return 0;
        return item.quantity * med.current_sale_price;
    };

    // Calculate overall total cost of the prescription
    const totalPrescriptionCost = (data.items ?? []).reduce((acc: number, item: PrescriptionItem) => {
        return acc + calculateTotalPrice(item);
    }, 0);

    // Check if a medication contains an active ingredient the customer is allergic to
    const checkItemAllergy = (item: PrescriptionItem) => {
        if (!item.medication_id) return false;
        const med = medications.find((m) => m.id === item.medication_id);
        if (!med || !med.active_ingredients) return false;

        return med.active_ingredients.some((medIngredientId) =>
            customerAllergies.some((allergy) => allergy.active_ingredient_id === medIngredientId),
        );
    };

    // Main form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pharmacist.prescriptions.loadAction', { prescription: prescription.id }), {
            onSuccess: () => {
                // If you want a success message, you'd implement a different UI feedback here (e.g., alert, inline message)
                console.log(`Prescription for ${prescription.user?.name ?? 'Unknown'} has been updated.`);
                // Optionally redirect or update local state
            },
            onError: (formErrors) => {
                console.error('Error processing prescription:', formErrors);
                // If you want an error message, implement a different UI feedback here
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Load Prescription: ${prescription.id}`} />

            <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <Heading title={`Prescription ${prescription.id}`} description="Review and manage this prescription details and status." />

                <Card>
                    <CardHeader>
                        <CardTitle>Prescription Overview</CardTitle>
                        <CardDescription>Details provided by the customer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Customer Name</Label>
                                <p className="font-medium">
                                    {prescription.user?.name ?? 'Unknown'} {prescription.user?.surname ?? ''}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Prescription Name</Label>
                                <p className="font-medium">{prescription.name}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Delivery Method</Label>
                                <p className="font-medium capitalize">{prescription.delivery_method}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Upload Date</Label>
                                <p className="font-medium">{new Date(prescription.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Current Status</Label>
                                <p className="font-medium capitalize">{prescription.status}</p>
                            </div>
                            {prescription.file_path && (
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Uploaded Prescription File</Label>
                                    <div className="mt-2 rounded-md border bg-gray-50 p-2 dark:bg-gray-800">
                                        <a
                                            href={`/storage/${prescription.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            View Uploaded File
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <Button
                                    type="button"
                                    onClick={() => setIsAllergyModalOpen(true)}
                                    variant={customerAllergies.length > 0 ? 'destructive' : 'outline'}
                                    className="w-full"
                                >
                                    {customerAllergies.length > 0 ? (
                                        <>Customer has {customerAllergies.length} known Allergies! View Details</>
                                    ) : (
                                        <>No known allergies for this customer.</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pharmacist Processing</CardTitle>
                        <CardDescription>Complete the prescription details for approval or dispensing.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="patient_id_number">Patient ID Number</Label>
                                    <Input
                                        id="patient_id_number"
                                        type="text"
                                        value={data.patient_id_number}
                                        onChange={(e) => setData('patient_id_number', e.target.value)}
                                        required
                                    />
                                    {errors.patient_id_number && <p className="mt-1 text-sm text-red-500">{errors.patient_id_number}</p>}
                                </div>

                                {/* Customer Selection for Manual Prescriptions */}
                                {prescription.is_manual && customers && (
                                    <div className="space-y-2">
                                        <Label htmlFor="customer_id">Select Customer</Label>
                                        <Select
                                            value={data.customer_id}
                                            onValueChange={(value) => {
                                                setData('customer_id', value);
                                                // Auto-populate ID number when customer is selected
                                                const selectedCustomer = customers.find((c) => c.id.toString() === value);
                                                if (selectedCustomer?.id_number) {
                                                    setData('patient_id_number', selectedCustomer.id_number);
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Customer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {customers.map((customer) => (
                                                    <SelectItem key={customer.id} value={customer.id.toString()}>
                                                        {customer.full_name} ({customer.email})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.customer_id && <p className="mt-1 text-sm text-red-500">{errors.customer_id}</p>}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="doctor_id">Prescribing Doctor</Label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={data.doctor_id}
                                            onValueChange={(value) => setData('doctor_id', value)}
                                            disabled={doctors.length === 0}
                                        >
                                            <SelectTrigger className="flex-grow">
                                                <SelectValue placeholder="Select a Doctor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {doctors.length === 0 && (
                                                    <SelectItem value="" disabled>
                                                        No doctors available
                                                    </SelectItem>
                                                )}
                                                {doctors.map((doctor) => (
                                                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                                                        {doctor.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button type="button" onClick={openDoctorModal} size="sm" variant="outline" className="shrink-0">
                                            + Add Doctor
                                        </Button>
                                    </div>
                                    {errors.doctor_id && <p className="mt-1 text-sm text-red-500">{errors.doctor_id}</p>}
                                </div>

                                {/* --- ADDED THIS SECTION FOR NUMBER OF REPEATS --- */}
                                <div className="space-y-2">
                                    <Label htmlFor="repeats_total">Number of Repeats</Label>
                                    <Input
                                        id="repeats_total"
                                        type="number"
                                        value={data.repeats_total === null ? '' : data.repeats_total} // Handle null for empty display
                                        onChange={(e) => setData('repeats_total', e.target.value === '' ? null : parseInt(e.target.value, 10))}
                                        min="0" // Ensure non-negative repeats
                                    />
                                    {errors.repeats_total && <p className="mt-1 text-sm text-red-500">{errors.repeats_total}</p>}
                                </div>
                                {/* --- END ADDED SECTION --- */}
                            </div>

                            <div className="mt-8">
                                <h3 className="mb-4 text-lg font-semibold">Medication Items</h3>
                                {(data.items ?? []).map((item: PrescriptionItem, index: number) => (
                                    <div key={index} className="mb-4 grid grid-cols-12 items-end gap-4 border-b pb-4 last:border-b-0">
                                        <div className="col-span-12 sm:col-span-4">
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
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                                            />
                                        </div>

                                        <div className="col-span-12 sm:col-span-4">
                                            <Label>Instructions</Label>
                                            <Input
                                                value={item.instructions}
                                                onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                                                placeholder="e.g. Take twice daily after meals"
                                            />
                                        </div>

                                        <div className="col-span-12 sm:col-span-1">
                                            <Label>Price</Label>
                                            <div className="pt-2 font-semibold">R{calculateTotalPrice(item).toFixed(2)}</div>
                                        </div>

                                        <div className="col-span-12 flex items-end justify-end sm:col-span-1">
                                            <Button type="button" variant="destructive" onClick={() => removeItem(index)} className="h-8 px-2">
                                                Remove
                                            </Button>
                                        </div>

                                        {checkItemAllergy(item) && (
                                            <div className="col-span-12 mt-1 font-semibold text-red-600">
                                                ⚠️ Warning: This medication contains ingredients the customer is allergic to!
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" onClick={addItem}>
                                    + Add Medication Item
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Pharmacist Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Add any general notes or observations here..."
                                    rows={4}
                                />
                                {errors.notes && <p className="mt-1 text-sm text-red-500">{errors.notes}</p>}
                            </div>

                            <div className="mt-4 text-right text-lg font-semibold">Total Prescription Cost: R{totalPrescriptionCost.toFixed(2)}</div>

                            <div className="flex flex-col justify-end gap-2 pt-4 sm:flex-row">
                                <Button
                                    type="submit"
                                    onClick={() => setData('status', 'approved')}
                                    disabled={
                                        processing ||
                                        prescription.status === 'approved' ||
                                        prescription.status === 'dispensed' ||
                                        prescription.status === 'rejected'
                                    }
                                    className="w-full sm:w-auto"
                                >
                                    {processing && data.status === 'approved' ? 'Approving...' : 'Approve Prescription'}
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={() => setData('status', 'dispensed')}
                                    disabled={
                                        processing ||
                                        prescription.status === 'dispensed' ||
                                        prescription.status === 'pending' ||
                                        prescription.status === 'rejected'
                                    }
                                    className="w-full sm:w-auto"
                                >
                                    {processing && data.status === 'dispensed' ? 'Dispensing...' : 'Dispense Medication'}
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={() => setData('status', 'rejected')}
                                    disabled={processing || prescription.status === 'rejected' || prescription.status === 'dispensed'}
                                    variant="destructive"
                                    className="w-full sm:w-auto"
                                >
                                    {processing && data.status === 'rejected' ? 'Rejecting...' : 'Reject Prescription'}
                                </Button>
                                <Button asChild variant="outline" className="w-full sm:w-auto">
                                    <Link href={route('pharmacist.prescriptions.index')}>Back to Prescriptions</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {isDoctorModalOpen && (
                <Dialog open={isDoctorModalOpen} onOpenChange={setIsDoctorModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Doctor</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={submitDoctor} className="space-y-4">
                            <div>
                                <Label htmlFor="doctor_name_modal">First Name</Label>
                                <Input
                                    id="doctor_name_modal"
                                    value={doctorData.name}
                                    onChange={(e) => setDoctorData('name', e.target.value)}
                                    required
                                />
                                {doctorErrors.name && <p className="text-sm text-red-500">{doctorErrors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="doctor_surname_modal">Surname</Label>
                                <Input
                                    id="doctor_surname_modal"
                                    value={doctorData.surname}
                                    onChange={(e) => setDoctorData('surname', e.target.value)}
                                    required
                                />
                                {doctorErrors.surname && <p className="text-sm text-red-500">{doctorErrors.surname}</p>}
                            </div>
                            <div>
                                <Label htmlFor="doctor_email_modal">Email</Label>
                                <Input
                                    id="doctor_email_modal"
                                    type="email"
                                    value={doctorData.email}
                                    onChange={(e) => setDoctorData('email', e.target.value)}
                                    required
                                />
                                {doctorErrors.email && <p className="text-sm text-red-500">{doctorErrors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="doctor_phone_modal">Phone</Label>
                                <Input
                                    id="doctor_phone_modal"
                                    type="tel"
                                    value={doctorData.phone}
                                    onChange={(e) => setDoctorData('phone', e.target.value)}
                                    required
                                />
                                {doctorErrors.phone && <p className="text-sm text-red-500">{doctorErrors.phone}</p>}
                            </div>
                            <div>
                                <Label htmlFor="doctor_practice_number_modal">Practice Number</Label>
                                <Input
                                    id="doctor_practice_number_modal"
                                    value={doctorData.practice_number}
                                    onChange={(e) => setDoctorData('practice_number', e.target.value)}
                                    required
                                />
                                {doctorErrors.practice_number && <p className="text-sm text-red-500">{doctorErrors.practice_number}</p>}
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
            <CustomerAllergyModal
                isOpen={isAllergyModalOpen}
                onClose={() => setIsAllergyModalOpen(false)}
                allergies={customerAllergies}
                customerName={`${prescription.user?.name ?? 'Unknown'} ${prescription.user?.surname ?? ''}`}
            />
        </AppLayout>
    );
};

export default LoadPrescription;
