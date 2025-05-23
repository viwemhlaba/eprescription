import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

export default function OrdersIndex() {
    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Orders" description="Track and manage customer and supplier orders." />
                <p>Allows the manager to review orders, update their status, and coordinate with suppliers.</p>
            </div>
        </AppLayout>
    );
}
