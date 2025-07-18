import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateManualPrescriptionProps {
    customers: any[];
    doctors: any[];
    medications: any[];
    activeIngredients: any[];
}

export default function CreateManualPrescription({ customers, doctors, medications, activeIngredients }: CreateManualPrescriptionProps) {
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

    const { data, setData, post, processing } = useForm({
        customer_id: '',
        allergies_type: 'none',
        allergies: [],
        doctor_id: '',
        prescription_name: '',
        delivery_method: 'pickup',
        repeats_total: 0,
        items: [{ medication_id: '', quantity: 1, instructions: '', price: 0 }],
        pharmacy_notes: '',
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

    const handleCustomerSelect = (customerId: string) => {
        setData('customer_id', customerId);
        const customer = customers.find((c: any) => c.id.toString() === customerId);
        setSelectedCustomer(customer || null);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...(data.items as any[])];
        newItems[index] = { ...newItems[index], [field]: value };

        // Update price when medication or quantity changes
        if (field === 'medication_id' || field === 'quantity') {
            const medicationId = field === 'medication_id' ? value : newItems[index].medication_id;
            const quantity = field === 'quantity' ? value : newItems[index].quantity;

            if (medicationId) {
                const medication = medications.find((m: any) => m.id === parseInt(medicationId));
                if (medication) {
                    newItems[index].price = quantity * medication.current_sale_price;
                }
            }
        }

        setData('items', newItems);
    };

    const addItem = () => {
        const currentItems = data.items as any[];
        setData('items', [...currentItems, { medication_id: '', quantity: 1, instructions: '', price: 0 }]);
    };

    const removeItem = (index: number) => {
        const currentItems = data.items as any[];
        if (currentItems.length > 1) {
            const newItems = currentItems.filter((_: any, i: number) => i !== index);
            setData('items', newItems);
        }
    };

    const totalPrescriptionCost = (data.items as any[]).reduce((acc: number, item: any) => acc + (item.price || 0), 0);

    const handleAllergyToggle = (ingredientId: number) => {
        const currentAllergies = data.allergies as any[];
        const newAllergies = currentAllergies.includes(ingredientId)
            ? currentAllergies.filter((id: number) => id !== ingredientId)
            : [...currentAllergies, ingredientId];
        setData('allergies', newAllergies);
    };

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
                toast.success('Doctor added successfully!');
                // Reload the page to refresh the doctors list
                window.location.reload();
            },
            onError: (err) => {
                console.error('Failed to add doctor:', err);
                toast.error('Failed to add doctor. Please try again.');
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation before sending
        if (!data.customer_id) {
            toast.error('Please select a customer.');
            return;
        }

        if (!data.doctor_id) {
            toast.error('Please select a doctor.');
            return;
        }

        if (!data.prescription_name.trim()) {
            toast.error('Please enter a prescription name.');
            return;
        }

        // Check if at least one medication is selected
        const validItems = (data.items as any[]).filter((item) => item.medication_id && item.medication_id !== '');
        if (validItems.length === 0) {
            toast.error('Please select at least one medication.');
            return;
        }

        // Update the form data with valid items before submitting
        setData('items', validItems);

        post(route('pharmacist.prescriptions.storeManual'), {
            onSuccess: () => {
                toast.success('Manual prescription created successfully!');
            },
            onError: (errors: any) => {
                console.error('Error creating prescription:', errors);
                const errorMessage = errors.error || 'Failed to create prescription. Please check for errors.';
                toast.error(errorMessage);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Manual Prescription" />

            <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <Heading title="Create Manual Prescription" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                            <CardDescription>Select an existing customer or add a new one</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Label htmlFor="customer_select">Select Customer</Label>
                                        <Select onValueChange={handleCustomerSelect}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a customer..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {customers.map((customer: any) => (
                                                    <SelectItem key={customer.id} value={customer.id.toString()}>
                                                        {customer.full_name} - {customer.email}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Link href={route('pharmacist.customers.create')}>
                                        <Button type="button" variant="outline" className="mt-6">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add New Customer
                                        </Button>
                                    </Link>
                                </div>

                                {selectedCustomer && (
                                    <div className="grid grid-cols-2 gap-4 rounded-lg border border-green-200 bg-green-50 p-4">
                                        <div>
                                            <Label className="font-medium text-green-800">ID Number</Label>
                                            <p className="text-sm text-green-700">{selectedCustomer.id_number}</p>
                                        </div>
                                        <div>
                                            <Label className="font-medium text-green-800">Email</Label>
                                            <p className="text-sm text-green-700">{selectedCustomer.email}</p>
                                        </div>
                                        <div>
                                            <Label className="font-medium text-green-800">First Name</Label>
                                            <p className="text-sm text-green-700">{selectedCustomer.name}</p>
                                        </div>
                                        <div>
                                            <Label className="font-medium text-green-800">Last Name</Label>
                                            <p className="text-sm text-green-700">{selectedCustomer.surname}</p>
                                        </div>
                                        <div>
                                            <Label className="font-medium text-green-800">Cell Number</Label>
                                            <p className="text-sm text-green-700">{selectedCustomer.cellphone_number}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Allergies */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Allergies</CardTitle>
                            <CardDescription>Select customer allergy information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <Label>Does the customer have any known allergies?</Label>
                                <div className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="allergies_none"
                                            name="allergies_type"
                                            value="none"
                                            checked={data.allergies_type === 'none'}
                                            onChange={() => {
                                                setData('allergies_type', 'none');
                                                setData('allergies', []);
                                            }}
                                        />
                                        <Label htmlFor="allergies_none">No allergies</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="allergies_known"
                                            name="allergies_type"
                                            value="known"
                                            checked={data.allergies_type === 'known'}
                                            onChange={() => setData('allergies_type', 'known')}
                                        />
                                        <Label htmlFor="allergies_known">Yes, known allergies</Label>
                                    </div>
                                </div>

                                {data.allergies_type === 'known' && (
                                    <div className="space-y-2">
                                        <Label>Select allergens:</Label>
                                        <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto">
                                            {activeIngredients.map((ingredient: any) => (
                                                <div key={ingredient.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`allergy_${ingredient.id}`}
                                                        checked={(data.allergies as any[]).includes(ingredient.id)}
                                                        onCheckedChange={() => handleAllergyToggle(ingredient.id)}
                                                    />
                                                    <Label htmlFor={`allergy_${ingredient.id}`} className="text-sm">
                                                        {ingredient.name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Doctor Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Prescribing Doctor</CardTitle>
                            <CardDescription>Select an existing doctor or add a new one</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Label>Select Doctor</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                setData('doctor_id', value);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a doctor..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {doctors.map((doctor: any) => (
                                                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                                                        Dr. {doctor.name} {doctor.surname} - {doctor.practice_number}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="button" variant="outline" className="mt-6" onClick={openDoctorModal}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New Doctor
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Prescription Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Prescription Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Prescription Name</Label>
                                    <Input
                                        value={data.prescription_name}
                                        onChange={(e) => setData('prescription_name', e.target.value)}
                                        placeholder="e.g., Monthly Medication"
                                    />
                                </div>
                                <div>
                                    <Label>Number of Repeats</Label>
                                    <Select onValueChange={(value) => setData('repeats_total', parseInt(value))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select repeats..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[0, 1, 2, 3, 4, 5].map((num) => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num} {num === 1 ? 'repeat' : 'repeats'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medication Information</CardTitle>
                            <CardDescription>Add medications to this prescription</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(data.items as any[]).map((item: any, index: number) => (
                                <div key={index} className="grid grid-cols-12 items-end gap-4 rounded-lg border p-4">
                                    <div className="col-span-4">
                                        <Label>Medication</Label>
                                        <Select onValueChange={(value) => updateItem(index, 'medication_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select medication..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {medications.map((medication: any) => (
                                                    <SelectItem key={medication.id} value={medication.id.toString()}>
                                                        {medication.name} - R{medication.current_sale_price}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Quantity</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Label>Instructions</Label>
                                        <Input
                                            value={item.instructions}
                                            onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                                            placeholder="e.g., Take twice daily"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Price</Label>
                                        <p className="text-sm font-medium">R{(item.price || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="col-span-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeItem(index)}
                                            disabled={(data.items as any[]).length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center justify-between">
                                <Button type="button" variant="outline" onClick={addItem}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Medication
                                </Button>
                                <div className="text-right">
                                    <p className="text-lg font-semibold">Total: R{totalPrescriptionCost.toFixed(2)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pharmacy Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pharmacy Notes</CardTitle>
                            <CardDescription>Any additional notes or instructions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={data.pharmacy_notes}
                                onChange={(e) => setData('pharmacy_notes', e.target.value)}
                                placeholder="Enter any pharmacy notes or special instructions..."
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <Link href={route('pharmacist.prescriptions.index')}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Approve Prescription'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Add New Doctor Modal */}
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
                                    {doctorProcessing ? 'Adding...' : 'Add Doctor'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    );
}
