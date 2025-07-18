import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Doctor {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    practice_number: string;
}

interface Medication {
    id: number;
    name: string;
    current_sale_price: number;
    active_ingredients: number[];
}

interface Customer {
    id: number;
    name: string;
    surname: string;
    email: string;
    cellphone_number: string;
    id_number: string;
    full_name: string;
}

interface ActiveIngredient {
    id: number;
    name: string;
}

interface CreateManualPrescriptionProps {
    customers: Customer[];
    doctors: Doctor[];
    medications: Medication[];
    activeIngredients: ActiveIngredient[];
}

export default function CreateManualPrescription({ customers, doctors, medications, activeIngredients }: CreateManualPrescriptionProps) {
    const [showNewCustomer, setShowNewCustomer] = useState(false);
    const [showNewDoctor, setShowNewDoctor] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        new_customer: {
            name: '',
            surname: '',
            email: '',
            id_number: '',
            cellphone_number: '',
        },
        allergies_type: 'none',
        allergies: [],
        doctor_id: '',
        new_doctor: {
            name: '',
            surname: '',
            email: '',
            phone: '',
            practice_number: '',
        },
        prescription_name: '',
        delivery_method: 'pickup',
        repeats_total: 0,
        items: [{ medication_id: '', quantity: 1, instructions: '', price: 0 }],
        pharmacy_notes: '',
    });

    const handleCustomerSelect = (customerId: string) => {
        setData('customer_id', customerId);
        const customer = customers.find((c) => c.id.toString() === customerId);
        setSelectedCustomer(customer || null);
        setShowNewCustomer(false);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...(data.items as any[])];
        newItems[index] = { ...newItems[index], [field]: value };

        // Update price when medication or quantity changes
        if (field === 'medication_id' || field === 'quantity') {
            const medicationId = field === 'medication_id' ? value : newItems[index].medication_id;
            const quantity = field === 'quantity' ? value : newItems[index].quantity;

            if (medicationId) {
                const medication = medications.find((m) => m.id === parseInt(medicationId));
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
            const newItems = currentItems.filter((_, i) => i !== index);
            setData('items', newItems);
        }
    };

    const totalPrescriptionCost = (data.items as any[]).reduce((acc, item) => acc + (item.price || 0), 0);

    const handleAllergyToggle = (ingredientId: number) => {
        const currentAllergies = data.allergies as number[];
        const newAllergies = currentAllergies.includes(ingredientId)
            ? currentAllergies.filter((id) => id !== ingredientId)
            : [...currentAllergies, ingredientId];
        setData('allergies', newAllergies);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pharmacist.prescriptions.storeManual'), {
            onSuccess: () => {
                toast.success('Manual prescription created successfully!');
            },
            onError: (errors) => {
                console.error('Error creating prescription:', errors);
                toast.error('Failed to create prescription. Please check for errors.');
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
                            {!showNewCustomer ? (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Label htmlFor="customer_select">Select Customer</Label>
                                            <Select onValueChange={handleCustomerSelect}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose a customer..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {customers.map((customer) => (
                                                        <SelectItem key={customer.id} value={customer.id.toString()}>
                                                            {customer.full_name} - {customer.email}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button type="button" variant="outline" onClick={() => setShowNewCustomer(true)} className="mt-6">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add New Customer
                                        </Button>
                                    </div>

                                    {selectedCustomer && (
                                        <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                                            <div>
                                                <Label>ID Number</Label>
                                                <p className="text-sm text-gray-600">{selectedCustomer.id_number}</p>
                                            </div>
                                            <div>
                                                <Label>Email</Label>
                                                <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                                            </div>
                                            <div>
                                                <Label>First Name</Label>
                                                <p className="text-sm text-gray-600">{selectedCustomer.name}</p>
                                            </div>
                                            <div>
                                                <Label>Last Name</Label>
                                                <p className="text-sm text-gray-600">{selectedCustomer.surname}</p>
                                            </div>
                                            <div>
                                                <Label>Cell Number</Label>
                                                <p className="text-sm text-gray-600">{selectedCustomer.cellphone_number}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-medium">Add New Customer</Label>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewCustomer(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>First Name</Label>
                                            <Input
                                                value={data.new_customer.name}
                                                onChange={(e) =>
                                                    setData('new_customer', {
                                                        ...data.new_customer,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Last Name</Label>
                                            <Input
                                                value={data.new_customer.surname}
                                                onChange={(e) =>
                                                    setData('new_customer', {
                                                        ...data.new_customer,
                                                        surname: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <Input
                                                type="email"
                                                value={data.new_customer.email}
                                                onChange={(e) =>
                                                    setData('new_customer', {
                                                        ...data.new_customer,
                                                        email: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>ID Number</Label>
                                            <Input
                                                value={data.new_customer.id_number}
                                                onChange={(e) =>
                                                    setData('new_customer', {
                                                        ...data.new_customer,
                                                        id_number: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Label>Cell Phone Number</Label>
                                            <Input
                                                value={data.new_customer.cellphone_number}
                                                onChange={(e) =>
                                                    setData('new_customer', {
                                                        ...data.new_customer,
                                                        cellphone_number: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                            {activeIngredients.map((ingredient) => (
                                                <div key={ingredient.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`allergy_${ingredient.id}`}
                                                        checked={(data.allergies as number[]).includes(ingredient.id)}
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
                            {!showNewDoctor ? (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Label>Select Doctor</Label>
                                            <Select
                                                onValueChange={(value) => {
                                                    setData('doctor_id', value);
                                                    setShowNewDoctor(false);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose a doctor..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {doctors.map((doctor) => (
                                                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                                                            Dr. {doctor.name} {doctor.surname} - {doctor.practice_number}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button type="button" variant="outline" onClick={() => setShowNewDoctor(true)} className="mt-6">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add New Doctor
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-medium">Add New Doctor</Label>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewDoctor(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>First Name</Label>
                                            <Input
                                                value={data.new_doctor.name}
                                                onChange={(e) =>
                                                    setData('new_doctor', {
                                                        ...data.new_doctor,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Last Name</Label>
                                            <Input
                                                value={data.new_doctor.surname}
                                                onChange={(e) =>
                                                    setData('new_doctor', {
                                                        ...data.new_doctor,
                                                        surname: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <Input
                                                type="email"
                                                value={data.new_doctor.email}
                                                onChange={(e) =>
                                                    setData('new_doctor', {
                                                        ...data.new_doctor,
                                                        email: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Phone</Label>
                                            <Input
                                                value={data.new_doctor.phone}
                                                onChange={(e) =>
                                                    setData('new_doctor', {
                                                        ...data.new_doctor,
                                                        phone: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Label>Practice Number</Label>
                                            <Input
                                                value={data.new_doctor.practice_number}
                                                onChange={(e) =>
                                                    setData('new_doctor', {
                                                        ...data.new_doctor,
                                                        practice_number: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
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
                            {(data.items as any[]).map((item, index) => (
                                <div key={index} className="grid grid-cols-12 items-end gap-4 rounded-lg border p-4">
                                    <div className="col-span-4">
                                        <Label>Medication</Label>
                                        <Select onValueChange={(value) => updateItem(index, 'medication_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select medication..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {medications.map((medication) => (
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
        </AppLayout>
    );
}
