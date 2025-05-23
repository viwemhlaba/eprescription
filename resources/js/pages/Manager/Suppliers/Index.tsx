import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

export default function SuppliersIndex() {
    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Suppliers" description="Manage pharmaceutical suppliers." />
                <p>Allows the manager to register, update, or remove suppliers for medications and inventory.</p>
            </div>
        </AppLayout>
    );
}
