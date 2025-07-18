import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Download, FileText, Mail, MapPin, Package, Phone, Pill, User } from 'lucide-react';

interface Patient {
    id: number;
    name: string;
    surname: string;
    email: string;
    id_number: string;
    cellphone_number: string;
    full_address: string;
    allergies: string;
}

interface Doctor {
    id: number;
    name: string;
    email: string;
    phone: string;
    practice_number: string;
    specialization: string;
}

interface PrescriptionItem {
    id: number;
    medication_name: string;
    quantity: number;
    instructions: string;
    price: number;
    repeats: number;
    repeats_used: number;
    active_ingredients: string;
}

interface DispensedHistoryItem {
    id: number;
    medication_name: string;
    quantity_dispensed: number;
    cost: number;
    dispensed_date: string;
    dispensed_time: string;
    pharmacist_name: string;
    pharmacy_name: string;
    notes: string;
}

interface Pharmacy {
    name: string;
    address: string;
    phone: string;
    email: string;
    registration_number: string;
}

interface CurrentPharmacist {
    name: string;
    registration_number: string;
    pharmacy: Pharmacy | null;
}

interface Prescription {
    id: number;
    name: string;
    status: string;
    delivery_method: string;
    repeats_total: number;
    repeats_used: number;
    next_repeat_date: string | null;
    created_at: string;
    updated_at: string;
    is_manual: boolean;
    notes: string | null;
    file_path: string | null;
    patient: Patient;
    doctor: Doctor;
    items: PrescriptionItem[];
}

interface Totals {
    total_cost: number;
    total_items_dispensed: number;
    prescription_total_value: number;
}

interface Props {
    prescription: Prescription;
    dispensed_history: DispensedHistoryItem[];
    totals: Totals;
    current_pharmacist: CurrentPharmacist | null;
}

export default function Show({ prescription, dispensed_history, totals, current_pharmacist }: Props) {
    const handleDownload = () => {
        // Create a route for downloading the prescription as PDF
        window.open(route('pharmacist.prescriptions.download', prescription.id), '_blank');
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'secondary',
            approved: 'default',
            dispensed: 'success',
            rejected: 'destructive',
        } as const;

        return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    };

    return (
        <AppLayout>
            <Head title={`Prescription #${prescription.id}`} />
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('pharmacist.prescriptions.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Prescriptions
                            </Link>
                        </Button>
                        <div>
                            <Heading title={`Prescription #${prescription.id}`} description={`${prescription.name} - ${prescription.patient.name}`} />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {getStatusBadge(prescription.status)}
                        <Button onClick={handleDownload} className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Patient & Doctor Info */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* Patient Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Patient Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="text-base">
                                        {prescription.patient.name} {prescription.patient.surname}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">ID Number</p>
                                    <p className="text-base">{prescription.patient.id_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Contact</p>
                                    <p className="flex items-center gap-1 text-sm">
                                        <Phone className="h-3 w-3" />
                                        {prescription.patient.cellphone_number}
                                    </p>
                                    <p className="flex items-center gap-1 text-sm">
                                        <Mail className="h-3 w-3" />
                                        {prescription.patient.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="flex items-start gap-1 text-sm">
                                        <MapPin className="mt-1 h-3 w-3 flex-shrink-0" />
                                        {prescription.patient.full_address}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Allergies</p>
                                    <p className="text-sm">{prescription.patient.allergies}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Doctor Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Prescribing Doctor
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Name</p>
                                    <p className="text-base">{prescription.doctor.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Practice Number</p>
                                    <p className="text-base">{prescription.doctor.practice_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Specialization</p>
                                    <p className="text-base">{prescription.doctor.specialization}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Contact</p>
                                    <p className="flex items-center gap-1 text-sm">
                                        <Phone className="h-3 w-3" />
                                        {prescription.doctor.phone}
                                    </p>
                                    <p className="flex items-center gap-1 text-sm">
                                        <Mail className="h-3 w-3" />
                                        {prescription.doctor.email}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pharmacy Information */}
                        {current_pharmacist?.pharmacy && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Dispensing Pharmacy
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Pharmacy Name</p>
                                        <p className="text-base">{current_pharmacist.pharmacy.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Registration Number</p>
                                        <p className="text-base">{current_pharmacist.pharmacy.registration_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Address</p>
                                        <p className="text-sm">{current_pharmacist.pharmacy.address}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Contact</p>
                                        <p className="flex items-center gap-1 text-sm">
                                            <Phone className="h-3 w-3" />
                                            {current_pharmacist.pharmacy.phone}
                                        </p>
                                        <p className="flex items-center gap-1 text-sm">
                                            <Mail className="h-3 w-3" />
                                            {current_pharmacist.pharmacy.email}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Prescription Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Prescription Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Prescription Details</CardTitle>
                                <CardDescription>Overview and status information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-medium text-gray-500">Prescription Name</p>
                                        <p>{prescription.name}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500">Status</p>
                                        <div className="mt-1">{getStatusBadge(prescription.status)}</div>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500">Delivery Method</p>
                                        <p className="capitalize">{prescription.delivery_method}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500">Type</p>
                                        <p>{prescription.is_manual ? 'Manual Entry' : 'Uploaded'}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500">Repeats</p>
                                        <p>
                                            {prescription.repeats_used} of {prescription.repeats_total} used
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500">Created Date</p>
                                        <p className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(prescription.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {prescription.next_repeat_date && (
                                        <div className="col-span-2">
                                            <p className="font-medium text-gray-500">Next Repeat Available</p>
                                            <p>{new Date(prescription.next_repeat_date).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                    {prescription.notes && (
                                        <div className="col-span-2">
                                            <p className="font-medium text-gray-500">Notes</p>
                                            <p>{prescription.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Prescribed Medications */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Pill className="h-5 w-5" />
                                    Prescribed Medications
                                </CardTitle>
                                <CardDescription>Medications and dosage instructions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Medication</TableHead>
                                            <TableHead>Active Ingredients</TableHead>
                                            <TableHead>Instructions</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead className="text-right">Repeats</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {prescription.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.medication_name}</TableCell>
                                                <TableCell className="text-sm text-gray-600">{item.active_ingredients || 'N/A'}</TableCell>
                                                <TableCell>{item.instructions || '-'}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right">
                                                    {item.repeats_used}/{item.repeats}
                                                </TableCell>
                                                <TableCell className="text-right">R{(Number(item.price) || 0).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Separator className="my-4" />
                                <div className="flex items-center justify-between font-semibold">
                                    <span>Total Prescription Value:</span>
                                    <span>R{(Number(totals.prescription_total_value) || 0).toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dispensing History */}
                        {dispensed_history.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dispensing History</CardTitle>
                                    <CardDescription>Record of all dispensed medications</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date & Time</TableHead>
                                                <TableHead>Medication</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Pharmacist</TableHead>
                                                <TableHead>Pharmacy</TableHead>
                                                <TableHead className="text-right">Cost</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {dispensed_history.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{item.dispensed_date}</div>
                                                            <div className="text-sm text-gray-500">{item.dispensed_time}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{item.medication_name}</TableCell>
                                                    <TableCell>{item.quantity_dispensed}</TableCell>
                                                    <TableCell>{item.pharmacist_name}</TableCell>
                                                    <TableCell>{item.pharmacy_name}</TableCell>
                                                    <TableCell className="text-right">R{(Number(item.cost) || 0).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Separator className="my-4" />
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex justify-between">
                                            <span>Total Items Dispensed:</span>
                                            <span className="font-semibold">{totals.total_items_dispensed}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Amount Paid:</span>
                                            <span className="font-semibold">R{(Number(totals.total_cost) || 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
