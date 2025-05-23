import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

export default function MedicationsCatalogue() {
    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Medications Catalogue" description="List and manage medications available at the pharmacy." />
                <p>Allows the manager to add, update, or remove medications.</p>
            </div>
        </AppLayout>
    );
}
