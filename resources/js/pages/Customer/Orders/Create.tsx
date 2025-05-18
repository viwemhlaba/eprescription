import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Prescription = {
    id: number;
    name: string;
    created_at: string;
};

export default function OrderCreate({ prescriptions }: { prescriptions: Prescription[] }) {
    const { data, setData, post, processing, errors } = useForm({
        prescription_ids: [] as number[],
    });

    const handleCheckboxChange = (id: number) => {
        setData('prescription_ids', (prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('customer.orders.store'));
    };

    return (
        <AppLayout>
            <Head title="Create Order" />
            <div className="p-4">
                <Heading title="Create Order" description="Select prescriptions to be dispensed." />

                <form onSubmit={handleSubmit} className="mt-4 max-w-xl space-y-6">
                    {prescriptions.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No eligible prescriptions to order.</p>
                    ) : (
                        prescriptions.map((p) => (
                            <div key={p.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`pres-${p.id}`}
                                    checked={data.prescription_ids.includes(p.id)}
                                    onCheckedChange={() => handleCheckboxChange(p.id)}
                                />
                                <label htmlFor={`pres-${p.id}`} className="text-sm">
                                    {p.name} (Uploaded: {new Date(p.created_at).toLocaleDateString()})
                                </label>
                            </div>
                        ))
                    )}

                    {errors.prescription_ids && <p className="text-sm text-red-500">{errors.prescription_ids}</p>}

                    <Button type="submit" disabled={processing}>
                        Submit Order
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
