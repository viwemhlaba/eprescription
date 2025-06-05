import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Medication {
    id: number;
    name: string;
    current_sale_price: number;
}

interface PrescriptionItem {
    id: number;
    medication: Medication;
    quantity: number;
    instructions: string;
}

interface Doctor {
    id: number;
    name: string;
}

interface Prescription {
    id: number;
    customer_name: string;
    prescription_name: string;
    delivery_method: string;
    upload_date: string;
    doctor: Doctor;
    items: PrescriptionItem[];
}

interface Props {
    prescription: Prescription;
}

export default function Show({ prescription }: Props) {
    const total = prescription.items.reduce((sum, item) => sum + item.medication.current_sale_price * item.quantity, 0);

    return (
        <AppLayout>
            <Head title="View Prescription" />
            <div className="mx-auto max-w-4xl rounded-lg p-6 text-gray-100 shadow-lg">
                <Heading title="Prescription Overview" description="Detailed view of prescription" className="mb-6" />

                <Card className="mb-6 border-gray-700">
                    <CardHeader>
                        <CardTitle>Patient & Prescription Info</CardTitle>
                        <CardDescription>Overview of customer, doctor, delivery method, and upload date.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                            <div>
                                <span className="font-semibold">Customer: </span>
                                <span>{prescription.customer_name}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Doctor: </span>
                                <span>{prescription.doctor?.name || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Delivery Method: </span>
                                <span className="capitalize">{prescription.delivery_method}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Upload Date: </span>
                                <span>{new Date(prescription.upload_date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-700">
                    <CardHeader>
                        <CardTitle>Prescription Items</CardTitle>
                        <CardDescription>Medications and instructions</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-gray-700 text-gray-300">
                                <TableRow>
                                    <TableHead className="w-[40%]">Medication</TableHead>
                                    <TableHead className="w-[35%]">Instructions</TableHead>
                                    <TableHead className="w-[10%] text-right">Quantity</TableHead>
                                    <TableHead className="w-[10%] text-right">Unit Price (R)</TableHead>
                                    <TableHead className="w-[10%] text-right">Total (R)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prescription.items.map((item) => (
                                    <TableRow key={item.id} className="even:bg-gray-900">
                                        <TableCell>{item.medication.name}</TableCell>
                                        <TableCell>{item.instructions || '-'}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">{item.medication.current_sale_price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            {(item.quantity * item.medication.current_sale_price).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <tfoot>
                                <TableRow className="border-t border-gray-700 font-semibold">
                                    <TableCell colSpan={4} className="pr-4 text-right">
                                        Total:
                                    </TableCell>
                                    <TableCell className="text-right">R{total.toFixed(2)}</TableCell>
                                </TableRow>
                            </tfoot>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
