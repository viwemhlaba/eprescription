import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

export default function ViewPrescriptions() {
    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="View Prescriptions" description="View and manage prescriptions." />
                <p>Allows the pharmacist to view and manage patient prescriptions.</p>
            </div>
        </AppLayout>
    );
}
