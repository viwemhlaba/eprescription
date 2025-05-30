import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function PrescriptionCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        prescription_file: null as File | null,
        delivery_method: 'pickup', // Default to pickup
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!data.prescription_file) return;

        post(route('customer.prescriptions.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Upload Prescription" description="Upload a valid prescription as PDF or image." />

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 py-6">
                    <div className="grid grid-rows-3 gap-4">
                        <div className="gap-4">
                            <Label htmlFor="name" className="pb-4">
                                Prescription Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g. Blood pressure meds"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="gap-4">
                            <Label htmlFor="prescription_file" className="pb-4">
                                Prescription File
                            </Label>
                            <Input
                                id="prescription_file"
                                type="file"
                                accept=".pdf,image/*"
                                onChange={(e) => setData('prescription_file', e.target.files?.[0] || null)}
                            />
                            {errors.prescription_file && <p className="mt-1 text-sm text-red-500">{errors.prescription_file}</p>}
                        </div>

                        <div className="gap-4">
                            <Label htmlFor="delivery_method" className="pb-4">
                                Delivery Method
                            </Label>
                            <Select value={data.delivery_method} onValueChange={(value) => setData('delivery_method', value)}>
                                <SelectTrigger id="delivery_method">
                                    <SelectValue placeholder="Select delivery method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pickup">I will pick up the medications</SelectItem>
                                    <SelectItem value="dispense">I would like the medications to be dispensed</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.delivery_method && <p className="mt-1 text-sm text-red-500">{errors.delivery_method}</p>}
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        Upload Prescription
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
