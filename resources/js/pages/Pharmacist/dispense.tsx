import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

export default function Dispense() {
    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Dispense Medication" description="View and manage medication dispensing." />
                <p>Allows the pharmacist to dispense medications to patients.</p>
            </div>
        </AppLayout>
    );
}
