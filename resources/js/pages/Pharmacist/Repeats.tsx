import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

export default function PharmacistRepeats() {
    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Pharmacist Repeats" description="View and manage your Repeats information." />
                <p>Allows the pharmacist to update their personal information and settings.</p>
            </div>
        </AppLayout>
    );
}
