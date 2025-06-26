import AddStockModal from '@/components/Manager/Medications/AddStockModal';
import SetStockModal from '@/components/Manager/Medications/SetStockModal';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';

interface Medication {
    id: number;
    name: string;
    schedule: string;
    quantity_on_hand: number;
    reorder_level: number;
}

interface StockManagementPageProps extends PageProps {
    medications: Medication[];
}

const StockManagement: React.FC<StockManagementPageProps> = ({ medications }) => {
    const [showLowStock, setShowLowStock] = useState(false);

    const filteredMedications = showLowStock
        ? medications.filter((medication) => medication.quantity_on_hand <= medication.reorder_level)
        : medications;

    return (
        <AppLayout>
            <Head title="Stock Management" />
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <Heading title="Stock Management" description="Manage medication stock levels." />
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Medication Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center">
                            <Checkbox
                                id="low-stock-filter"
                                checked={showLowStock}
                                onCheckedChange={(checked) => setShowLowStock(Boolean(checked))}
                                className="mr-2"
                            />
                            <label
                                htmlFor="low-stock-filter"
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Show only low stock items
                            </label>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Schedule</TableHead>
                                    <TableHead>Quantity on Hand</TableHead>
                                    <TableHead>Reorder Level</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMedications.map((medication) => {
                                    const isLowStock = medication.quantity_on_hand <= medication.reorder_level;
                                    return (
                                        <TableRow key={medication.id} className={isLowStock ? 'bg-red-100 dark:bg-red-900/50' : ''}>
                                            <TableCell>{medication.name}</TableCell>
                                            <TableCell>{medication.schedule}</TableCell>
                                            <TableCell>{medication.quantity_on_hand}</TableCell>
                                            <TableCell>{medication.reorder_level}</TableCell>
                                            <TableCell className="flex space-x-2">
                                                <SetStockModal medicationId={medication.id} currentQuantity={medication.quantity_on_hand} />
                                                <AddStockModal medicationId={medication.id} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default StockManagement;
