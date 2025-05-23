import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

export default function StockIndex() {
    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Stock" description="Monitor and manage pharmacy stock levels." />
                <p>Allows the manager to view, adjust, and reorder stock for medications and supplies.</p>
            </div>
        </AppLayout>
    );
}
