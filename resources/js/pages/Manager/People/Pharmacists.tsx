import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

export default function Pharmacists() {
    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Pharmacists" description="Manage pharmacy staff and roles." />
                <p>Allows the manager to add or remove pharmacists and assign roles or permissions.</p>
            </div>
        </AppLayout>
    );
}
