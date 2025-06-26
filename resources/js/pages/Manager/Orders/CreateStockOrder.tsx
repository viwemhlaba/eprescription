import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface Medication {
    id: number;
    name: string;
    schedule: string;
    quantity_on_hand: number;
    reorder_level: number;
}

interface MedicationToReorder extends Medication {
    supplier: {
        name: string;
    };
}

export default function CreateStockOrder({ medicationsToReorder }: PageProps<{ medicationsToReorder: { [key: string]: MedicationToReorder[] } }>) {
    const [selectedMedications, setSelectedMedications] = useState<{ [key: number]: number }>({});
    const { post, processing } = useForm();

    const handleCheckboxChange = (medicationId: number) => {
        setSelectedMedications((prev) => {
            const newSelected = { ...prev };
            if (newSelected[medicationId]) {
                delete newSelected[medicationId];
            } else {
                newSelected[medicationId] = 0;
            }
            return newSelected;
        });
    };

    const handleQuantityChange = (medicationId: number, quantity: number) => {
        setSelectedMedications((prev) => ({
            ...prev,
            [medicationId]: quantity,
        }));
    };

    const getSupplierTotal = (supplierName: string) => {
        return medicationsToReorder[supplierName].reduce((total, medication) => {
            return total + (selectedMedications[medication.id] || 0);
        }, 0);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const medicationsToSubmit = Object.entries(selectedMedications)
            .filter(([_, quantity]) => quantity > 0)
            .map(([id, quantity]) => ({ id: parseInt(id, 10), quantity }));

        if (medicationsToSubmit.length === 0) {
            toast.error('Please select at least one medication and set a quantity greater than 0.');
            return;
        }
        const data = {
            medications: medicationsToSubmit,
        };

        post(route('manager.orders.store'), data, {
            onSuccess: () => {
                toast.success('Stock order created successfully!');
            },
            onError: () => {
                toast.error('Failed to create stock order. Please try again.');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Stock Order" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Link href={route('manager.orders.index')}>
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Heading level="h1" size="xl">
                                Create Stock Order
                            </Heading>
                        </div>
                    </div>

                    <Separator />

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {Object.entries(medicationsToReorder).map(([supplierName, medications]) => (
                            <div key={supplierName} className="space-y-4">
                                <div className="bg-card rounded-lg border">
                                    <div className="bg-muted/25 border-b px-6 py-4">
                                        <h3 className="text-lg font-semibold">{supplierName}</h3>
                                    </div>
                                    <div className="overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-muted/25">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-sm font-medium">Select</th>
                                                    <th className="px-6 py-3 text-left text-sm font-medium">Medication</th>
                                                    <th className="px-6 py-3 text-left text-sm font-medium">Schedule</th>
                                                    <th className="px-6 py-3 text-left text-sm font-medium">Current Stock</th>
                                                    <th className="px-6 py-3 text-left text-sm font-medium">Reorder Level</th>
                                                    <th className="px-6 py-3 text-left text-sm font-medium">Order Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {medications.map((medication) => (
                                                    <tr key={medication.id} className="hover:bg-muted/25">
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={medication.id in selectedMedications}
                                                                onChange={() => handleCheckboxChange(medication.id)}
                                                                className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium">{medication.name}</td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                                                {medication.schedule}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">{medication.quantity_on_hand}</td>
                                                        <td className="px-6 py-4 text-sm">{medication.reorder_level}</td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                disabled={!selectedMedications[medication.id]}
                                                                onChange={(e) =>
                                                                    handleQuantityChange(medication.id, parseInt(e.target.value, 10) || 0)
                                                                }
                                                                value={selectedMedications[medication.id] || ''}
                                                                className="border-input bg-background focus:border-primary focus:ring-primary w-24 rounded-md border px-3 py-1 text-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                                placeholder="0"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-muted/25 border-t">
                                                    <td colSpan={5} className="px-6 py-3 text-right text-sm font-semibold">
                                                        Total Items:
                                                    </td>
                                                    <td className="px-6 py-3 text-sm font-semibold">{getSupplierTotal(supplierName)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-end space-x-3">
                            <Link href={route('manager.orders.index')}>
                                <Button variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={processing || Object.keys(selectedMedications).length === 0}>
                                {processing ? 'Creating Order...' : 'Create Stock Order'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
