import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

// Define interface for DosageForm data
interface DosageForm {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface DosageFormEditProps {
    dosageForm: DosageForm; // Expects an existing dosage form
    errors: Record<string, string>;
}

export default function DosageFormEdit({ dosageForm, errors }: DosageFormEditProps) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        name: dosageForm.name, // Pre-fill with existing name
    });

    useEffect(() => {
        if (recentlySuccessful) {
            toast.success('Dosage form updated successfully!');
        }
    }, [recentlySuccessful]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('manager.dosageForms.update', dosageForm.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit ${dosageForm.name}`} />
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
                <Heading title={`Edit Dosage Form: ${dosageForm.name}`} description="Update the name of this dosage form." />

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Dosage Form Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Dosage Form Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                    autoFocus
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Dosage Form'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
