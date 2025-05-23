import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

export default function ReportsIndex() {
    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Reports" description="Access pharmacy statistics and summaries." />
                <p>Allows the manager to generate reports for prescriptions, stock, sales, and repeat requests.</p>
            </div>
        </AppLayout>
    );
}
