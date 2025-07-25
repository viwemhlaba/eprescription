import Heading from '@/components/heading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertTriangle, FileText, Pill, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Medication {
    id: number;
    name: string;
    current_sale_price: number | string;
    quantity_on_hand: number;
    active_ingredients: number[];
}

interface PrescriptionItem {
    id: number;
    medication_id: number;
    medication: Medication;
    quantity: number;
    instructions: string;
    repeats_remaining: number;
}

interface Doctor {
    id: number;
    name: string;
    surname: string;
}

interface CustomerAllergy {
    id: number;
    active_ingredient_id: number;
    active_ingredient_name: string;
}

interface Prescription {
    id: number;
    name: string;
    status: string;
    patient_id_number: string;
    file_path: string;
    repeats_total: number;
    repeats_used: number;
    next_repeat_date: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        surname: string;
        email: string;
    };
    doctor: Doctor;
    items: PrescriptionItem[];
}

interface Props {
    prescription: Prescription;
    customerAllergies: CustomerAllergy[];
}

export default function DispenseShow({ prescription, customerAllergies }: Props) {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const { data, setData, processing, errors } = useForm({
        prescription_id: prescription.id,
        items: [] as Array<{ item_id: number; quantity: number }>,
        notes: '',
    });

    const checkItemAllergy = (item: PrescriptionItem) => {
        if (!item.medication?.active_ingredients) return false;
        return item.medication.active_ingredients.some((ingredientId) =>
            customerAllergies.some((allergy) => allergy.active_ingredient_id === ingredientId),
        );
    };

    const canDispenseItem = (item: PrescriptionItem) => {
        const hasAllergy = checkItemAllergy(item);
        const hasRepeats = item.repeats_remaining > 0;
        const hasStock = item.medication.quantity_on_hand >= item.quantity; // Use original quantity

        return !hasAllergy && hasRepeats && hasStock;
    };

    const toggleItemSelection = (itemId: number) => {
        setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
    };

    const getTotalCost = () => {
        return prescription.items
            .filter((item) => selectedItems.includes(item.id))
            .reduce((total, item) => {
                const price = Number(item.medication.current_sale_price) || 0;
                return total + price * item.quantity; // Use original quantity
            }, 0);
    };
    const handleDispense = () => {
        if (selectedItems.length === 0) {
            toast.error('Please select at least one item to dispense.');
            return;
        }

        const itemsToDispense = selectedItems.map((itemId) => ({
            item_id: itemId,
            quantity: prescription.items.find((i) => i.id === itemId)?.quantity || 1, // Use original quantity
        }));

        const formData = {
            prescription_id: prescription.id,
            items: itemsToDispense,
            notes: data.notes,
        };

        router.post(route('pharmacist.prescriptions.dispense.store'), formData, {
            onSuccess: () => {
                toast.success('Prescription dispensed successfully!');
            },
            onError: (errors: Record<string, string>) => {
                console.error('Dispense errors:', errors);
                toast.error('Failed to dispense prescription. Please check for errors.');
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Dispense Prescription ${prescription.id}`} />

            <div className="mx-auto max-w-6xl p-4">
                <div className="mb-6">
                    <Heading
                        title={`Dispense Prescription #${prescription.id}`}
                        description="Review prescription details and select items to dispense"
                    />
                    <div className="mt-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('pharmacist.prescriptions.dispense')}>← Back to Dispense List</Link>
                        </Button>
                    </div>
                </div>

                {/* Patient & Prescription Info */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Patient & Prescription Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <Label className="text-muted-foreground text-sm font-medium">Patient Name</Label>
                                <p className="text-lg font-semibold">
                                    {prescription.user.name} {prescription.user.surname}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm font-medium">Patient ID</Label>
                                <p className="text-lg">{prescription.patient_id_number}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm font-medium">Doctor</Label>
                                <p className="text-lg">
                                    {prescription.doctor.name} {prescription.doctor.surname}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm font-medium">Prescription Name</Label>
                                <p className="text-lg">{prescription.name}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm font-medium">Date Created</Label>
                                <p className="text-lg">{new Date(prescription.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm font-medium">Repeats</Label>
                                <p className="text-lg">
                                    {prescription.repeats_used} of {prescription.repeats_total} used
                                </p>
                            </div>
                        </div>

                        {prescription.file_path && (
                            <div className="bg-muted mt-4 rounded-lg p-3">
                                <Label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                    <FileText className="h-4 w-4" />
                                    Prescription File
                                </Label>
                                <Button variant="link" className="h-auto p-0" asChild>
                                    <a href={`/storage/${prescription.file_path}`} target="_blank" rel="noopener noreferrer">
                                        View Uploaded PDF
                                    </a>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Allergy Warning */}
                {customerAllergies.length > 0 && (
                    <Alert className="mb-6">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Patient has {customerAllergies.length} known allergies:</strong>
                            <div className="mt-1">
                                {customerAllergies.map((allergy) => (
                                    <Badge key={allergy.id} variant="outline" className="mr-1 mb-1">
                                        {allergy.active_ingredient_name}
                                    </Badge>
                                ))}
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Medication Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Pill className="h-5 w-5" />
                            Prescribed Medications
                        </CardTitle>
                        <CardDescription>
                            Select the items you want to dispense. Only items with remaining repeats and sufficient stock can be dispensed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">Dispense</TableHead>
                                        <TableHead>Medication</TableHead>
                                        <TableHead>Instructions</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Repeats Left</TableHead>
                                        <TableHead>Stock Available</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prescription.items.map((item) => {
                                        const hasAllergy = checkItemAllergy(item);
                                        const canDispense = canDispenseItem(item);
                                        const quantity = item.quantity; // Use original quantity only
                                        const price = Number(item.medication.current_sale_price) || 0;
                                        const totalPrice = price * quantity;

                                        return (
                                            <TableRow key={item.id} className={hasAllergy ? 'bg-red-50' : ''}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedItems.includes(item.id)}
                                                        onCheckedChange={() => toggleItemSelection(item.id)}
                                                        disabled={!canDispense}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{item.medication.name}</div>
                                                    {hasAllergy && (
                                                        <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            Contains allergen
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>{item.instructions || 'No instructions'}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center">
                                                        <span className="font-medium">{item.quantity}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={item.repeats_remaining > 0 ? 'default' : 'destructive'}>
                                                        {item.repeats_remaining}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={item.medication.quantity_on_hand >= quantity ? 'default' : 'destructive'}>
                                                        {item.medication.quantity_on_hand}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>R{price.toFixed(2)}</TableCell>
                                                <TableCell>R{totalPrice.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    {hasAllergy && <Badge variant="destructive">Allergic</Badge>}
                                                    {!hasAllergy && item.repeats_remaining === 0 && <Badge variant="secondary">No Repeats</Badge>}
                                                    {!hasAllergy && item.repeats_remaining > 0 && item.medication.quantity_on_hand < quantity && (
                                                        <Badge variant="destructive">Low Stock</Badge>
                                                    )}
                                                    {canDispense && <Badge variant="default">Ready</Badge>}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Summary */}
                        <div className="bg-muted mt-6 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm">Selected Items: {selectedItems.length}</p>
                                    <p className="text-lg font-semibold">Total Cost: R{getTotalCost().toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mt-6">
                            <Label htmlFor="notes">Dispensing Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add any notes about the dispensing process..."
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="mt-2"
                            />
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-4">
                            <Button onClick={handleDispense} disabled={processing || selectedItems.length === 0} size="lg">
                                {processing ? 'Dispensing...' : `Dispense Selected Items (${selectedItems.length})`}
                            </Button>

                            <Button variant="outline" size="lg" asChild>
                                <Link href={route('pharmacist.prescriptions.dispense')}>Cancel</Link>
                            </Button>
                        </div>

                        {errors && Object.keys(errors).length > 0 && (
                            <Alert className="mt-4 border-red-200 bg-red-50">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    <strong>Please fix the following errors:</strong>
                                    <ul className="mt-2 list-inside list-disc">
                                        {Object.entries(errors).map(([key, error]) => (
                                            <li key={key}>{error}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
